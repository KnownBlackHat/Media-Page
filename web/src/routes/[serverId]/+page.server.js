import { error } from '@sveltejs/kit';
import axios from 'axios';

const get_guild_channels = async (id) => {
	const token = 'Bot MTEwOTEzMTk0OTI1NzI4MTY2OQ.Gk3ow5.iaquiLa8imP3L9LCqA1GVGoRaQtbzKppO3I_O8';
	const guild_info = await axios.get(`//discord.com/api/v10/guilds/${id}/channels`, {
		headers: { Authorization: token }
	});
	return guild_info.data;
};

export async function load({ params, cookies }) {
	const token = cookies.get('token');
	if (token) {
		try {
			const guild_info = await get_guild_channels(token, params.serverId);
			console.log(guild_info);
			return guild_info;
		} catch {
			return { error: 401 };
		}
	}
	return null;
}
