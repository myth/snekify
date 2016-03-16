/*
  Created by 'myth' on Mar 16. 2016

  Snekify is licenced under the MIT licence.
*/

var winston = require('winston')
var fs = require('fs')
var path = require('path')
var config = require('../config.json')

winston.emitErrs = true;

var logConf = {
  transports: []
}

// Helper to create our 'logs' directory if it does not exist
var ensureExists = function (dir, mask, callback) {
  if (typeof(mask) === 'function') {
    callback = mask
    mask = 0755
  }

  if (!path.isAbsolute(dir)) {
    dir = path.resolve(__dirname, '../', dir)
  }

  try {
    fs.mkdirSync(dir, mask)
    callback(null, dir)
  } catch (e) {
    if (e.code !== 'EEXIST') callback(e, dir)
    else callback(null, dir)
  }
}

if (config.logging.console) {
  logConf.transports.push(
    new winston.transports.Console({
      level: config.logging.consoleLevel,
      handleExceptions: false,
      json: false,
      colorize: true
    })
  )
}

if (config.logging.file) {
  // Create logs directory if it does not exist
  ensureExists(config.logging.filePath, function (err, dir) {
    if (!err) {
      logConf.transports.push(
        new winston.transports.File({
          level: config.logging.fileLevel,
          filename: path.join(dir, 'snekify.log'),
          handleExceptions: false,
          json: false,
          maxSize: 5242880,
          maxFiles: 5,
          colorize: false
        })
      )
    }
    else {
      console.error("Failed to create logs directory. File disabled. " + err)
    }
  })
}

var logger = new winston.Logger(logConf)

module.exports = logger
module.exports.stream = {
  write: function (msg, enc) {
    logger.info(msg.trim())
  }
}
