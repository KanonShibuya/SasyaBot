import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    m.reply('Input name');
    return;
  }

  let q = await m.quoted || m;

  let url = `https://kntol-ngwe.hf.space/api/chara/search?name=${args[0].replace(/[\n]/g, "\\n").replace(/\s/g, "+")}`;

  if (args[0] === '#info' && args[1]) {
    let url2 = `https://kntol-ngwe.hf.space/api/chara/info?characterId=${args[1]}`;

    let ingfo = await fetch(url2);
    let infos = await ingfo.json();
  let ress = infos.result;

    let name = ress.name;
    let info = ress.description;
    let greetings = ress.greeting;
    let creator = ress.user__username;
    let user = formatNumber(ress.participant__num_interactions);
    let ID = ress.external_id;
    let thum = ress.avatar_file_name;
    let desc = ress.title;
    let imageUrl = `https://characterai.io/i/400/static/avatars/${thum}`;
    let thums = await fetchImage(imageUrl);

   conn.reply(m.chat, `CHARACTER INFO

- Name: ${name}
- Info: ${info}
- Greeting: ${greetings}
- Creator: ${creator}
- User: ${user}
- ID: ${ID}`, m, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          description: null,
          title: name,
          body: desc,
          previewType: 0,
          thumbnail: thums,
          jpegThumbnail: thums,
          sourceUrl: ''
        }
      }
    });
    return;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        const results = data.result.slice(0, 20);
        const output = [];

        results.forEach((result, index) => {
          const participantName = result.participant__name;
          const score = formatNumber(result.participant__num_interactions);
          const userName = result.user__username;
          const title = result.title;
          const greeting = result.greeting;
          const externalId = result.external_id;

          const resultOutput = `
${index + 1}. Name: ${participantName}
- Creator: ${userName}
- User: ${score}
- Info: ${title || greeting}
- ID: ${externalId}\n`;

          output.push(resultOutput);
        });

        const consolidatedOutput = output.join("");
        m.reply(`「 CHARA SEARCH 」\n\n` + consolidatedOutput);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

handler.command = /^(cai-s)$/i;

export default handler;

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'm';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'k';
  } else {
    return number.toString();
  }
}

async function fetchImage(url) {
            const response = await fetch(url);
            const buffer = await response.buffer();
            return buffer;
        }
