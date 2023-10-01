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

export async function GET({ cookies, fetch, url }) {
	const token = cookies.get('token');
	const userid = cookies.get('user_id');
	const serverId = url.searchParams.get('serverId');
	const resp = await fetch(`//${env.IPC_DOMAIN}/get/${serverId}/premium_role_id`);
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
			throw error(401, 'Unauthorized');
		}
	} else {
		const validation = await validateUserRole(token, id, serverId, fetch);
		if (!validation) throw error(403, "You don't have premium membership");

		const user_info = await fetch('https://discord.com/api/v10/users/@me', {
			headers: { Authorization: token }
		});
		if (user_info.status !== 200) throw error(401, 'Unauthorized');
		const userId = await user_info.json();
		const nfphash = jwt.sign(
			{
				dtoken: token,
				server_id: serverId,
				role_id: id,
				is_premium: true,
				user_id: userId.id,
				cookie_path: `/app/${serverId}`,
				expiresIn: '1h'
			},
			env.SIGN_PASS
		);
		cookies.set('fphash', nfphash, { path: `/app/${serverId}` });
	}
	return json({ success: true });
}
