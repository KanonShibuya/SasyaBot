import fetch from 'node-fetch';
import baileys from '@adiwajshing/baileys';
import util from 'util';
import { readFileSync } from 'fs';

export const sessions = new Map();

const handler = async (m, { conn, args }) => {

  let chara = '6OkJXA2g8stJO1zDDB2qX9uCKzDe5_VwqWvNLPKXL1w';

    let ses = sessions.get(m.sender);
    let firstChat = global.DATABASE.data.users[m.sender].firstChat;
    let url1 = `https://kntol-ngwe.hf.space/api/chara/info?characterId=${chara}`;

    let looping = true;
    while (looping) {
        conn.sendPresenceUpdate('composing', m.chat);
        await baileys.delay(5000);
        looping = false;
    }

    const res1 = await fetch(url1);
    const json1 = await res1.json();
    const str1 = typeof json1.result === 'string' ? json1.result : util.inspect(json1.result);
    console.log(json1.result);

    async function fetchImage(url) {
        const response = await fetch(url);
        const buffer = await response.buffer();
        return buffer;
    }

    const imageUrl = `https://characterai.io/i/400/static/avatars/${json1.result.avatar_file_name}`;
    let thum = await fetchImage(imageUrl);

    if (firstChat && (!args[0])) {
        throw `Hi, now you will start chatting with Character AI namely ${json1.result.name}
Do you want to continue chatting with him? Send the command .cai <text> to start the dialog

To start chatting type .cai #start

Note Your chat will be deleted automatically every 10 minutes, so retype .cai <text> without #start`;
    }

    if (firstChat && args[0] === '#start') {
        conn.reply(m.chat, `CHARACTER INTRODUCTION\n\n\n${json1.result.description.replace(/\*/g, "_")}`, m, {
            contextInfo: {
                externalAdReply: {
                    mediaUrl: null,
                    mediaType: 1,
                    description: null,
                    title: json1.result.name,
                    body: json1.result.title,
                    previewType: 0,
                    thumbnail: thum,
                    jpegThumbnail: thum,
                    sourceUrl: ''
                }
            }
        });

        conn.reply(m.chat, json1.result.greeting.replace(/\*/g, "") + `\n\n\n_Type .cai <your_answer> to respond_`, m, {
            contextInfo: {
                externalAdReply: {
                    mediaUrl: null,
                    mediaType: 1,
                    description: null,
                    title: json1.result.name,
                    body: json1.result.title,
                    previewType: 0,
                    thumbnail: thum,
                    jpegThumbnail: thum,
                    sourceUrl: ''
                }
            }
        });
        return;
    }

    if (!firstChat && !args[0]) {
        throw 'Text?';
    }

    let txt = args[0].replace(/[\n]/g, "\\n").replace(/\s/g, "+")
    let url = `https://kntol-ngwe.hf.space/api?characterId=${chara}&text=${txt}`;

    if (ses && ses.sId) {
        url = `https://kntol-ngwe.hf.space/api?characterId=${chara}&text=${txt}&sessionId=${ses.sId}`;
    }

    const res = await fetch(url);
    const json = await res.json();
    let sId = json.result.sessionId;

    if (!json.result || !json.result.text) {
        throw 'Error: Response not received or text not found.';
    }

    const str = typeof json.result.text === 'string' ? json.result.text.trim() : util.inspect(json.result.text.trim());
    while (true) {
        conn.sendPresenceUpdate('composing', m.chat);

        if (json.result.text !== null) {
            // Result has appeared
            if (args[0] === 'cSkip' || args[0] === 'cNext' || args[0] === 'cMute') {
                url = `https://kntol-ngwe.hf.space/api?characterId=${chara}&text=''&sessionId=${ses.sId}`;
            }

            let send = await m.reply(str.trim().replace(/\*/g, "_"), m.chat, {
                contextInfo: {
                    externalAdReply: {
                        mediaUrl: null,
                        mediaType: 1,
                        description: null,
                        title: json1.result.name,
                        body: json1.result.title,
                        previewType: 0,
                        thumbnail: thum,
                        jpegThumbnail: thum,
                        sourceUrl: ''
                    }
                }
            });

            console.log(`ID SEND: ${send.key.id}`);
            sessions.set(m.sender, { id: `${send.key.id}`, sId: `${json.result.sessionId}` });
            console.log(sessions);
            break;
        } else {
            // Result hasn't appeared yet, wait for some time
            await baileys.delay(1000); // Waiting for 1 second before reattempting
        }
    }

    firstChat = false;
    // Delete sessions after 10 minutes
    await baileys.delay(600000);
    sessions.delete(m.sender);
};

handler.before = async (m, { conn }) => {
    if (!sessions.has(m.sender)) return;
    if (!(m.quoted && m.quoted.fromMe)) return;
    let session = sessions.get(m.sender);
    if (m.quoted.id === session.id) {
        return handler(m, { conn, args: [m.text] });
    }
};

handler.command = /^(cai)$/i;

export default handler;

/* 

switch(args[0]){

case 'search':
kode....
break

case 'set':
kode....
break

case 'start':
kode...
break

case 'skip':
case 'next':
case 'mute':
url = `https://kntol-ngwe.hf.space/api?characterId=${chara}&text=''&sessionId=${ses.sId}`;

let send....

break

default:
let txt = args[0].replace(/[\n]/g, "\\n").replace(/\s/g, "+")
            let url = `https://kntol-ngwe.hf.space/api?characterId=${chara}&text=${txt}`;

            if (ses && ses.sId) {
                url = `https://kntol-ngwe.hf.space/api?characterId=${chara}&text=${txt}&sessionId=${ses.sId}`;
            }

            const res = await fetch(url);
            const json = await res.json();
            let sId = json.result.sessionId;

            if (!json.result || !json.result.text) {
                throw 'Error: Response not received or text not found.';
            }

            const str = typeof json.result.text === 'string' ? json.result.text.trim() : util.inspect(json.result.text.trim());
            while (true) {
                conn.sendPresenceUpdate('composing', m.chat);
break
}

*/