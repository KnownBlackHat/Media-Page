import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
    throw redirect(308, `/app/${params.serverId}/${params.channelId}/1`)
}


