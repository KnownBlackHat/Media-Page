import axios from 'axios';
import { redirect } from '@sveltejs/kit';

// TODO: INTEGRATE AUTH 

export async function load({ params }) {
    const resp = await axios.get(`//127.0.0.1:8888/get/${params.serverId}`)
    throw redirect(308, `${params.serverId}/${resp.data[0].id}`)
}

