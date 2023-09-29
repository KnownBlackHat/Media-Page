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
import VolumeButton from './VolumeButton.svelte';

let paused=true;
let duration=0;
let currentTime=0;
let parent;
let media;
let controlsVisiblity=true;
let notification;
let playbackRate=1;
let timeoutCanceler;
let loading=false;

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
    <div>
    <div class="relative" id="top-block">
        <div class="absolute top-0 right-0 p-1" class:invisible={!controlsVisiblity}>
            <button title="Download" class="text-white p-1 rounded h-10" on:click={() => window.open(src)} target="_blank" download>
                <Download/>
            </button>
        </div>
<div class="relative">
  <div class="absolute inset-0 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
</div>
        {#if notification}
        <div id="Notification" class="flex justify-center items-center absolute bg-black top-96 rounded h-20 opacity-50 text-2xl left-[50%] p-3">
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
        </div>
        {/if}
        <div class="absolute top-0 left-0 p-1" class:invisible={!controlsVisiblity}>
            <button title="Favourite" class="text-white p-1 rounded h-10 text-red-500" on:click={() => {}}><Favourite {src} {favourite}/></button>
        </div>
    </div>

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
    <div id='video-player'>
    <video async class="h-60 w-full rounded bg-black" data-src={src} media-id={index} preload="auto" playsinline loop
        use:viewport
        on:waiting={() => {loading=true}}
        on:canplaythrough={() => {loading=false}}
        on:loadeddata={() => {loading=false}}
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
    <div class="relative" id="lower-block" class:invisible={!controlsVisiblity}>
        <div class="absolute bottom-0 left-0 right-0 w-full">
            <div id="seek" class="flex mx-1">
                <input class="w-full mx-2" type="range" min="0" max={duration} title="Seek" step="0.01" bind:value={currentTime} />
            </div>
            <div class="flex gap-0.5 p-0.5 align-center items-center cursor-pointer" title="Player Controls">
                <button class="text-white rounded h-5 inline-block" title={paused? 'Play' : 'Pause'} on:click={() => {paused ? media.play() : media.pause()}}>{#if paused}<Play/> {:else} <Pause/> {/if}</button>
                <div class="mx-2 text-white rounded inline-block" title="Playback Rate"
                on:click={() => {playbackRate === 3.0 ? playbackRate=1 : playbackRate++}} role="button" tabindex="0"
                on:keydown={(e) => {if (e.key === "Enter") {playbackRate === 3.0 ? playbackRate=1 : playbackRate++}}}>
                     {playbackRate}x
                 </div>
                 {#if media}
                <VolumeButton {media}/>
                {/if}
                <div id="duration" class='grow p-2 mx-1'>
                {format(currentTime)}/ {format(duration)}
                </div>
                <button class="text-white rounded h-5 mx-2" title="Full Screen" on:click={togglefullscreen}><FullScreen/></button>
            </div>
        </div>
    </div>
{/if}
</div>
</div>
