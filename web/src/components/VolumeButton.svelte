<script>
export let media;

let controls;
let controlsVisiblity = false;
let volumeval = 100;

function progressScript() {
  controls.style.background = `linear-gradient(to right, #f50 ${volumeval}%, #ccc ${volumeval}%)`;
  media.volume = controls.value / 100;
}

</script>

<div class='inline-block'>
<div class="flex items-center justify-center">

  <button
    class="h-5 text-gray-700 rounded-full"
    on:click={() => controlsVisiblity = true}
    on:mouseenter={() => controlsVisiblity = true}
    on:mouseleave={() => controlsVisiblity = false}
    on:blur={() => controlsVisiblity = false}
    on:focusout={() => controlsVisiblity = false}
    on:focusin={() => controlsVisiblity = true}
  >
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 24 24" fill="white" aria-hidden="true" class="player-icon"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>
  </button>
      <div class="rounded-md shadow-lg w-10 flex h-10"
      class:invisible={!controlsVisiblity}
      on:mouseenter={() => controlsVisiblity = true}
      on:mouseleave={() => controlsVisiblity = false}
      on:blur={() => controlsVisiblity = false}
      on:focusout={() => controlsVisiblity = false}
      on:focusin={() => controlsVisiblity = true}
      role="button"
      tabindex="0"
      >
        <input
          bind:this={controls}
          on:input={progressScript}
          bind:value={volumeval}
          type="range"
          class="w-20 flex items-center justify-center mx-2"
          min="0"
          max="100"
        />
      </div>
</div>
</div>

<style>
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;

    cursor: pointer;
    align-self: center;

    outline: none;
    border-radius: 15px;

    height: 6px;
    background: linear-gradient(to right, #f50 100%, #ccc 100%);
}

input[type='range']::-webkit-slider-thumb {
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  height: 15px;
  width: 15px;
  background-color: #f50;
  border-radius: 50%;
  border: none;

  /* box-shadow: -407px 0 0 400px #f50; emove this line */
  transition: .1s ease-in-out;
}

input[type="range"]::-moz-range-thumb {
  height: 15px;
  width: 15px;
  background-color: #f50;
  border-radius: 50%;
  border: none;

  /* box-shadow: -407px 0 0 400px #f50; emove this line */
  transition: .2s ease-in-out;
}

/* Hover, active & focus Thumb: Webkit */

input[type="range"]::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 10px rgba(255,85,0, .1)
}
input[type="range"]:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(255,85,0, .2)
}
input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(255,85,0, .2)
}

/* Hover, active & focus Thumb: Firfox */

input[type="range"]::-moz-range-thumb:hover {
  box-shadow: 0 0 0 10px rgba(255,85,0, .1)
}
input[type="range"]:active::-moz-range-thumb {
  box-shadow: 0 0 0 13px rgba(255,85,0, .2)
}
input[type="range"]:focus::-moz-range-thumb {
  box-shadow: 0 0 0 13px rgba(255,85,0, .2)   
}

</style>
