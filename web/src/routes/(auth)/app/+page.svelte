<script>
	export let data;
    import { page } from '$app/stores';
</script>

<div class="grid grid-cols-5 gap-5">
    {#each data.guilds as {id, icon, name}}
        <a href='{$page.url.pathname}/{id}'>
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
