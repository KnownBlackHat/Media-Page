import { CLIENT_ID, REDIRECT_URI } from '$env/dynamic/private';

export async function load() {
	return { client_id: CLIENT_ID, redirect_uri: REDIRECT_URI };
}
