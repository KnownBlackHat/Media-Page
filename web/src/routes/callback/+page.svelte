<script>
	import { browser } from '$app/environment';
	import axios from 'axios';

	const auth = async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		const resp = await axios.post('/api/v1/login', { code: code });
		window.document.cookie = `token=${resp.data}`;
		window.location = '/';
	};
</script>

{#if browser}
	{#await auth()}
		<p>Authenticating....</p>
	{:then}
		Redirecting ...
	{:catch error}
		Error: {error}
	{/await}
{/if}
