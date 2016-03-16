/*
  Created by 'myth' on Mar 16. 2016

  Snekify is licenced under the MIT licence.
*/

var fs =            require('fs')
,   express =       require('express')
,   log =           require('./logging')
,   pkg =           require('../package.json')
,   config =        require('../config.json')
,   routes =        require('../routes/core')
,   path =          require('path')

// Initialize the express app
ct = express()

// Set logging middleware
ct.use(require('morgan')('combined', {'stream': log.stream}))

// Set static
ct.use('/static', express.static('public'))

// Set core routes
ct.use('/', routes)

// Lets drink some Cognac and watch documentaries...
server = ct.listen(config.port, config.host, function () {

  var host = server.address().address
  var port = server.address().port

  log.info("Snekify v%s running at %s:%s", pkg.version, host, port)

})
