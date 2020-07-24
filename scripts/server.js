const fs = require('fs')
const net = require('net')
const opn = require('opn')
const Koa = require('koa')
const path = require('path')
const chalk = require('chalk')
const cors = require('@koa/cors')
const range = require('koa-range')
const static = require('koa-static')

const { reload, koaMiddleware, hotServerKill } = require('./hotServer')()

const app = new Koa()
const staticPath = path.resolve(__dirname, '../static')
const devHtml = path.resolve(staticPath, './index.html')

app.use(range)
app.use(koaMiddleware('/index.html', devHtml))
app.use(static(staticPath))
app.use(cors)

// Get opportune port
function listen(port, resolve) {
  const server = net.createServer().listen(port)

  server.on('listening', () => {
    server.close()
    resolve(port)
  })

  server.on('error', (error) => {
    server.close()
    if (error.code === 'EADDRINUSE') {
      listen(port + 1, resolve)
    } else {
      hotServerKill()
      console.error('Server error: ', error)
      process.exit(1)
    }
  })
}

listen(3000, (port) => {
  app.listen(port, () => {
    const serverIndex = `http://localhost:${port}/index.html`

    if (fs.existsSync(devHtml)) {
      opn(serverIndex)
    }

    if (process.argv.includes('child')) {
      process.on('message', (msg) => {
        msg === 'reload' && reload()
      })
    } else {
      console.clear()
    }

    console.log(chalk.blue.bold(`🐶 Static server start on: ${serverIndex}`))
  })
})
