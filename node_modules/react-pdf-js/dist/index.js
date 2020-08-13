
         'use strict'

      if (process.env.NODE_ENV === 'production') {
        module.exports = require('./react-pdf-js.cjs.production.js')
      } else {
        module.exports = require('./react-pdf-js.cjs.development.js')
      }