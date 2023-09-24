<script>
    export let data;
    import { goto } from '$app/navigation';
</script>

<div class="flex justify-between items-center mb-2 opacity-80"
    style="background-color: #{data.accent_color? data.accent_color : 'cc0066'}">
    <a href="/app">
    {#if data.avatar}
    <img title="Go back"
        src={`//cdn.discordapp.com/avatars/${data.id}/${data.avatar}.jpg`}
        alt={data.avatar}
        class="rounded-full w-[4rem] h-[4rem] ml-5 border-black border-2"
    />
    {:else}
    <img
        src={'//cdn.discordapp.com/embed/avatars/0.png'}
        alt='0'
        class="rounded-full w-[4rem] h-[4rem] ml-5 border-black border-2"
    />
    {/if}
    </a>
    <div class="ml-10 text-3xl">{data.global_name ?? ''}</div>
    <button
        class="bg-black text-white m-4 rounded-md text-center p-2"
        title="logout"
        on:click={() => {
            goto('/logout', {invalidateAll: true});
        }}>Logout</button
    >
</div>

<slot/>
