<script>
    import MediaCard from '../../../../../components/MediaCard.svelte';
	export let data;
    let playbackRate = 1;
</script>

<div class="flex items-center text-center space-x-5 sticky top-0">
    {#each data.arr as {name, id}}
        <a href={id}>{name}</a>
    {/each}
</div>

{#if data.arr.length}
<div class="text-center text-2xl sticky top-0 z-10 bg-black opacity-75">
    Playback Rate: {playbackRate}x
    <input type="range" min="0.1" max="10" step="0.1" bind:value={playbackRate} class="w-full"/>
</div>
        <div class="mx-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {#each data.arr as src, index}
                <MediaCard src={src} {index} {playbackRate}/>
            {/each}
        </div>
{:else}
<div class="flex items-center justify-center h-screen">
   <div class="bg-black text-2xl font-bold py-40 px-48 rounded-lg"> No Content Available </div>
</div>
{/if}
