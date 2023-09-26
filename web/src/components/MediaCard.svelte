<script>
export let src;
export let favourite;
export let index;

import { fade } from 'svelte/transition';
import viewport from '../actions/ViewPort';
import Play from './PlayIcon.svelte';
import Pause from './PauseIcon.svelte';
import FullScreen from './FullScreenIcon.svelte';
import Download from './DownloadIcon.svelte';
import Favourite from './FavouriteIcon.svelte';
import SeekForward from './SeekForwardIcon.svelte';
import SeekBackward from './SeekBackwardIcon.svelte';

let paused=true;
let duration=0;
let currentTime=0;
let parent;
let media;
let controlsVisiblity=true;
let notification;
let playbackRate=1;
let timeoutCanceler;

function format(seconds) {
		if (isNaN(seconds)) return '...';

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;

		return `${minutes}:${seconds}`;
	}

function togglefullscreen() {
    if (!document.fullscreenElement) {
        parent.requestFullscreen()
        media.classList.remove("h-60", "w-full")
        media.classList.add("h-screen", "w-screen")
    } else {
        document.exitFullscreen()
    }
}

function unhideControls() {
    controlsVisiblity=true;
    clearTimeout(timeoutCanceler)
    timeoutCanceler = setTimeout(() => {controlsVisiblity = false}, 5000)
}

function notify(message) {
    notification = message;
    setTimeout(() => {notification = null}, 2000)
}

</script>

<svelte:window on:fullscreenchange={() => {
    if (!document.fullscreenElement && media.play) {
        media.classList.remove("h-screen", "w-screen")
        media.classList.add("h-60", "w-full")
    }
}} />

<div transition:fade class="rounded border-2 h-fit border-white overflow-hidden" role="button" tabindex="0"
on:pointermove={unhideControls}
on:touchstart={unhideControls}
on:keydown={(e) => { 
    unhideControls()
    switch(e.key) {
        case "f":
            togglefullscreen()
            break;
        case " ":
            paused ? media?.play() : media?.pause()
            notify(paused ? 'Playing' : 'Paused')
            break;
        case "ArrowLeft":
            media.currentTime -= 5
            notify('Seek Backward')
            break;
        case "ArrowRight":
            media.currentTime += 5
            notify('Seek Forward')
            break;
        case "ArrowUp":
            if (media.playbackRate < 3.0) {
                media.playbackRate += 0.5
                notify(`${media.playbackRate}x`)
            }
            break;
        case "ArrowDown":
            if (media.playbackRate > 0.5) {
                media.playbackRate -= 0.5
                notify(`${media.playbackRate}x`)
            }
            break;
        }}}
bind:this={parent}
>
    <div class="relative">
    <span class="absolute top-0 right-0 p-1" class:invisible={!controlsVisiblity}>
        <button title="Download" class="text-white p-1 rounded h-10" href={src} target="_blank" download>
            <Download/>
        </button>
    </span>
    {#if notification}
    <span id="Notification" class="flex justify-center items-center absolute bg-black top-96 rounded h-20 opacity-50 text-2xl left-[50%] p-3">
    {#if notification}
        {#if notification === 'Playing'}
            <Play/>
        {:else if notification === "Paused"}
            <Pause/>
        {:else if notification === "Seek Forward"}
            <SeekForward/>
        {:else if notification === "Seek Backward"}
            <SeekBackward/>
        {:else}
            {notification}
        {/if}
    {/if}
    </span>
    {/if}
    <span class="absolute top-0 left-0 p-1" class:invisible={!controlsVisiblity}>
        <button title="Favourite" class="text-white p-1 rounded h-10 text-red-500" on:click={() => {}}><Favourite {src} {favourite}/></button>
    </span>
{#if src.match(/\.(jpe?g|png|gif|webp)/)}
    <div class="bg-black inset-0"> 

    <img async preload="auto" class="rounded  h-[15em] mx-auto bg-black"
        use:viewport
        bind:this={media}
        on:enterViewport={e => {
            if (e.target.src) return;
                e.target.src = e.target.dataset.src
            }}
        media-id={index} data-src={src} alt={src} on:click={(e) => {
        ["top-0","h-screen"].map(v=>{
                e.target.classList.toggle(v);
                });
        ["fixed", "z-20"].map(v=>{
                e.target.parentElement.classList.toggle(v);
                })
        document.body.classList.toggle("overflow-y-hidden");
    }}/>
    </div>
{:else}
    <div>
    <video async class="h-60 w-full rounded bg-black" data-src={src} media-id={index} preload="auto" playsinline loop
        use:viewport
        on:error={e => {
            if (!e.target.src.startsWith("http")) return;
            setTimeout(() => {
                e.target.load()
            }, 1000);
            }}
        on:enterViewport={e => {
            if (e.target.src) return;
                e.target.src = e.target.dataset.src
            }}
        on:exitViewport={e => {e.target.pause()}}
        bind:this={media}
        bind:playbackRate
        bind:paused
        bind:duration
        bind:currentTime
        on:mouseenter={e => e.target.focus()}
        on:click={(e) => {e.target.paused ? e.target.play() : e.target.pause()}}
                >
        <track kind="captions" />
    </video>
    </div>
    <span class="flex absolute bottom-0 right-0 left-0 z-20 justify-between items-center px-2" title="Player Controls" class:invisible={!controlsVisiblity}>
    <button class="text-white p-1 rounded h-10" title={paused? 'Play' : 'Pause'} on:click={() => {paused ? media.play() : media.pause()}}>{#if paused}<Play/> {:else} <Pause/> {/if}</button>
    <span>{format(currentTime)}</span>
    <input class="w-full mx-2" type="range" min="0" max={duration} title="Seek" step="0.01" bind:value={currentTime} />
    <span>{format(duration)}</span>
    <div class="mx-2 text-white rounded p-1" title="Playback Rate"
    on:click={() => {playbackRate === 3.0 ? playbackRate=1 : playbackRate++}} role="button" tabindex="0"
    on:keydown={(e) => {if (e.key === "Enter") {playbackRate === 3.0 ? playbackRate=1 : playbackRate++}}}>
         {playbackRate}x
     </div>
    <button class="text-white p-1 rounded h-10 mx-2" title="Full Screen" on:click={togglefullscreen}><FullScreen/></button>
    </span>
{/if}
</div>
</div>
