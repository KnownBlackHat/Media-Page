import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    const resp = await fetch(`//127.0.0.1:8888/get/${params.serverId}`)
    if (resp.status !== 200)
        throw error(404)
    const channels = await resp.json()
    if (!channels.length) throw error(404)
    throw redirect(308, `/app/${params.serverId}/${channels[0].id}`)
}

