import { json } from '@sveltejs/kit';
import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';

export async function POST({ request }) {
	const response = await request.json();
	const data = {
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		grant_type: 'authorization_code',
		code: response.code,
		redirect_uri: REDIRECT_URI
	};
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	const res = await axios.post('https://discord.com/api/oauth2/token', data, { headers });
	const token = `${res.data.token_type} ${res.data.access_token}`;
	return json(token, { status: 200 });
}
