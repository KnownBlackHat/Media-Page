import { error, json } from '@sveltejs/kit';
import axios from 'axios';
import { CLIENT_ID } from '$env/static/private';

export async function POST({ request, cookies}) {
    const token = cookies.get('token');
    const userId = cookies.get('user_id');
    const { serverId, link, mode } = await request.json();

    if (!token) throw error(401, 'Unauthorized');

    const resp = await axios.get('https://discord.com/api/v10/oauth2/@me', {
        headers: { authorization: token, }})

    if (resp.status !== 200) throw error(401, 'Unauthorized');
    
    const { application, user } = resp.data;
    if (application.id !== CLIENT_ID) throw error(401, 'Unauthorized');
    if (!user?.id) throw error(401, 'Unauthorized');

    const resp2 = await axios.get(`//127.0.0.1:8888/modify/${serverId}/${userId}/favourite?link=${link}&mode=${mode}`)
    if (resp2.status !== 200) throw error(500, 'Internal Server Error');
    return json({success: true})
}
