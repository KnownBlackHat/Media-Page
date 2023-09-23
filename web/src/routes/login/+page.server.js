import { CLIENT_ID } from '$env/static/private'

export async function load() {
    return {client_id: CLIENT_ID}
}
