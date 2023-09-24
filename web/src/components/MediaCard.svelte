<script>
export let src;
export let index;
export let playbackRate;

import { fade } from 'svelte/transition';
import viewport from '../actions/ViewPort';
import Play from './PlayIcon.svelte';
import Pause from './PauseIcon.svelte';
import FullScreen from './FullScreenIcon.svelte';
import Download from './DownloadIcon.svelte';

let downloadBtn;
let paused=true;
let duration=0;
let currentTime=0;
let media;

function format(seconds) {
		if (isNaN(seconds)) return '...';

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;

		return `${minutes}:${seconds}`;
	}
</script>

<div transition:fade class="rounded border-2 h-fit border-white overflow-hidden" role="button" tabindex="0"
on:mouseenter={() => {downloadBtn.style.visibility="visible"}}
on:mouseleave={() => {downloadBtn.style.visibility="hidden"}}
>
    <div class="relative invisible" bind:this={downloadBtn}>
    <span class="absolute top-0 right-0 p-1">
        <button title="Download" class="bg-gray-700 text-white p-1 rounded h-10" href={src} target="_blank" download>
            <Download/>
        </button>
    </span>
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
        on:keypress={(e) => { 
            switch(e.key) {
                case "f":
                    if (!document.fullscreenElement) {
                            e.target.play()
                            e.target.requestFullscreen()
                            e.target.controls = true
                        }
                    else {
                            document.exitFullscreen()
                            e.target.controls = false
                        }
                }}}
        on:click={(e) => {e.target.paused ? e.target.play() : e.target.pause()}}
                >
        <track kind="captions" />
    </video>
    <span class="flex justify-between items-center px-2">
    <button class="text-white p-1 rounded h-10" title={paused? 'Play' : 'Pause'} on:click={() => {paused ? media.play() : media.pause()}}>{#if paused}<Play/> {:else} <Pause/> {/if}</button>
    <span>{format(currentTime)}</span>
    <input class="w-full mx-2" type="range" min="0" max={duration} title="Seek" step="0.01" bind:value={currentTime} />
    <span>{format(duration)}</span>
    <button class="text-white p-1 rounded h-10 ml-2" title="Full Screen" on:click={() => {media.requestFullscreen(); media.controls=true; media.play()}}><FullScreen/></button>
    </span>
{/if}
</div>
