<script>
	export let data;
    data = data.arr
</script>

<div class="flex items-center justify-between sticky top-0">
{#each data as ch}
    <a href={`${ch.id}`}>
        <div class="text-center border-white border-2 overflow-auto rounded-md">
            <div class="font-bold sticky top-0 bg-black">{ch.name}</div>
        </div>
    </a>
{/each}
</div>

<slot />
