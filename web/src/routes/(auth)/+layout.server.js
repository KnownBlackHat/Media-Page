import { redirect } from '@sveltejs/kit';

const get_user_info = async (fetch, token) => {
	const user_info = await fetch('https://discord.com/api/v10/users/@me', {
		headers: { Authorization: token }
	});
	if (user_info.status !== 200) throw redirect(301, '/login');
	return await user_info.json();
};

export async function load({ cookies, fetch }) {
	const token = cookies.get('token');
	if (!token) {
		throw redirect(302, '/login');
	} else {
		const user_info = await get_user_info(fetch, token);
		const { id } = user_info;
		cookies.set('user_id', id, { sameSite: 'none', path: '/' });
		return user_info;
	}
}
