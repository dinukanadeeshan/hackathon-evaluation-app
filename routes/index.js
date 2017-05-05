var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res, next) {
  res.render('admin');
});
router.get('/judge', function(req, res, next) {
  res.render('judge');
});

module.exports = router;
