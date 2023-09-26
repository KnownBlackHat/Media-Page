from typing import Literal, Optional
import re

from fastapi import FastAPI
import aiosqlite


class CustomFastAPI(FastAPI):
    db: aiosqlite.Connection


app = CustomFastAPI()


@app.on_event('startup')
async def start():
    app.db = await aiosqlite.connect('media.db')
    await app.db.execute("create table if not exists channels (server_id bigint, channel_id bigint, channel_name text)")
    await app.db.execute("create table if not exists media (server_id bigint, channel_id bigint, link text, unique (server_id, channel_id, link))")
    await app.db.execute("create table if not exists favourite (server_id bigint, user_id bigint, link text, favorite boolean)")


@app.get('/get/servers')
async def get_servers():
    query = await app.db.execute("select server_id from channels")
    resp = await query.fetchall()
    data = set()
    for id, in resp:
        data.add(str(id))
    return list(data)


@app.get('/get/{server_id}')
async def get_channels(server_id: int):
    query = await app.db.execute("select channel_id, channel_name from channels where server_id = ?", (server_id,))
    resp = await query.fetchall()
    data = []
    for channel, name in resp:
        data.append({'id': str(channel), 'name': name})
    return data


@app.get('/get/{server_id}/{channel_id}/name')
async def get_channel_name(channel_id: int):
    query = await app.db.execute("select channel_name from channels where channel_id = ?", (channel_id,))
    resp = await query.fetchall()
    data = []
    for name, in resp:
        data.append(name)
    return data


async def get_links(server_id: int, channel_id: int, user_id: Optional[int] = None, images_only: bool = False):
    if not user_id:
        return {'error': 'No user id provided'}
    # query = await app.db.execute("select link from media where server_id = ? and channel_id = ?", (server_id, channel_id))
    query_with_favourite = await app.db.execute(
            "select media.link, favourite.favorite from media left join favourite on media.server_id = favourite.server_id and media.link = favourite.link and favourite.user_id = ? where media.server_id = ? and media.channel_id = ?",
            (user_id, server_id, channel_id))
    resp = await query_with_favourite.fetchall()
    data = []
    if images_only:
        for link, favourite in resp:
            if not favourite:
                favourite = False
            else:
                favourite = True
            if re.match(r'.*\.(png|jpg|jpeg|gif|webp)', link):
                data.append({'link': link, 'favourite': favourite})
        return data
    for link, favourite in resp:
        if not favourite:
            favourite = False
        else:
            favourite = True
        if not re.match(r'.*\.(png|jpg|jpeg|gif|webp)', link):
            data.append({'link': link, 'favourite': favourite})
    return data


@app.get('/get/{server_id}/{channel_id}/videos')
async def get_links_vids(server_id: int, channel_id: int, user_id: Optional[int] = None):
    return await get_links(server_id, channel_id, user_id)


@app.get('/get/{server_id}/{channel_id}/images')
async def get_links_imgs(server_id: int, channel_id: int, user_id: Optional[int] = None):
    return await get_links(server_id, channel_id, user_id, images_only=True)


@app.get('/modify/{server_id}/{channel_id}')
async def modify(server_id: int, channel_id: int, link: Optional[str] = None,
                 channel_name: Optional[str] = None):
    if not link:
        return {'error': 'No link provided'}
    if not link.startswith('https://cdn.discordapp.com/attachments/'):
        return {'error': 'Invalid link'}
    new_channel = False
    if not await (await app.db.execute(
        "select channel_id from channels where channel_id = ? and server_id = ?",
        (channel_id, server_id))
              ).fetchone():
        if not channel_name:
            return {'success': False, 'error': 'No server or channel found. Provide channel name to create a new entry'}
        await app.db.execute("insert into channels (server_id, channel_id, channel_name) values (?, ?, ?)", (server_id, channel_id, channel_name))
        new_channel = True
    try:
        await app.db.execute("insert into media (server_id, channel_id, link) values (?, ?, ?)",
                             (server_id, channel_id, link))
    except aiosqlite.IntegrityError:
        return {'success': False, 'error': 'Link already exists in this server'}
    await app.db.commit()
    return {'success': True, 'new_server_or_channel': new_channel}


@app.get('/modify/{server_id}/{user_id}/favourite')
async def favourite(server_id: int, user_id: int,
                    link: Optional[str] = None,
                    mode: Optional[Literal['add', 'remove']] = None):
    if not link:
        return {'success': False, 'error': 'No link provided'}
    elif not mode or mode not in ('add', 'remove'):
        return {'success': False, 'error': "No valid mode provided, it must be either 'add' or 'remove'"}
    elif not link.startswith('https://cdn.discordapp.com/attachments/'):
        return {'success': False, 'error': 'Invalid link'}
    elif not await (await app.db.execute(
        "select link from media where link = ? and server_id = ?",
        (link, server_id))
                    ).fetchone():
        return {'success': False, 'error': 'Link not found in db to the corresponding server and channel'}
    elif await (await app.db.execute(
        "select link from favourite where link = ? and server_id = ? and user_id = ?",
        (link, server_id, user_id))
                             ).fetchone():
        await app.db.execute("update favourite set favorite = ? where server_id = ? and link = ? and user_id = ?",
                             (mode == "add", server_id, link, user_id))
        await app.db.commit()
        return {'success': True, 'mode': mode, 'updated': True}
    else:
        await app.db.execute("insert into favourite (server_id, link, user_id, favorite) values (?, ?, ?, ?)",
                             (server_id, link, user_id, mode == "add"))
        await app.db.commit()
        return {'success': True, 'mode': mode, 'updated': False}


@app.get('/get/{server_id}/{user_id}/favourites')
async def get_favourites(server_id: int, user_id: int, images_only: bool = False):
    query = await app.db.execute("select link, favorite from favourite where server_id = ?  and user_id = ? and favorite = 1", (server_id, user_id))
    resp = await query.fetchall()
    data = []
    if images_only:
        for link, favourite in resp:
            if not favourite:
                favourite = False
            else:
                favourite = True
            if re.match(r'.*\.(png|jpg|jpeg|gif|webp)', link):
                data.append({'link': link, 'favourite': favourite})
        return data
    else:
        for link, favourite in resp:
            if not favourite:
                favourite = False
            else:
                favourite = True
            if not re.match(r'.*\.(png|jpg|jpeg|gif|webp)', link):
                data.append({'link': link, 'favourite': favourite})
        return data
