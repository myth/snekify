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
            line = line.substr(0, start) + '<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTEhIWFRUWFRUYFxYYFxUXGBcVFhcWFxYVGBgYHSggGBolGxUVIjEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGysfICUrLS0rLS0tLS0rKystLS0tLSstLS0tLS0tLS0tLS0tKy0tLS0tNy0tLTcrKzgtKy03K//AABEIAKAA1QMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAQIDBQYAB//EADkQAAEDAgUBBwEGBgIDAQAAAAEAAhEDIQQFEjFBUQYTImFxgZHwFDJCobHBFSNS0eHxYnIzQ5IH/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAEDAgT/xAAlEQACAgICAgMAAgMAAAAAAAAAAQIRAxIhMUFREyJh8PEycYH/2gAMAwEAAhEDEQA/AMOuSrkDGrk6FxCAGkLkpTUAKUi5cUAIU2E8hIgBq6E5cgBsJYSpUANhJCcQntpk8IAhISQi2YN54Uoyt/RK0FFdC6Fafwh/RQuy9w6o2Q6YDC6Eb9hKY7CEIsVApSKZ1A9FGW+SYDVyWFyAEXJVyAC10JYXQgYiSE4pCkIaQkhOKtKWSP066jXBoGpxANm23MGPhJyS7Gk30VMLoUmKp926HPZBi83AP9Qsmd424c7SRvIt5XHXzCFJMHFoaV0J1uCD6EG3VLCYhkLoU1GgXbK0w2SEm6UppDUWymbTJ2Vnl+VOebhaDC5Uxu+6mr4ltIcKEszfRRQ9gNHIGjdHUctpjoqrGZq47IR+Lf1S+z7NcLo1DO6b0XOxVLyWRFVzuShaxfxPyj4/0Njc/aqdvNJ9mY/ZYRlV3mrnK8c5o3nok4V0w2LbF5Z0VW7DFv3tlZYHM9ToPUqyxWHDm/ukpNcMdJ9GbZQaUPWwY+UfXwJpz0Q7K2o3/wBqiflGeOmVlfLoEhV76cG60OIJBsh8VhQ4Tz6LanXZlw9FHC5SOpkGFyqTomXJVyQxCkTlyBC0iA4E7BwnzAIkfEr2WlmFGo2rSY1rtIDodbU0iA5vyPleMq1yrEggU3GHNvTdteZ0zwZuDxt0UssW1wVx1YmeYRoxDX1GghrXAt3BPB+Y3tZZ2thZcJM6oaDeeAG+ZiPnyW3xdVuJHdVSGVDIFWIBP/IcOn9VmnYB2ExdNtYEiZ6khv6XiVzq12y0lyVdajVa5zR4i0CTAAZMxLthzZLRzDu3aazfRwsCODBGx4PkVH2izZ1XTSDAwNqPe7Tq1VHmzaj5O7W+EAWAJ2lCYikW0KQcfF3ji1vLaRa2SegLgYB6E8rpS47IPs9CyGrQqDwOEjdps4e3I8wjcxzFlNtl5BSxjmEOaYI2I3+VeUM17+zj4o+VOWPyNS4NRhc6L3+X6onG4gEREet1ncCwNv8AUqcV5eOUml4N/wCwqpBsnuECEyqNijBhi5sgJtjUUCxHVOcI3G6MGAJAtdSPy4mOFjdezenpFRVpAuRmHpCIUuIwJDhAQ7g5rohNP9E4jXjSbXWly7GamiVn6LeSpKWLDXQBb6um1sY6NXUw7XtIWcxmUFuxtKny7NdLoOx/JXLqtN1wR6LHMQ4ZlXsLTG6mawkeav6mHpugnfyPCQVKbQ3u26pJEC9+s9E9woqP4Dr8Rhcjvt9Muc11VtPTEA7mdyuWtmFIxhXQuTl0kBi6E4pEAdpXQlShAguninOs7xcTzHF+VqslrMcNNdutsQ1xHiYP6fNtvZZzDYMiCVp8BRnS0buIHubLnyV4OiEpVRXY7/8APBXfVrirDXQaQHDYFyeTZYvD5K8h4LP/AB1HscZMvLYm52Fx6r1atUdhtQa7w3kcE9Y4KrG5pQqD72h1/C6Bc7kO2MqezXBZ432eS4vAuuWsMAkWGxESLWCDpEh25AEz7eXwvRm5cW1q9gWvIeD6th35j81RuwVOo6odIlrg245iffhb+SiDgU2EzMiA64AseY+ir6iwPgscCqyllusQ1oBEgvO369Cgstx7qLtOq0x1907tXEHx2b/D026PEp24plMRZYzMs3e0A723G3wqU5nVqG1gpxxuRp5KPRa2esCFf2laNisXTwj3feJRdLLwN1RYfZN5GahvaNpRuFx1N/qVlGYdoUrBGyfwIFlZqqtAEW5VVVpx6pmCzIts5HVqAqAOb8LNOPZvZMEAEzO25HVRVnFvi1SCpfsxBcPJB92NMk3nZaTE4kX255FhAHHkpcLVqHV/NLSANDG86twEraDmNJ0yOOoT6GClhe10dZ3Fv1Q2qBRYJjQ8aW6GWESLk/8AY9Vygfh3fhd6rlqmYtegoBKuhcqmBEoXFIEAcisvo6nIrK+z+IxALqdM6R+I+FvsTv7LR5ZkDKN61ZjTyBLj8wsSkkimPHKXRUMpPc9rGguM2Av9DzW3wGCFFup/3/LZvv1TsC+gyRSEEi5i5+d0uIqSP6jxyoSd8nbiw6vkqM1PeeED1/sqXEZYI+78jbz9Fpfs9Z3QfXkiMPkrWnXiHkxcNiJ6WNz72SUV22Uk/wAM3lmQltIMawkkl0AbSZ9lT4yjSD30iC57TBDfuzE7jffotrnOc6gWsBa02IB3i0k8rIYxukENAB+T7lSlNN8E2nXJn8fX7prQA0kTDRETwT1KxmJDu8MiCT+q2WKwRu4j32/2gamUd8dIEu8uPUrePKovnyc04bDcsokgse2WugSYMHyIv0Uwy7uzdtjsRce/Rdh8NocGPbB85ExI1QNxa48la4So13hdDg4WAJsZt+XmrW1yideGAAJEVjMGaZiDEmDHTf4QhVk7VmGqdDkkpupJqTMj5ReCxxYfJAyulJqzSdGqw9VlQEzcqD7BDXW2M9VnqOILDIVjRzkxDv8Aai4NdFIz9h2GY9zRp+8Tvb7qNwGFJa8FrQ1oj1PUqsGds1SSRAsoaufs0eGSZ8Q4J9Fj7G9l2F4rsxTBBfVkkT4doXKkzDPi50tptA/7f4SoqZjgmXLiuC6iQhSQnFLCAPQ+zHbal3bKGIpkFga1rm7OaNpH4T8j0V9icbQd+MkdC2YXkuAMVG+oW+qU3Np627wubLaZ1YJ1yw6ni6Mw0kkcBg/uurZu0CdDifNw+IGyqmYXS01AYeQoMrpPLpLdQG6nzy7Oh5G6Ra/xuoRLWho2tMj5VFi8XUc839ZmUmPxEuIa4tHRdjXNbTBa8OPPVOurRJuTun0VdTNC0w4fH9kbhsSx19OqOSYA8yIlBDDOeHOa0H1QprNt4NLhzKJQi+EYuVWy2zHC0i0nvdBO9QjabeEHdMw3Z2phS3vHiuHBzi0O06AdtREyT+SMybEE2qsEbAwIPQlHY/AMo0yaMy54MFxgkgAiOfIKaSVoTT7KbNsBTqUS9jIqAyDImfumJ33iPVU1PDEMNps1xIdAa0FvzABv5xuVaFrnR4jBLxoFmwDBLvEC4byYm0WEzUV3eNo1WAJgxp1+LVVF7EDTpEGIF72rBaxozN2WRosfRlxmASdwR4QTfkjbaFUMxVL7ppzBji46z1/soM3zYtb3YMyBquZa03idi534lnxiTq2mfOfj64VIJ0Zb5Ni1uFcJEjr1HmiTlOGMRVInYn91ksA52rTED1iyt8O2oGlpa8AX2n872TfHkX/C0qdlHExTqBx3g2QeI7N12idOr03UTcwcIO2kxvDj5TP7K/wGbVAdQlzSCXapMWgTH7IuYqRksTg3s++wtnaQoAV6Bhc5Y+mC+nqggWAPrY7W4RNbJsJiXODdOotB8NiPO36I+Vr/ACHp6PNi0FN7odFqcz7F1aYBpu7wmfBEERJsZg7LMVmuaSHAgjcGx+CqKUWYaoTux0XJgcuTEWyUtSFLKYDQE6Uqd3aAGNdF16D2czRtVgY7jdefOYiMuxppPlTyxUkbg6Z6dmeDL2HR4YQVHK306Jhx5KqMo7TF7tL9pstBRzJrnadcCdlyU4qjpU7ezKbK8GXvu2w3nlV+daQ8tDIjgLaOxYqWaGgN3PVVOPw9Oq8FrS6PvELan9rf9C40pLkoKdBjaJdLtRB2lURa0FrnH8QgdfVb7ENpFoY3mxjgear/AOACi5tQPBGoQ0i8H3Shkq74CavWnaQFWpxTnWAd4HPQQloPq1KDC8eAPJJB/A06SZPTefJXuNyxrqZeNIMWJ2S4PA95h3UWgRDmFxMAyHWEcce6nGSavyVnVquUZLE1tXhZp0eI0yGSS1xInxQTJJ49SgauGc0EFsBov4YM2Em23l6e97gMoqNeC9v8tvhLQdiAZOrckH2hLWAc80zU1iQA5wOptojqfVV3W2q5JvH9d5cejzTOsI5tQkGQ6SHeu4g83j2Cp6o/47QTAMbCD5L1OtSpl2kiCHEGCC09CRwqrMuylGqW92/QXnxBoGlu1xO87wrqXshS9mLwdUOLTcAGIWmOYaKje6quuNjNvZSUuylWg4kVKbjJDANz6gbFLhcgxDna30DYyXO2twefdZeu1s0k0qXkJqNYGAu0VXF0uAMG/EwR5oplZtUN0U3Mc1p1GNTYgxa9/NV+NwkvLNDqYtsHR624RtEvoFlOg91Srp+4GkSIPAvZYrhezfFv0S4XDF7Jc1rmh17w7rOm0xcWPKGFV7SSCSHl1hY6QCRAEkgQfRS0m92z+Yx4fUHh2EOM8bEb9DZE1Yc3YNqHhuseDnU4Hw8W+Oi2pGHFFv2dz41IZUIMxpeBAA/Cw3uSDxvHCk7T4Om6i46ZLIIaXNA0xYm13QeNlQ5YBRLKlQgb8XdO0RaTHnuq/tH2nFdpYxpDJlzbanOG3lHsp6vb6hfHINiMsYI7us2CBIdIcDyD7/35XIWmKdVznVdM+GA3TpAj13iAfRIujf8ATFFi5qc2mnQlWjA6m0Sp3sCFAuntqFAC1W2VfiQjnOlMLZCBAGExDqbg7orHMM01gFvUShqlGUJVoQsuKbHs0XdWo5zNTHloAuAYlG9nc4qhroIIHB32WS1vaLO9l1DMKjJspuDqjakbal2mdh3DUwO1u3sDPREO7VCgTUdR1FxtBsPVefZljTVAlpBBBBHkpmZxDC1wPus/HxyjW3Jusp7RMq1SazdLnGW05loHWOqO+3CnX7wQaMnwi/iABsP+znHzXmuXZ73Ty/eeoWl7Ldo2VaugwXkF1Icd4BMRyYBPsszh3wOM+D0jBYgVqZLS1rWusPxQYJMcDf1VJ2rygP0mgSXEx4YJJ4NvhZXAYypXrNLSGVdTw8gkgNFy0bTuT7rcYXOXmn3baeo0gLiOkg358lNw1dopvstX0Y/+FV7Ncxwc2YJls/O/KtaODAZoaWueLmRYz+w2WuxBa5lOo98xDi2AAYBkSonMbUHe4emS3aSIEbH1hZyZJtFMOkWYbGYstLRqFI0zB0iYnm24ugaeIL3FrTq8V3Fxg8A+S0faHsk5ru/ZV1B1y2wj0VPgcgxIHeANDSTv+ITyqucVCycYt5Pwjx2Yvw7NLajiC7xFpkjyEcIQdp6nDm0w8k6hLnN43ImVF2vw4pgaWbmHR05lZ7L6Gmo25uJiJuOJTx1KGw8q1yao0OLx7wyBUDQ43qX1kx1dsCqXFY3wmkx3g2cS6SXC5O1geikzegXNFTUQ0Ou11wPNU32l+oOa9pGoC4BMbXIRj5jZnMlGVBNeoR/MdBaBAEucBEeG/wCiGZiWutBOqJIhoBH6AH9VY42m6qDDjLL6dwqBoI+64m51NIi0333W4S2RmUdWLinOb5iTBFtvVcrN+VB4B06bfPn5DyXLPywMPHKzQOOyQvg7LjPUJvyuokOLk4PCjLkhf9f5QBNqTtYCG7xMfV9EqALMJpg7hCNrRvyuNQ/X6IHYQWC6YcK08JKZP1+6lB3SAa3ANJ9ElTAjcp4qcBQOqdJj8kACVssH0FDRwndva9tnNcHA9CDIRzyfb91CTdDA9Gwb2Y2jTq0/DVpkNfEag3Zzf/kugq3rMDHllNsa7tjktF5PWI+F5RlWbVMNUFRm+xHDm9D8L0HLe09DGMDZ7uqCCATs4cjqLLlyY2isZJg2btp4enUfXcS4uaGgeJoDheR181W5RntVtQNoVCGuMafvA24HBWnzvLW4gAhxFxqLdyOYVPXyOnhIrUNbtB1EOdMggg/qiM4qNPsKdlplmZigX/aNJL/uTxxEcKDEZ8WPDKodTomTIHEWACZjMNTIbVdcgtcI9txzZZzt7iC5oewPLZB1BpIA/ZSSUmrRTakXju0eEp6u6cKgdGoOgzG267F0KbXNrTTOztIFrjqvP8losqPcXm7ANP8AyJlXFPL3vDxVJawNBa0Hf+ycsSi6TGsj8pFxXAxdNxYGsYDpMm89AAq7+F4dzi2lTGsN8RLjAHWFj8dV7t2gOIA5BuByCiKuIOHbqa8lzhd07zxCawtL6ukJ5bfKs0tXECGUAGh8QXSA0xzKqsU2m3TSimXkmasX5J9SsticSH+I1C53IIgeyibThocDJPvHoqLBXn+zMsrl/PBb5jmpBDQ+Q0RMX97rlQVnC1rxf1XKqxRJ7noOn62SuET+mymhcWqxMHLflL3YU5bKaGcf5QAMaPqo+5N946b2R76R5TdHKQAJo83+vZPbS55t/hFmklLPhAApBPPPyk0n62RbmpjW3QAKynPPyFI1g/yiS3ZIB5IAGgWteP8ASHe39/ryVi5o6KGpSlAFRWYY280LUBHH1/dXjsOBeEO/C+QSAiwPafEUYAcSBw69v1V/he3M/wDkYRNuoWffh/L69EM/CA8XWXji/A1Kjbs7UUHgAPEbJ1PNWhndh0tkx6Hhef1MCFD9hI2cR6KfwLwa+Q17GtZiO9BEaTbz/wBKLFY7+Y10k3Midxssr3NUf+w/kkdRrf1/kn8Qblrnxp1JcGAEbQOfPqhK5pCmG6ZcAJcb38uiBfhqvL/yUTsA8i7iVpY37FsMYxjRJEuvvsOiHOJtHmiBlZ5JU1PKh0JVKM2VffFcr+nlTRu39Uq1wB//2Q==" />' + line.substr(end+1, line.length)
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
