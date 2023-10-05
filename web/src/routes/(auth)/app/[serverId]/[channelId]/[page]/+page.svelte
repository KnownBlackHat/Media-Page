<script>
	import MediaCard from '../../../../../../components/MediaCard.svelte';
	import { page } from '$app/stores';
	export let data;
	let mediaType = 'videos';
	$: current_page = Number($page.params.page);
</script>

<div class="bg-black opacity-90 text-center text-xl font-bold py-2 px-4 rounded-lg">
	Channels
	<div
		class="flex items-center text-center list text-xg justify-between flex-wrap p-3 rounded-lg space-x-5 sticky top-0"
	>
    <span/>
		<a class="font-boldhover:text-xl text-sm capitalize hover:text-black rounded-lg p-2 hover:bg-white" href={'../favourites'}
        class:text-black={$page.params.page === 'favourites'}
        class:bg-white={$page.params.page === 'favourites'}
        >favourites</a>
		{#each data.channels as { name, id }}
			<a class="font-bold underline text-sm capitalize hover:text-black rounded-lg p-2 hover:bg-white" href={'../' + id}
            class:text-black={$page.params.channelId === id}
            class:bg-white={$page.params.channelId === id}
            >{name}</a>
		{/each}
	</div>
</div>

{#if data.images?.length > 0 || data.videos?.length > 0}
	<div
		title="page index"
		class="flex overflow-x-hidden items-center text-center list text-xl justify-between overflow-y-scroll bg-black text-white p-3 rounded-lg space-x-5"
	>
		{#each Array(data.total_pages) as _, idx}
			<a
				href={idx + 1}
				class:text-black={idx + 1 === current_page}
				class:bg-white={idx + 1 === current_page}
				class="text-sm hover:bg-white hover:text-black p-2 rounded-lg">{idx + 1}</a
			>
		{/each}
	</div>
	<div class="flex justify-center m-2 space-x-5">
		<button
			title="Shuffle"
			class="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg"
			on:click={() => {
				data.images = data.images.sort(() => Math.random() - 0.5);
				data.videos = data.videos.sort(() => Math.random() - 0.5);
			}}>Shuffle</button
		>
		<button
			title="Click To Change Media Mode"
			class="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg"
			on:click={() => {
				mediaType === 'videos' ? (mediaType = 'images') : (mediaType = 'videos');
			}}>Show {mediaType === 'images' ? 'Videos' : 'Images'}</button
		>
	</div>
	<div class="mx-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
		{#if mediaType === 'images'}
			{#each data.images as src, index (src.link)}
				<MediaCard src={src.link} favourite={src.favourite} {index} />
			{/each}
		{:else}
			{#each data.videos as src, index (src.link)}
				<MediaCard src={src.link} favourite={src.favourite} {index} />
			{/each}
		{/if}
	</div>
{:else}
	<div class="flex items-center justify-center h-screen">
		<div class="bg-black text-2xl font-bold py-40 px-48 rounded-lg">No Content Available</div>
	</div>
{/if}

