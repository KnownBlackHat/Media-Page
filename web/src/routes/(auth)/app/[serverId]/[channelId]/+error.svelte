<script>
import { page } from '$app/stores';
</script>

{#if $page.status == 403}
    <div class="flex items-center justify-center h-screen">
   <div class="bg-black md:text-2xl text-center font-bold py-36 px-48 rounded-lg mt-4">
        <h1 class="md:text-4xl font-bold">You need to buy premium to access this page</h1>
        <p class="md:text-xl">You can buy premium from our <a href="https://discord.gg/e9JvqxtBfr " target="_blank" class="text-blue-500">Discord server</a></p>
        <div class="mt-10 text-center items-center justify-center flex">
            <iframe title="Discord Widget"
            class="md:w-[600px] h-[350px] rounded-lg"
            src="https://discord.com/widget?id=912613185805221918&theme=dark&username=.desus."
            allowtransparency="true"
            frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
            </iframe>
        </div>
        </div>
    </div>
{/if}
