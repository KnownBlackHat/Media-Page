// import axios from 'axios';

// const get_user_info = async (token) => {
// 	const user_info = await axios.get('https://discord.com/api/v10/users/@me', {
// 		headers: { Authorization: token }
// 	});
// 	return user_info.data;
// };

// const get_user_guilds = async (token) => {
// 	const user_guilds = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
// 		headers: { Authorization: token }
// 	});
// 	return user_guilds.data;
// };

// export const load = async ({ cookies, fetch }) => {
// 	const token = cookies.get('token');
//     const resp = await fetch('//127.0.0.1:8888/get/servers')
//     const premium_guild = await resp.json()
// 	if (token) {
// 		try {
// 			const user_info = await get_user_info(token);
// 			const user_guilds = await get_user_guilds(token);
// 			user_info.guilds = user_guilds;
// 			return user_info;
// 		} catch {
// 			return null;
// 		}
// 	}
// 	return null;
// };
