<script>
    import MediaCard from '../../../../../components/MediaCard.svelte';
	export let data;
    let playbackRate = 1;
    let mediaType = 'videos';
</script>

<div class="bg-black opacity-90 text-center text-xl font-bold py-2 px-4 rounded-lg">
    Channels
<div class="flex items-center text-center list text-xg underline justify-between flex-wrap p-3 rounded-lg space-x-5 sticky top-0">
    {#each data.channels as {name, id}}
        <a class='font-bold hover:text-xl text-sm capitalize' href={id}>{name}</a>
    {/each}
</div>
</div>

{#if data.images.length > 0 || data.videos.length > 0}
<div class="text-center text-xl m-2 opacity-90">
    Playback Rate: {playbackRate}x
    <input type="range" min="0.1" max="10" step="0.1" bind:value={playbackRate} class="w-full"/>
</div>
    <div class="flex justify-center m-2">
    <button title="Click To Change Media Mode" class="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg"
    on:click={() => {mediaType ===  'videos'? mediaType='images': mediaType='videos'}}>Show {mediaType === 'images' ? 'Videos' : 'Images'}</button>
    </div>
        <div class="mx-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {#if mediaType === 'images'}
            {#each data.images as src, index}
                <MediaCard src={src} {index} {playbackRate}/>
            {/each}
        {:else}
            {#each data.videos as src, index}
                <MediaCard src={src} {index} {playbackRate}/>
            {/each}
        {/if}
        </div>
{:else}
<div class="flex items-center justify-center h-screen">
   <div class="bg-black text-2xl font-bold py-40 px-48 rounded-lg"> No Content Available </div>
</div>
{/if}
