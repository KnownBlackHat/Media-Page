<script>
	import '../app.css';
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<div
		class="fixed flex items-center justify-center text-center top-0 w-full h-full bg-black opacity-70 z-50"
	>
		<svg
			version="1.1"
			title="Center Loader"
			class="h-80"
			id="L4"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="-23 0 100 100"
			enable-background="new 0 0 0 0"
			xml:space="preserve"
		>
			<circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
				<animate
					attributeName="opacity"
					dur="1s"
					values="0;1;0"
					repeatCount="indefinite"
					begin="0.1"
				/>
			</circle>
			<circle fill="#fff" stroke="none" cx="26" cy="50" r="6">
				<animate
					attributeName="opacity"
					dur="1s"
					values="0;1;0"
					repeatCount="indefinite"
					begin="0.2"
				/>
			</circle>
			<circle fill="#fff" stroke="none" cx="46" cy="50" r="6">
				<animate
					attributeName="opacity"
					dur="1s"
					values="0;1;0"
					repeatCount="indefinite"
					begin="0.3"
				/>
			</circle>
		</svg>
	</div>
{/if}

<slot />

<style>
	:global(body) {
		background-color: #36393f;
		color: #dcddde;
		font-family: Whitney, Helvetica Neue, Helvetica, Arial, sans-serif;
	}
</style>
