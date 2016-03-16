/*
  Created by 'myth' on Mar 16. 2016

  Snekify is licenced under the MIT licence.
*/

var fs =            require('fs')
,   express =       require('express')
,   request =       require('request')
,   concat =        require('concat-stream')
,   log =           require('./logging')
,   pkg =           require('../package.json')
,   config =        require('../config.json')
,   path =          require('path')

var snekify = function (lines, url) {
    lines = lines.toString('utf8')
    lines = lines.split('\n')
    var output = ''

    var scheme = 'http://'
    if (url.indexOf('https') > -1) {
        var request = url.replace('https://', '')
        var scheme = 'https://'
    }
    else if (url.indexOf('http') > -1) {
        var request = url.replace('http://', '')
    }
    var domain = request.replace(scheme, '')
    domain = domain.substr(0, domain.indexOf('/') > -1 ? domain.indexOf('/') : domain.length)
    
    for (var i = 0; i < lines.length; i++) {
        var me = /(\si\s|\sI\s|\sme\s)/gi
        var my = /(\smy\s)/gi
        var we = /(\swe\s|\svi\s)/gi
        var they = /(\sthem\s|they\s)/gi
        var you = /(\syou\s|\sdere\s)/gi
        var your = /(\syour\s|\sderes\s)/gi
        var href = /(href="\/)/gi
        var src = /(src="\/)/gi
       
        console.log(scheme)
        console.log(url)
        console.log(domain)

        line = lines[i]
        if (line.indexOf('rel="stylesheet"') > -1) {
            line = line.replace(href, 'href="' + scheme + domain + '/')
        } else {
            line = line.replace(href, 'href="/?url=' + scheme + domain + '/')
        }
        if (line.indexOf('img src') > -1) {
            start = line.indexOf('<img')
            end = line.indexOf('>')
            line = line.substr(0, start) + '<img src="http://2static4.fjcdn.com/comments/Snek+spell+it+right+_12de0f65ccac6fde4848a7d5de327e7e.jpg" />' + line.substr(end+1, line.length)
        } else {
            line = line.replace(src, 'src="' + scheme + domain + '/')
        }
        line = line.replace(me, ' da snek ')
        line = line.replace(my, " da snek's ")
        line = line.replace(we, ' us sneks ')
        line = line.replace(they, ' dem sneks ')
        line = line.replace(you, ' u sneks ')
        line = line.replace(your, " u snek's ")

        output += line
    }

    return output
}

// Initialize the express app
snek = express()

// Set logging middleware
snek.use(require('morgan')('combined', {'stream': log.stream}))

// Set static
snek.get('/', function (req, res, next) {
    if (req.query.url === undefined || req.query.url === null) {
        res.send('<!DOCTYPE html><html><body>Usage: <a href="/?url=https://hakloev.no">https://snek.ify.no/?url=https://hakloev.no</a></body></html>')
    } else {
        var self = this
        self.url = req.query.url
        write = concat(function(completeResponse) {
            var finalResponse = snekify(completeResponse, self.url)
            res.end(finalResponse)
        })

        var r = request(self.url)
        .on('error', function (err) {
            res.end('Error')
        })
        .pipe(write)
    }
})

// Lets drink some Cognac and watch documentaries...
server = snek.listen(config.port, config.host, function () {

  var host = server.address().address
  var port = server.address().port

  log.info("Snekify v%s running at %s:%s", pkg.version, host, port)

})
