module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');

	router.get('/', function (req, res) {
		res.render('categories');
	});

	router.get('/return-data', function (req, res, next) {
		var context = {};
		mysql.pool.query('SELECT catID, catName, catDescription FROM Categories ORDER BY catName', function (err, rows, fields) {
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
		mysql.pool.query("INSERT INTO Categories (`catName`, `catDescription`) VALUES (?, ?)",
			[req.query.catName, req.query.catDescription], function (err, result) {
				if (err) {
					next(err);
					return;
				}
			});
		mysql.pool.query('SELECT catName, catDescription FROM Categories ORDER BY catName', function (err, rows, fields) {
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
		console.log('server query', req.query);
		console.log('server body', req.body);

		mysql.pool.query("UPDATE Categories SET catName=?, catDescription=? WHERE catID = ?", [req.query.catName, req.query.catDescription, req.query.catID], function (err, result) {
			if (err) {
				next(err);
				return;
			}
			mysql.pool.query("SELECT * FROM Categories ORDER BY catName", function (err, rows, fields) {
				if (err) {
					next(err);
					return;
				}
				res.type('application/json');
				res.send(rows);
			});
		});
	});

	return router;

}();












