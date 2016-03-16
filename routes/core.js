/*
  Created by 'myth' on Mar 16. 2016

  Snekify is licenced under the MIT licence.
*/

var express = require('express')

router.route('/').get(function (req, res, next) {
  req.send('It works')
})

module.exports = router
