const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server

// 创建 websocket 服务器 监听在 3000 端口
const wss = new WebSocketServer({ port: 4000 })

var allWs = []

// 服务器被客户端连接
wss.on('connection', ws => {
  if (allWs.indexOf(ws) == -1) {
    allWs.push(ws)
  }
  send(ws, {
    from: 'tips',
    name: 'server',
    message:
      'there ' + (allWs.length == 1 ? 'is ' : 'are ') + allWs.length + ' people'
  })
  // 接收客户端信息并把信息返回发送
  ws.on('message', message => {
    var data = JSON.parse(message.toString('utf-8'))
    console.log('onmessage', message.toString('utf-8'))
    message = data.message
    if (data.from == 'tips') {
      data.name = 'server'
    }
    allWs.forEach(item => {
      if (item != ws) {
        send(item, data)
      }
    })
  })
  ws.on('close', function (code, reason) {
    var idx = allWs.indexOf(ws)
    if (idx != -1) {
      allWs.splice(idx, 1)
    }
    console.log('connection closed', code, reason.toString('utf-8'))
  })
})

function send(ws, data) {
  const { from, name, message } = data
  const info = JSON.stringify({
    from,
    name,
    message,
    time: new Date().getTime()
  })
  ws.send(info, err => {
    if (err) {
      console.log(`[SERVER] error: ${err}`)
    }
  })
}
