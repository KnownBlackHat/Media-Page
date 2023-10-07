import { redirect } from '@sveltejs/kit';
import { get_user_info } from '$lib/utils.js';

export async function load({ cookies, fetch }) {
	const token = cookies.get('token');
	if (!token) {
		throw redirect(302, '/login');
	} else {
		const user_info = await get_user_info(fetch, token);
		const { id } = user_info;
		cookies.set('user_id', id, { sameSite: 'Lax', secure: false, path: '/' });
		return user_info;
	}
}
