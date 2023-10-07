import { redirect } from '@sveltejs/kit';


export const get_user_info = async (fetch, token) => {
	const user_info = await fetch('https://discord.com/api/v10/users/@me', {
		headers: { Authorization: token }
	});
	if (user_info.status !== 200) throw redirect(307, '/login');
	const data = await user_info.json();
    data.status = user_info.status;
    return data
};

