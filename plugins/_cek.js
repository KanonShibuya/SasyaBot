let handler = async ( m, { conn, args } ) => {
  switch(args[0]){

    case 'a':
    case 'b':
    case 'c':

      m.reply('Test 1')
      break

    case '1':
    case '2':
    case '3':

      m.reply('Test 2')
      break

    default:
      m.reply('Yoi')
      break
  }
}

handler.command = /^(cek|tes|alive|p|a)$/i

export default handler
