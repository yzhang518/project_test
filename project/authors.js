module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');
	var warnings = require("./warnings.js");

	router.get('/', function (req, res, next) {
		var context = {};

		mysql.pool.query("SELECT firstName, lastName, hometown, bio, authorID FROM Authors ORDER BY lastName", function (err, result) {
			if (err) {
				console.log(err);
			}
			context.type = 'Authors';
			context.authors = result;
			res.render('authors', context);
		});
	});

	router.post('/', function (req, res, next) {
		var context = {};
		if (req.body['Add']) {
			console.log('add');
			mysql.pool.query(
				"INSERT INTO Authors (firstName, lastName, hometown, bio) VALUES (?,?,?,?)",
				[req.body.firstName, req.body.lastName, req.body.hometown, req.body.bio],
				function (err, result) {
					if (err) {
						context.SQLWarning = warnings.message(err.errno, 'author');
						console.log(err);
					}
					else {
						context.SQLWarning = false;
					}
					context.type = 'Authors';
					res.send(context);
				});
		} else if (req.body['Update']) {
			//console.log('update', req.body);
			mysql.pool.query(
				"UPDATE Authors SET firstName=?, lastName=?, bio=?, hometown=? WHERE authorID = ?",
				[req.body.firstName, req.body.lastName, req.body.bio, req.body.hometown, req.body.authorID],
				function (err, result) {
					if (err) {
						context.SQLWarning = warnings.message(err.errno, 'authors error');
						console.log(err);
					}
					else {
						context.SQLWarning = false;
					}
					context.type = 'Authors';
					res.send(context);
				});
		}
	});

	return router;

}();








