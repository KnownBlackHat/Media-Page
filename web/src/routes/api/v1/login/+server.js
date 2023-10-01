import { error, json } from '@sveltejs/kit';
import axios from 'axios';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	const response = await request.json();
	const data = {
		client_id: env.CLIENT_ID,
		client_secret: env.CLIENT_SECRET,
		grant_type: 'authorization_code',
		code: response.code,
		redirect_uri: env.REDIRECT_URI
	};
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	const res = await axios.post('https://discord.com/api/oauth2/token', data, { headers });
	const token = `${res.data.token_type} ${res.data.access_token}`;
	const required_scope = ['identify', 'guilds.members.read', 'guilds'];
	const scopes = res.data.scope.split(' ');
	scopes.forEach((v) => {
		if (!required_scope.includes(v)) {
			throw error(405, 'Insufficient Scopes');
		}
	});
	return json(token, { status: 200 });
}
