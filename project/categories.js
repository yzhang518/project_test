module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');
	var warnings = require("./warnings.js");

	router.get('/', function (req, res, next) {
		var context = {};

		mysql.pool.query("SELECT catName, catDescription, catID FROM Categories ORDER BY catName", function (err, result) {
			if (err) {
				console.log(err);
			}
			context.type = 'Categories';
			context.categories = result;
			//console.log(context.categories);
			res.render('categories', context);
		});
	});

	router.post('/', function (req, res, next) {
		var context = {};
		if (req.body['Add']) {
			console.log('add');
			mysql.pool.query(
				"INSERT INTO Categories (catName, catDescription) VALUES (?,?)",
				[req.body.catName, req.body.catDescription],
				function (err, result) {
					if (err) {
						context.SQLWarning = warnings.message(err.errno, 'category');
						console.log(err);
					}
					else {
						context.SQLWarning = false;
					}
					context.type = 'Categories';
					res.send(context);
				});
		} else if (req.body['Update']) {
			console.log('update', req.body);
			mysql.pool.query(
				"UPDATE Categories SET catName=?, catDescription=? WHERE catID = ?",
				[req.body.catName, req.body.catDescription, req.body.catID],
				function (err, result) {
					if (err) {
						context.SQLWarning = warnings.message(err.errno, 'category error');
						console.log(err);
					}
					else {
						context.SQLWarning = false;
					}
					context.type = 'Categories';
					res.send(context);
				});
		}
	});

	return router;

}();



