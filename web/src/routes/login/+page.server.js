import { env } from '$env/dynamic/private';

export async function load() {
	return { client_id: env.CLIENT_ID, redirect_uri: env.REDIRECT_URI };
}
