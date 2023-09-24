<script>
	import '../app.css';
    import { navigating } from '$app/stores';
</script>

{#if $navigating}
<div class="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-50">
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
