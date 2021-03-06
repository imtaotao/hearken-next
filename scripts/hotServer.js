const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')
const chalk = require('chalk')

const HOT_CLIENT = () =>
  '\n' + fs.readFileSync(path.resolve(__dirname, './hotClient.js')).toString()

function genHtml(e) {
  return !fs.existsSync(e)
    ? 'Not Found'
    : fs
        .readFileSync(e)
        .toString()
        .replace(/<\/body>/, (k) => `<script>${HOT_CLIENT()}</script>${k}`)
}

function heartBeat(wss) {
  wss.on('connection', (c) => {
    c.isAlive = true
    c.on('pong', () => (c.isAlive = true))
  })

  let interval = setInterval(() => {
    wss.clients.forEach((c) => {
      if (c.isAlive === false) {
        c.terminate()
        console.log(chalk.red.bold('WebSocket closed'))
        return
      }
      c.isAlive = false
      c.ping(() => {})
    })
  }, 30000)

  wss.on('close', () => {
    clearInterval(interval)
    interval = null
  })
}

module.exports = function hotReload() {
  const wss = new WebSocket.Server({ port: 1234 })

  heartBeat(wss)

  function koaMiddleware(url, entrance) {
    return async (ctx, next) => {
      ctx.request.url === url ? (ctx.body = genHtml(entrance)) : await next()
    }
  }

  function reload(msg) {
    wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(msg)
      }
    })
  }

  function hotServerKill() {
    wss.clients.forEach((c) => c.terminate)
    console.log(chalk.red.bold('WebSocket closed'))
  }

  return {
    reload,
    koaMiddleware,
    hotServerKill,
  }
}
