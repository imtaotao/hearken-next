const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const rollup = require('rollup')
const rm = require('rimraf').sync
const childProcess = require('child_process')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')

const packageJSON = require('../package.json')
const libName = packageJSON.name
const libDir = path.resolve(__dirname, '../static/lib')

const entryPath = path.resolve(__dirname, '../src/index.ts')
const outputPath = path.resolve(__dirname, '../static/lib', `${libName}.js`)

const esm = {
  input: entryPath,
  output: {
    format: 'esm',
    file: outputPath,
    sourcemap: true,
  },
}

const createReplacePlugin = () => {
  return replace({
    __DEV__: true,
    __TEST__: false,
    __VERSION__: `'${packageJSON.version}'`,
  })
}

async function build(cfg) {
  const buildCfg = {
    input: cfg.input,
    plugins: [
      resolve(),
      typescript({
        check: true,
        clean: true,
        typescript: require('typescript'),
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        cacheRoot: path.resolve(__dirname, '../.rts2_cache'),
      }),
      createReplacePlugin(),
    ],
  }

  const bundle = await rollup.rollup(buildCfg)
  await bundle.generate(cfg.output)
  await bundle.write(cfg.output)
}

const title = chalk.cyan.bold('👿 Watching src files...')
console.clear()
console.log(title)
// Delete old build files
rm(libDir)

const buildVersion = async () => {
  try {
    await build(esm)
  } catch (error) {
    console.error('[DEVELOP BUILD ERROR]: ', error)
  }
}

let i = 0
let server = null
const watchFiles = path.resolve(__dirname, '../src')

fs.watch(watchFiles, { recursive: true }, async () => {
  console.clear()
  rm(libDir)
  console.log(title)
  console.log('Rebuild: ' + chalk.green.bold(++i))

  await buildVersion()

  if (server !== null) {
    server.send(`Rebuild: ${i}`)
  }
})

buildVersion()

// start dev server...
if (process.argv.includes('-o')) {
  const serverPath = path.join(__dirname, './server.js')

  if (fs.existsSync(serverPath)) {
    server = childProcess.fork(serverPath, ['child'])

    server.on('error', (error) => {
      console.error(chalk.red.bold('Server start error:'), error)
      server.exit(1)
      process.exit(1)
    })

    server.on('close', (code) => {
      console.log(
        code === 1
          ? chalk.red.bold(`Dev server exit at '${code}'`)
          : chalk.yellow.bold(`Dev server exit at '${code}'`),
      )
    })

    process.on('exit', () => {
      server.kill('SIGINT')
    })
  } else {
    console.error(chalk.red.bold('Dev server is not fount.'))
    process.exit(1)
  }
}
