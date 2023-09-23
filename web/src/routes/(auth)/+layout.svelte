<script>
    export let data;
    import { goto } from '$app/navigation';
</script>

<div class="flex justify-between items-center mb-2 bg-pink-800 opacity-80">
    <a href="/app">
    <img
        src={`//cdn.discordapp.com/avatars/${data.id}/${data.avatar}.jpg`}
        alt={data.avatar}
        class="rounded-full w-[4rem] h-[4rem] ml-5 border-black border-2"
    />
    </a>
    <div class="ml-10 text-3xl">{data.global_name}</div>
    <button
        class="bg-black text-white m-4 rounded-md text-center p-2"
        on:click={() => {
            goto('/logout', {invalidateAll: true});
        }}>Logout</button
    >
</div>

<slot/>
