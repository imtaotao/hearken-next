const fs = require('fs')
const opn = require('opn')
const Koa = require('koa')
const path = require('path')
const cors = require('@koa/cors')
const range = require('koa-range')
const static = require('koa-static')

const port = 3000
const app = new Koa()

app.use(range)
app.use(static(__dirname))
app.use(cors)

app.listen(port, () => {
  const devHtml = path.resolve(__dirname, './index.html')
  const serverIndex = `http://localhost:${port}/index.html`

  if (fs.existsSync(devHtml)) {
    opn(serverIndex)
  }
  console.log(`Static server staring at: ${serverIndex}`)
})
