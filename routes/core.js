/*
  Created by 'myth' on Mar 16. 2016

  Snekify is licenced under the MIT licence.
*/

var express = require('express')
var bp = require('body-parser')
var router = express.Router()

// Base handler
router.use(bp.json({}))
router.use(bp.urlencoded({extended: false}))

router.route('/').get(function (req, res, next) {
  res.render('index', { title: 'Snekify' })
})

module.exports = router
