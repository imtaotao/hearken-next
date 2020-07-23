const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const rm = require('rimraf').sync
const childProcess = require('child_process')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')

const packageJSON = require('../package.json')
const chalk = require('chalk')
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

console.clear()
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
const watchFiles = path.resolve(__dirname, '../src')
fs.watch(watchFiles, { recursive: true }, () => {
  console.clear()
  rm(libDir)
  console.log('Rebuild: ' + ++i)
  buildVersion()
})

buildVersion()
console.log(chalk.cyan.bold('👿 Watching src files...'))

if (process.argv.includes('-o')) {
  // start dev server...
  const serverPath = path.join(__dirname, '../static/server.js')
  if (!fs.existsSync(serverPath)) {
    console.error('The static server is not fount.')
    process.exit(1)
  }

  childProcess.fork(serverPath, {}, (error) => {
    if (error) {
      console.error('Server start error:', error)
      process.exit(1)
    }
  })
}
