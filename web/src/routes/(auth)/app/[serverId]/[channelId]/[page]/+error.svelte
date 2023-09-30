<script>
	import { page } from '$app/stores';
</script>

{#if $page.status == 403}
	<div class="flex items-center justify-center h-screen">
		<div class="bg-black md:text-2xl text-center font-bold py-36 px-48 rounded-lg mt-4">
			<h1 class="text-xl md:text-4xl font-bold">
				You need to buy premium subscription to access this page
			</h1>
			<p class="text-sm md:text-xl">
				You can buy premium subscription from following discord server
			</p>
			<div class="mt-10 text-center items-center justify-center flex">
				<iframe
					title="Discord Widget"
					class="md:w-[600px] h-[350px] rounded-lg"
					src="https://discord.com/widget?id={$page.params.serverId}&theme=dark"
					allowtransparency="true"
					frameborder="0"
					sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
				/>
			</div>
		</div>
	</div>
{/if}
