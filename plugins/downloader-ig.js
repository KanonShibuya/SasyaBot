import { instagramdlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch';

var handler = async (m, { args, conn, usedPrefix, command }) => {
    if (!args[0]) throw `Ex:\n${usedPrefix}${command} https://www.instagram.com/reel/C0EEgMNSSHw/?igshid=MzY1NDJmNzMyNQ==`;

  conn.reply(m.chat, '_Sedang mengunduh..._', m);

        let link = await instagramdlv2(args[0])
const { url } = link[0]
   const response = await fetch(url)
   const arrayBuffer = await response.arrayBuffer()
   const videoBuffer = Buffer.from(arrayBuffer)

        if (!url) throw 'Can\'t download the post';

  conn.sendFile(m.chat, videoBuffer, 'ig.mp4', null, m)
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(ig(dl)?|instagram(dl)?)$/i;

export default handler;