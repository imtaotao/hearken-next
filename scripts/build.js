const path = require('path')
const rollup = require('rollup')
const rm = require('rimraf').sync
const babel = require('rollup-plugin-babel')
const cmd = require('rollup-plugin-commonjs')
const cleanup = require('rollup-plugin-cleanup')
const replace = require('rollup-plugin-replace')
const { terser } = require('rollup-plugin-terser')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')

const packageJSON = require('../package.json')
const libName = packageJSON.name
const entryPath = path.resolve(__dirname, '../src/index.ts')
const outputPath = filename => path.resolve(__dirname, '../dist', filename)
const umdLibName = libName.charAt(0).toUpperCase() + libName.slice(1)

const banner =
  '/*!\n' +
  ` * Hearken.js v${packageJSON.version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} Imtaotao and JiangLiruii\n` +
  ' * Released under the MIT License.\n' +
  ' */'

const esm = {
  input: entryPath,
  output: {
    banner,
    format: 'es',
    file: outputPath(`${libName}.esm.js`),
  },
}

const cjs = {
  input: entryPath,
  output: {
    banner,
    format: 'cjs',
    file: outputPath(`${libName}.cjs.js`),
  },
}

const umd = {
  input: entryPath,
  output: {
    banner,
    format: 'umd',
    name: umdLibName,
    file: outputPath(`${libName}.umd.js`),
  },
}

const uglifyCjs = {
  input: entryPath,
  output: {
    banner,
    format: 'umd',
    name: umdLibName,
    file: outputPath(`${libName}.min.js`),
  },
}

const createReplacePlugin = isProd => {
  return replace({
    __DEV__: !isProd,
    __VERSION__: `'${packageJSON.version}'`,
  })
}

async function build(cfg, isProd, isUglify = false) {
  cfg.output.sourcemap = false

  const buildCfg = {
    input: cfg.input,
    plugins: [
      cleanup(),
      resolve(),
      babel({
        babelrc: true,
        exclude: 'node_modules/**',
      }),
      typescript({
        typescript: require('typescript'),
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        clean: true, // no cache
      }),
      cmd(),
      createReplacePlugin(isProd),
    ],
  }

  if (isUglify) {
    buildCfg.plugins.unshift(terser())
  }

  const bundle = await rollup.rollup(buildCfg)
  await bundle.generate(cfg.output)
  await bundle.write(cfg.output)
}

console.clear()
// Delete old build files
rm(path.resolve(__dirname, '../dist'))

const prodConfig = cfg => {
  const file = cfg.output.file
  const basePrefix = file.slice(0, file.length - 2)

  return {
    input: cfg.input,
    output: {
      ...cfg.output,
      file: `${basePrefix}prod${path.extname(file)}`,
    },
  }
}

const buildVersion = async () => {
  const builds = [
    build(esm, false),
    build(cjs, false),
    build(umd, false),
    build(uglifyCjs, false, true),
    // production version
    build(prodConfig(esm), true),
    build(prodConfig(cjs), true),
    build(prodConfig(umd), true),
  ]

  try {
    await Promise.all(builds)
    console.log('success!')
  } catch (error) {
    console.error('[BUILD ERROR]: ', error)
  }
}

buildVersion()
