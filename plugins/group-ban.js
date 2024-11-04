let handler = async (m, { conn, command, text, isAdmin }) => {
  
  //if (!text) throw 'Siapa yang mau di banned?'
  let who = m.quoted ? m.quoted.sender : m.mentionedJid ? m.mentionedJid[0] : ''
  if (!who || who.includes(conn.user.jid)) throw `*Reply / @tag* one or other !`
  let ya = global.db.data.users

  switch (command) {
    case 'ban': 
      ya[who].banned = true
      conn.reply(m.chat, `Berhasil banned *${conn.getName(who)}*`, m)
      break 
    case 'unban':
      ya[who].banned = false
      conn.reply(m.chat, `Berhasil unbanned *${conn.getName(who)}*`, m)
      break
    default:
      break 
  }
  
}

handler.command = /^ban|unban$/i
handler.group = true
handler.admin = true
export default handler

/* 

switch (command) {
  case 'mute': case 'unmute':
    if (!m.isGroup) return dfail('group', m, conn)
    if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
    chat.isBanned = isEnable
    break 
  default:
    break 
}

*/