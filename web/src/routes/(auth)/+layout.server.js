import { error, redirect } from '@sveltejs/kit';

const get_user_info = async (fetch, token) => {
	const user_info = await fetch('https://discord.com/api/v10/users/@me', {
		headers: { Authorization: token }
	});
    if (user_info.status !== 200) throw redirect(301, '/login')
	return await user_info.json();
};

const get_user_guilds = async (fetch, token) => {
	const user_guilds = await fetch('https://discord.com/api/v10/users/@me/guilds', {
		headers: { Authorization: token }
	});
    if (user_guilds.status !== 200) throw redirect(301, '/login')
	return await user_guilds.json();
};


export async function load({ cookies, fetch }) {
    const token = cookies.get('token')
    console.log('reauth', token)
	if (!token) {
		throw redirect(303, '/login');
	} else {
        const user_info = await get_user_info(fetch, token);
        const user_guilds = await get_user_guilds(fetch, token);
        user_info.guilds = user_guilds;
        return user_info;
    }
}
