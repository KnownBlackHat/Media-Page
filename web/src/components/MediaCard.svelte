<script>
export let src;
export let index;
export let playbackRate;

import { fade } from 'svelte/transition';
import viewport from '../actions/ViewPort';

let downloadBtn;
let paused=true;
let duration=0;
let currentTime=0;

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
        <a class="bg-black text-white p-1 rounded" href={src} target="_blank" download>
            🔗
        </a>
    </span>
    </div>
{#if src.match(/\.(jpe?g|png|gif)/)}
    <div class="bg-black inset-0"> 

    <img async preload="auto" class="rounded  h-[15em] mx-auto bg-black"
        use:viewport
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
    <video async class="h-60 w-full rounded" data-src={src} media-id={index} preload="auto" playsinline loop
        use:viewport
        on:error={e => {
            if (!e.targer.src.startsWith("http")) return;
            setTimeout(() => {
                e.target.load()
            }, 1000);
            }}
        on:enterViewport={e => {
            if (e.target.src) return;
                e.target.src = e.target.dataset.src
            }}
        on:exitViewport={e => {e.target.pause()}}
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
    <span class="flex justify-between px-2">
    <span>{format(currentTime)}</span>
    <input class="w-full mx-2" type="range" min="0" max={duration} step="0.01" bind:value={currentTime} />
    <span>{format(duration)}</span>
    </span>
{/if}
</div>
