import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

const validateUserRole = async (token, roleId, serverId, fetch) => {
	const resp = await fetch(`https://discord.com/api/v10/users/@me/guilds/${serverId}/member`, {
		headers: { Authorization: token }
	});
	if (resp.status !== 200) {
		return false;
	}
	const { roles } = await resp.json();
	if (!roles.includes(roleId)) {
		throw error(403, "You don't have premium membership");
	}
	return true;
};

const sign_jwt = async (token, serverId, id, cookies, fetch) => {
		const validation = await validateUserRole(token, id, serverId, fetch);
		if (!validation) throw error(403, "You don't have premium membership");

		const user_info = await fetch('https://discord.com/api/v10/users/@me', {
			headers: { Authorization: token }
		});
        let premium = true;
		if (user_info.status !== 200) premium = false;
		const userId = await user_info.json();
		const nfphash = jwt.sign(
			{
				dtoken: token,
				server_id: serverId,
				role_id: id,
				is_premium: premium,
				user_id: userId.id,
				cookie_path: `/app/${serverId}`,
				exp: premium? Math.floor(Date.now() / 1000) + 3600 : Math.floor(Date.now() / 1000) + 600
			},
			env.SIGN_PASS
		);
		cookies.set('fphash', nfphash, { sameSite: 'Lax', secure: false, path: `/app/${serverId}` });
}

export async function GET({ cookies, fetch, url }) {
	const token = cookies.get('token');
	const userid = cookies.get('user_id');
	const serverId = url.searchParams.get('serverId');
	const resp = await fetch(`http://${env.IPC_DOMAIN}/get/${serverId}/premium_role_id`);
	const { id } = await resp.json();
	if (!token || !id) throw error(403, "You don't have premium membership");
	const fphash = cookies.get('fphash');
	if (fphash) {
		try {
			const hash = jwt.verify(fphash, env.SIGN_PASS);
			const { is_premium, role_id, server_id, dtoken, user_id, cookie_path } = hash;
			if (
				role_id === id &&
				server_id === serverId &&
				dtoken === token &&
				is_premium === true &&
				user_id === userid &&
				cookie_path === `/app/${serverId}`
			) {
				return json({ success: true });
			} else {
				cookies.delete('fphash', { path: `/app/${serverId}` });
				throw error(401, 'Unauthorized');
			}
		} catch (err) {
			cookies.delete('fphash', { path: `/app/${serverId}` });
            if (err.name === 'TokenExpiredError') {
                await sign_jwt(token, serverId, id, cookies, fetch);
            } else {
			throw error(401, 'Unauthorized');
            }
		}
	} else {
        await sign_jwt(token, serverId, id, cookies, fetch);
	}
	return json({ success: true });
}
