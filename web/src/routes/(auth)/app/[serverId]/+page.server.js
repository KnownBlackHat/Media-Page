import { error, redirect } from '@sveltejs/kit';
import { IPC_DOMAIN } from '$env/dynamic/private';

export async function load({ params, fetch }) {
	const resp = await fetch(`//${IPC_DOMAIN}/get/${params.serverId}`);
	if (resp.status !== 200) throw error(404);
	const channels = await resp.json();
	if (!channels.length) throw error(404);
	console.log('redirecting to', `/app/${params.serverId}/${channels[0].id}`);
	throw redirect(308, `/app/${params.serverId}/${channels[0].id}`);
}
