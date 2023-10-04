import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function load({ params, fetch, cookies }) {
	const user_id = cookies.get('user_id');

	const response = await fetch(`/api/v1/validate?serverId=${params.serverId}`);

	if (response.status !== 200) {
		throw error(403, "you don't have premium membership");
	}

	let resp1_img;
	let resp1_vid;
	if (params.channelId === 'favourites') {
		resp1_img = await fetch(
			`http://${env.IPC_DOMAIN}/get/${params.serverId}/${user_id}/favourites?images_only=true`
		);
		resp1_vid = await fetch(
			`http://${env.IPC_DOMAIN}/get/${params.serverId}/${user_id}/favourites?images_only=false`
		);
	} else {
		resp1_img = await fetch(
			`http://${env.IPC_DOMAIN}/get/${params.serverId}/${params.channelId}/images?user_id=${user_id}&page=${params.page}`
		);
		resp1_vid = await fetch(
			`http://${env.IPC_DOMAIN}/get/${params.serverId}/${params.channelId}/videos?user_id=${user_id}&page=${params.page}`
		);
	}
	const resp2 = await fetch(`http://${env.IPC_DOMAIN}/get/${params.serverId}`);
	if (resp1_img.status !== 200 || resp1_vid.status !== 200 || resp2.status !== 200)
		throw error(404);
	const images_data = await resp1_img.json();
	const videos_data = await resp1_vid.json();
	return {
		images: images_data.data,
		videos: videos_data.data,
		channels: await resp2.json(),
		total_pages: images_data.total_pages
	};
}
