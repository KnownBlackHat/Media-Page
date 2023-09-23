<div class="flex items-center justify-center h-screen">
    <button
        class="bg-black text-white rounded-md p-4 text-4xl"
        on:click={() => {
            window.location.href = `https://discord.com/api/oauth2/authorize?client_id=1141441374508548241&redirect_uri=http://localhost:5173/callback&callback&response_type=code&scope=identify guilds`;
        }}>Discord Auth</button
    >
</div>
