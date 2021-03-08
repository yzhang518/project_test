module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');
	var warnings = require("./warnings.js");

	router.get('/', function (req, res) {
		res.render('authors');
	});

	router.get('/return-data', function (req, res, next) {
		var context = {};
		mysql.pool.query('SELECT authorID, firstName, lastName, hometown, bio FROM Authors ORDER BY lastName', function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			context.results = rows;
			res.send(context);
		});
	});

	// insert a new entry into the table
	router.post('/insert', function (req, res, next) {
		var context = {};
		//console.log("server query", req.query);
		mysql.pool.query("INSERT INTO Authors (`firstName`, `lastName`, `hometown`, `bio`) VALUES (?, ?, ?, ?)",
			[req.query.firstName, req.query.lastName, req.query.hometown, req.query.bio], function (err, result) {
				if (err) {
					context.SQLWarning = warnings.message(err.errno,'first and last name combination');
					console.log(err);
				}
				else{
					context.SQLWarning = false;					
				}
			});
		mysql.pool.query('SELECT firstName, lastName, hometown, bio FROM Authors ORDER BY lastName', function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			context.results = rows;
			res.send(context);
		});
	});

	router.post('/update', function (req, res, next) {
		var context = {};
		mysql.pool.query("UPDATE Authors SET firstName=?, lastName=?, hometown=?, bio=? WHERE authorID = ?", [req.query.firstName, req.query.lastName, req.query.hometown, req.query.bio, req.query.authorID], function (err, result) {
			if (err) {
				context.SQLWarning = warnings.message(err.errno,'first and last name combination');
				console.log(err);
				res.send(context);
			}
			else{
				mysql.pool.query("SELECT * FROM Authors ORDER BY lastName", function (err, rows, fields) {
					if (err) {
						next(err);
						return;
					}
					context.SQLWarning = false;	
					context.results = rows;
					res.type('application/json');
					res.send(context);
				});
			}
		});
	});

	return router;

}();


























