import { redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, request }) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	if (!code) {
		throw redirect(307, '/');
	}
	const resp = await fetch('/api/v1/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ code: code })
	});
	if (resp.status === 200) {
		cookies.set('token', await resp.json(), { sameSite: 'none', path: '/' });
		throw redirect(307, '/');
	}
	throw redirect(307, '/');
}
