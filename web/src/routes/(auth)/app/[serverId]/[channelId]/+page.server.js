// TODO: INTEGRATE AUTH 

import { error } from "@sveltejs/kit"

export async function load({ params, fetch }) {
    console.log('ran')
    const resp = await fetch(`//127.0.0.1:8888/get/${params.serverId}/${params.channelId}`)
    if (resp.status !== 200)
        throw error(404)
    return {arr: await resp.json()}
}

