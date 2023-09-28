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
DB_URl = 'http://localhost:8888'
http_client = httpx.AsyncClient()

console_handler.setLevel(logging.INFO)
logging.basicConfig(
    level=logging.NOTSET,
    format="%(levelname)s - %(name)s - %(filename)s - %(module)s - %(funcName)s - %(message)s",
    handlers=[console_handler],
)


async def insert(server_id: int, channel_id: int, url: str, channel_name: str):
    await http_client.get(f'{DB_URl}/modify/{server_id}/{channel_id}?link={url}&channel_name={channel_name}')


@bot.event
async def on_message(msg: disnake.Message):
    if msg.guild and msg.attachments and not isinstance(msg.channel, disnake.DMChannel):
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


@bot.slash_command(name="set_premium_role")
async def set_premium_role(inter: disnake.GuildCommandInteraction, role: disnake.Role):
    """
    Register the premium role

    Parameters
    ----------
    role: Role to register
    """
    await http_client.get(f'{DB_URl}/modify/{inter.guild.id}/{role.id}/premium_role')
    await inter.send(f"{role.mention} registered successfully")


@bot.slash_command(name='register')
async def register(inter: disnake.GuildCommandInteraction,
                   channel: Union[disnake.TextChannel, disnake.ForumChannel, disnake.CategoryChannel]):
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


@bot.slash_command(name='add_archive')
async def add_archive(inter: disnake.GuildCommandInteraction,
                      attachment: disnake.Attachment,
                      channel: disnake.TextChannel):
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

bot.run(os.getenv('TOKEN'))
