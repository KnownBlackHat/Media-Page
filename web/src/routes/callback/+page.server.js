import { redirect } from "@sveltejs/kit";

export async function load ({ cookies, fetch, request }) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    if (!code) {
        throw redirect(301, '/');
    }
    const resp = await fetch('//localhost:5173/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
        body: JSON.stringify({code: code}),
    });
    if (resp.status === 200) {
        cookies.set('token', await resp.json(), { path: '/' });
        throw redirect(301, '/');
    }
    throw redirect(301, '/');
}
