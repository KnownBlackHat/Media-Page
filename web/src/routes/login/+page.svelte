<script>
	import { goto } from '$app/navigation';
	export let data;
	const scopes = 'identify guilds guilds.members.read';
	const redirect_uri = data.redirect_uri;
	const client_id = data.client_id;
</script>

<div class="flex items-center justify-center h-screen">
	<button
		class="bg-black text-white rounded-md p-4 text-4xl"
		on:click={() => {
			goto(
				`https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&callback&response_type=code&scope=${scopes}`
			);
		}}>Discord Auth</button
	>
</div>
