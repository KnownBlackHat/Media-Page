<script>
	export let data;
    import { page } from '$app/stores';
</script>

{#if data.guilds.length === 0}
<div class="flex items-center justify-center h-screen">
   <div class="bg-black text-2xl font-bold py-40 px-48 rounded-lg"> You are not in any of the premium server </div>
</div>
{:else}
<div class="grid md:grid-cols-5 md:gap-5 mx-2">
    {#each data.guilds as {id, icon, name}}
        <a href='/{$page.url.pathname}/{id}'>
            <div class="text-center border-white border-2 overflow-auto rounded-md">
                <div class="server-name font-bold sticky top-0 bg-black">{name}</div>
                <img
                    class="w-full object-cover"
                    alt={icon}
                    src={icon
                        ? `//cdn.discordapp.com/icons/${id}/${icon}.png`
                        : '//global-img.gamergen.com/logo-gg-discord-1_0000932383.jpg'}
                />
            </div>
        </a>
    {/each}
</div>
{/if}
