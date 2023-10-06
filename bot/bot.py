import os
import logging
import re
from typing import Union

import disnake
from disnake.ext import commands
import httpx
from urllib3.util import parse_url

bot = commands.InteractionBot(intents=disnake.Intents.all())
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
DB_URl = os.getenv('IPC_BASE_URI')
http_client = httpx.AsyncClient()

console_handler.setLevel(logging.INFO)
logging.basicConfig(
    level=logging.NOTSET,
    format="%(levelname)s - %(name)s - %(filename)s - %(module)s - %(funcName)s - %(message)s",
    handlers=[console_handler],
)


async def insert(server_id: int, channel_id: int, url: str, channel_name: str):
    await http_client.get(f'{DB_URl}/modify/{server_id}/{channel_id}?link={url}&channel_name={channel_name}')


def is_premium_owner():
    def predicate(inter: disnake.GuildCommandInteraction) -> bool:
        server = bot.get_guild(int(os.getenv('PREMIUM_SERVER_ID')))  # type: ignore
        uid = inter.author.id
        if not server or not int(os.getenv('PREMIUM_ROLE_ID')):  # type: ignore
            return False
        elif member := server.get_member(uid):
            if member.get_role(int(os.getenv('PREMIUM_ROLE_ID'))):  # type: ignore
                if not inter.author.guild_permissions.manage_guild:
                    return False
                return True
        return False

    return commands.check(predicate)  # type: ignore


@bot.event
async def on_message(msg: disnake.Message):
    if msg.guild and msg.attachments and not isinstance(msg.channel,
                                                        disnake.DMChannel):
        url = f'{DB_URl}/get/{msg.guild.id}/{msg.channel.id}/registered'
        if msg.channel.type == disnake.ChannelType.public_thread or msg.channel.type == disnake.ChannelType.private_thread:
            url = f'{DB_URl}/get/{msg.guild.id}/{msg.channel.parent_id}/registered'
        resp = await http_client.get(url)
        resp = resp.json()
        if not resp.get('success'):
            return
        for attachment in msg.attachments:
            urlparts = parse_url(attachment.url)
            if re.match(r'(?i).*\.(png|jpe?g|gifv?|web(m|p)|mp4|mov|mkv|qt)$', urlparts.path):  # type: ignore
                await insert(server_id=msg.guild.id,
                             channel_id=msg.channel.id,
                             channel_name=msg.channel.name,
                             url=attachment.url)


@bot.slash_command(name="register")
@is_premium_owner()
async def register(inter: disnake.GuildCommandInteraction):
    """
    Register Command group
    """


@register.sub_command(name="role")
async def set_premium_role(inter: disnake.GuildCommandInteraction,
                           role: disnake.Role):
    """
    Register the premium role

    Parameters
    ----------
    role: Role to register
    """
    await http_client.get(f'{DB_URl}/modify/{inter.guild.id}/{role.id}/premium_role')
    await inter.send(f"{role.mention} registered successfully")


@register.sub_command(name='channel')
async def set_channel(inter: disnake.GuildCommandInteraction,
                      channel: Union[disnake.TextChannel,
                                     disnake.ForumChannel,
                                     disnake.CategoryChannel]):
    """
    Register a channel to receive attachments

    Parameters
    ----------
    channel: Channel to register
    """
    if isinstance(channel, disnake.CategoryChannel):
        for chnl in channel.channels:
            await register(inter, chnl)
    await http_client.get(f'{DB_URl}/modify/{inter.guild.id}/{channel.id}/register')
    await inter.send(f"{channel.mention} registered successfully")


@commands.is_owner()
@bot.slash_command(name='add_archive')
async def add_archive(inter: disnake.GuildCommandInteraction,
                      attachment: disnake.Attachment,
                      channel: Union[disnake.TextChannel, disnake.ForumChannel,
                                     disnake.Thread]):
    """
    Add an attachment to the archive

    Parameters
    ----------
    attachment: Attachment to add
    channel: Channel to add to
    """
    await inter.response.defer()
    lines = (await attachment.read()).decode("utf-8")
    url_set = set(lines.split('\n'))
    for url in url_set:
        await insert(server_id=inter.guild.id,
                     channel_id=channel.id,
                     channel_name=channel.name,
                     url=url)
    await inter.send(f"{attachment.filename} added to {channel.mention}")


@bot.event
async def on_slash_command_error(inter: disnake.CommandInteraction, error):
    if isinstance(error, commands.errors.CommandOnCooldown):
        await inter.send(f"Command is on cooldown {error.retry_after:.2f} seconds")
    elif isinstance(error, commands.errors.MissingPermissions):
        await inter.send("You don't have the required permissions to run this command")
    elif isinstance(error, commands.errors.NotOwner):
        await inter.send("You are not the owner of this bot")
    elif isinstance(error, commands.errors.MissingRequiredArgument):
        await inter.send("Missing Required Argument")
    elif isinstance(error, commands.errors.BadArgument):
        await inter.send("Bad Argument")
    elif isinstance(error, commands.errors.CommandNotFound):
        await inter.send("Command Not Found")
    elif isinstance(error, commands.errors.MissingRole):
        await inter.send("You don't have the required role to run this command")
    elif isinstance(error, commands.errors.CheckFailure):
        await inter.send(
            "Buy Premium to use this command. Check My Profile for server invite link from where you can buy premium"
        )
    else:
        await inter.send(f"Something went wrong {error}")


bot.run(os.getenv('TOKEN'))
