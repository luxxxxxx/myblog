const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const http = require("http"),
      express = require("express"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      session = require("express-session"),
      app = express();


console.log('mode Develope')






module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})

