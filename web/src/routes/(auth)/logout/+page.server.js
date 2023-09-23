import { redirect } from "@sveltejs/kit"
import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';


export async function load({ cookies, fetch }) {
    const token = cookies.get('token')
    if (!token) throw redirect(308, '/login')
    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        token: token.split(' ')[1],
        token_type: token.split(' ')[0],
    }
    const rep = await fetch('https://discord.com/api/oauth2/token/revoke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payload)
    })
    if (rep.status === 200)
        cookies.delete('token')
    throw redirect(308, '/')
}
