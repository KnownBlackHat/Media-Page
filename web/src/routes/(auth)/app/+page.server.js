import { redirect } from '@sveltejs/kit';
import { IPC_DOMAIN } from '$env/static/private';

const get_user_guilds = async (fetch, token) => {
	const user_guilds = await fetch('https://discord.com/api/v10/users/@me/guilds', {
		headers: { Authorization: token }
	});
	if (user_guilds.status !== 200) throw redirect(307, '/login');
	return await user_guilds.json();
};

export async function load({ cookies, fetch, parent }) {
	const token = cookies.get('token');
	const user_info = await parent();
	const user_guilds = await get_user_guilds(fetch, token);
	const resp = await fetch(`//${IPC_DOMAIN}/get/servers`);
	const premium_guild = await resp.json();
	const new_user_guilds = user_guilds.filter((guild) =>
		premium_guild.includes(guild.id.toString())
	);
	user_info.guilds = new_user_guilds;
	return user_info;
}
