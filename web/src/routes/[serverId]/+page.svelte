<script>
	export let data;
</script>

{#if data.error}
	This server didn't bought our service
{:else}
	{#each data as ch}
		<a href={`/${data.id}}`}>
			<div class="text-center border-white border-2 overflow-auto rounded-md">
				<div class="font-bold sticky top-0 bg-black">{ch.topic}</div>
			</div>
		</a>
	{/each}
{/if}
