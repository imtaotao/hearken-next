'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/hearken.cjs.prod.js')
} else {
  module.exports = require('./dist/hearken.cjs.js')
}
