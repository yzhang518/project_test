module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');

	router.get('/', function (req, res) {
		res.render('login');
	});


	return router;

}();
