// Description:
//   Utility commands surrounding Hubot uptime.
//
// Commands:
//   ping - Reply with pong
//   echo <text> - Reply back with <text>
//   time - Reply with current time
'use strict'
const green = '\x1b[32m'
const cyan = '\x1b[36m'
const red = '\x1b[31m'
const reset = '\x1b[0m'
const regexObject = new RegExp(/{.+:.+(,.+:.+)*}/, 'i')
const outputConsoleLog = (res, type, ...messages) => {
  console.log(`${cyan}=== ${type} ===${reset}`)
  const room = res.message.room
  const rooms = res.message.rooms
  console.log(`${green}${rooms[room].name ? rooms[room].name : '無し'} - ${res.message.user.name}${reset}`)
  messages.forEach((message) => {
    console.log(message)
  })
}

module.exports = (robot) => {
  robot.respond(/.*/i, (res) => {})

  // メッセージ (全部？)
  robot.hear(/(.*)/i, (res) => {
    let text = res.message.text
    if (res.message.roomType === 1) {
      text = text.replace(/^\S+ /, '')
    }
    if (res.message.id === null) {
      return
    }
    if (!res.message.text.match(regexObject)) {
      outputConsoleLog(res, 'メッセージ', `本文: ${text}`)
    }
  })

  // スタンプ
  robot.hear('stamp', (res) => {
    const url = `https://direct4b.com/images/stamp/${res.json.stamp_set}/${res.json.stamp_index}.png`
    if(res.json.text) {
      outputConsoleLog(res, 'スタンプ', `本文: ${res.json.text}`, `スタンプ: ${url}`)
    } else {
      outputConsoleLog(res, 'スタンプ', `スタンプ: ${url}`)
    }
  })

  // yesnoスタンプ
  robot.hear('yesno', (res) => {
    if (res.json.response === undefined) {
      outputConsoleLog(res, 'yesnoスタンプ', `質問: ${res.json.question}`)
    }else {
      outputConsoleLog(res, 'yesnoスタンプ', `(質問: ${res.json.question})`, `回答: ${res.json.response ? 'はい' : 'いいえ'}`)
    }
  })

  // セレクトスタンプ
  robot.hear('select', (res) => {
    if (res.json.response === undefined) {
      outputConsoleLog(res, 'セレクトスタンプ', `質問: ${res.json.question}`, `> ${res.json.options}`)
    } else {
      outputConsoleLog(res, 'セレクトスタンプ', `(質問: ${res.json.question})`, `(> ${res.json.options})`, `回答: ${res.json.options[res.json.response]}`)
    }
  })

  // タスクスタンプ
  robot.hear('task', (res) => {
    if (!res.json.done) {
      outputConsoleLog(res, 'タスクスタンプ', `タスク: ${res.json.title}`)
    } else {
      outputConsoleLog(res, 'タスクスタンプ', `(タスク: ${res.json.title})`, '=> 達成')
    }
  })

  // ファイル添付
  robot.hear('files', (res) => {
    const fileNames = []
    res.json.files.forEach((file)=>{
      if(file.name) {
        fileNames.push(file.name)
      }
    })
    if (res.json.text) {
      outputConsoleLog(res, 'ファイル添付', `本文: ${res.json.text}`, `ファイル: ${fileNames}`)
    } else {
      outputConsoleLog(res, 'ファイル添付', `ファイル: ${fileNames}`)
    }
  })

  // 位置情報
  robot.hear('map', (res) => {
    outputConsoleLog(res, 'イマココ', `イマココ: ${res.json.place} at ${res.json.lat}, ${res.json.lng}`)
  })

  robot.respond(/ADAPTER$/i, (res) => {})

  robot.respond(/ECHO (.*)$/i, (res) => {})

  robot.respond(/TIME$/i, (res) => {})
}
