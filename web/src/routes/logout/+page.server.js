import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function load({ cookies, fetch }) {
	const token = cookies.get('token');
	if (!token) throw redirect(301, '/login');
	const payload = {
		client_id: env.CLIENT_ID,
		client_secret: env.CLIENT_SECRET,
		token: token.split(' ')[1],
		token_type: token.split(' ')[0]
	};
	const rep = await fetch('https://discord.com/api/oauth2/token/revoke', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams(payload)
	});
	if (rep.status === 200) cookies.delete('token');
	cookies.delete('user_id');
	const resp = await fetch(`http://${env.IPC_DOMAIN}/get/servers`);
	const premium_guild = await resp.json();
	premium_guild.forEach((guild) => {
		cookies.delete('fphash', { path: `/app/${guild}` });
	});
	throw redirect(301, '/');
}
