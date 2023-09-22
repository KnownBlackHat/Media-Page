from typing import Optional
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


@app.get('/get/servers')
async def get_servers():
    query = await app.db.execute("select server_id from channels")
    resp = await query.fetchall()
    data = set()
    for id, in resp:
        data.add(id)
    return list(data)


@app.get('/get/{server_id}')
async def get_channels(server_id: int):
    query = await app.db.execute("select channel_id, channel_name from channels where server_id = ?", (server_id,))
    resp = await query.fetchall()
    data = []
    for channel, name in resp:
        data.append({'id': channel, 'name': name})
    return data


@app.get('/get/{server_id}/{channel_id}/name')
async def get_channel_name(channel_id: int):
    query = await app.db.execute("select channel_name from channels where channel_id = ?", (channel_id,))
    resp = await query.fetchall()
    data = []
    for name, in resp:
        data.append(name)
    return data


@app.get('/get/{server_id}/{channel_id}')
async def get_links(server_id: int, channel_id: int):
    query = await app.db.execute("select link from media where server_id = ? and channel_id = ?", (server_id, channel_id))
    resp = await query.fetchall()
    data = []
    for name, in resp:
        data.append(name)
    return data


@app.get('/modify/{server_id}/{channel_id}')
async def modify(server_id: int, channel_id: int, link: str, channel_name: Optional[str] = None):
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
