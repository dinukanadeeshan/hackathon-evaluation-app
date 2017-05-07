var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');

/* GET home page. */
router.get('/admin', function(req, res, next) {
	console.log(global.admins);
	if(global.admins.socket_id){
		res.send('"All mentors have a way of seeing more of our faults than we would like. It’s the only way we grow." — Padme');
		return;
	}
	  res.render('admin');
});
router.get('/judge', function(req, res, next) {
  res.render('judge');
});

module.exports = router;
