<script>
	import '../app.css';
    import { navigating } from '$app/stores';
</script>

{#if $navigating}
   Navigating from {$navigating.from.url.pathname} to {$navigating.to.url.pathname}
{:else}
    <slot />
{/if}

<style>
	:global(body) {
		background-color: #36393f;
		color: #dcddde;
		font-family: Whitney, Helvetica Neue, Helvetica, Arial, sans-serif;
	}
</style>
