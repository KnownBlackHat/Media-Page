import { error, redirect } from "@sveltejs/kit";
import { ROLE_ID } from "$env/static/private";

const validateUserRole = async (token, roleId, serverId, fetch) => {
    const resp = await fetch(`https://discord.com/api/v10/users/@me/guilds/${serverId}/member`, {
        headers: { Authorization: token}})
    if (resp.status !== 200) {
        console.log('status', resp.status)
        return false
    }
    const { roles } = await resp.json()
    if (!roles.includes(roleId)) {
        throw error(403, "You don't have premium membership")
    }
    return true
}

export async function load({ params, fetch, cookies }) {
    const token = cookies.get('token')
    const validation = await validateUserRole(token, ROLE_ID, params.serverId, fetch)
    if (!validation) {
        throw redirect(302, '/') 
    }
    const resp1_img = await fetch(`//127.0.0.1:8888/get/${params.serverId}/${params.channelId}/images`)
    const resp1_vid = await fetch(`//127.0.0.1:8888/get/${params.serverId}/${params.channelId}/videos`)
    const resp2 = await fetch(`//127.0.0.1:8888/get/${params.serverId}`)
    if (resp1_img.status !== 200 || resp1_vid.status !== 200 || resp2.status !== 200)
        throw error(404)
    return {images: await resp1_img.json(), videos: await resp1_vid.json(), channels: await resp2.json()}
}

