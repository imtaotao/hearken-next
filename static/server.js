const fs = require('fs')
const net = require('net')
const opn = require('opn')
const Koa = require('koa')
const path = require('path')
const cors = require('@koa/cors')
const range = require('koa-range')
const static = require('koa-static')

const app = new Koa()

app.use(range)
app.use(static(__dirname))
app.use(cors)

// Get opportune port
function listen(port, resolve) {
  const server = net.createServer().listen(port)

  server.on('listening', () => {
    server.close()
    resolve(port)
  })

  server.on('error', error => {
    server.close()
    if (error.code === 'EADDRINUSE') {
      listen(port + 1, resolve)
    } else {
      console.error('Server error: ', error)
      process.exit(1)
    }
  })
}

listen(3000, port => {
  app.listen(port, () => {
    const devHtml = path.resolve(__dirname, './index.html')
    const serverIndex = `http://localhost:${port}/index.html`

    if (fs.existsSync(devHtml)) {
      opn(serverIndex)
    }
    console.log(`Static server start on: ${serverIndex}`)
  })
})
