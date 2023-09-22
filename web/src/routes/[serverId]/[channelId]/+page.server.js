import axios from 'axios';

// TODO: INTEGRATE AUTH 

export async function load({ params }) {
    const resp = await axios.get(`//127.0.0.1:8888/get/${params.serverId}/${params.channelId}`)
    return {arr: resp.data}
}

