<script>
	export let data;
	import { browser } from '$app/environment';

	const delete_cookie = function (name) {
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	};
</script>

{#if browser}
	{#if data.id}
		<div class="flex justify-between items-center">
			<img
				src={`//cdn.discordapp.com/avatars/${data.id}/${data.avatar}.jpg`}
				alt={data.avatar}
				class="rounded-full w-[4rem] h-[4rem] ml-5 border-black border-2"
			/>
			<div class="ml-10 text-3xl">{data.global_name}</div>
			<button
				class="bg-black text-white m-4 rounded-md text-center p-2"
				on:click={() => {
					delete_cookie('token');
					window.location.reload();
				}}>Logout</button
			>
		</div>
		<div class="grid grid-cols-5 gap-5">
			{#each data.guilds as srv}
				<a href="/{srv.id}">
					<div class="text-center border-white border-2 overflow-auto rounded-md">
						<div class="server-name font-bold sticky top-0 bg-black">{srv.name}</div>
						<img
							class="w-full object-cover"
							alt={srv.icon}
							src={srv.icon
								? `//cdn.discordapp.com/icons/${srv.id}/${srv.icon}.png`
								: '//global-img.gamergen.com/logo-gg-discord-1_0000932383.jpg'}
						/>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="flex items-center justify-center h-screen">
			<button
				class="bg-black text-white rounded-md p-4 text-4xl"
				on:click={() => {
					window.location.href = `https://discord.com/api/oauth2/authorize?client_id=1141441374508548241&redirect_uri=${window.location}callback&response_type=code&scope=identify guilds`;
				}}>Discord Auth</button
			>
		</div>
	{/if}
{/if}
