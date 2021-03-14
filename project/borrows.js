module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');

	router.get('/', function (req, res) {
		res.render('borrows');
	});

	router.get('/return-data', function (req, res, next) {
		var context = {};
		getMemberBorrows(req, res, next, context);
	});

	function getMemberBorrows(req, res, next, context) {
		//var mysql = req.app.get('mysql');
		var a_query = 'SELECT * FROM Members WHERE memberEmail = ?';

		mysql.pool.query(a_query, [req.query.memberEmail], function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			//console.log(rows);
			if (rows.length == 0) {
				context.results = [0];
				res.send(context);
			} else {
				var a_query = 'SELECT borrowID, Books.bookID, firstName, lastName, transactionID, title, borrowDate, dueDate, returnDate FROM Members INNER JOIN Borrows ON Members.memberID = Borrows.memberID LEFT JOIN Books ON Borrows.bookID = Books.bookID WHERE memberEmail = ? ORDER BY borrowDate';
				mysql.pool.query(a_query, [req.query.memberEmail], function (err, rows, fields) {
					if (err) {
						next(err);
						return;
					}

					if (rows.length == 0) {
						mysql.pool.query('SELECT firstName, lastName FROM Members WHERE memberEmail=?', [req.query.memberEmail], function (err, rows, fields) {
							if (err) {
								next(err);
								return;
							}
							context.results = [1, rows];
							res.send(context);
						});
					} else {
						//console.log(rows);
						context.results = rows;
						res.send(context);
					}
				});
			}
		});
	}

	router.post('/update', function (req, res, next) {
		var context = {};
		//console.log('req.query', req.query);
		mysql.pool.query("UPDATE Books SET isAvailable=? WHERE bookID = ?", [req.query.isAvailable, req.query.bookID], function (err, result) {
			if (err) {
				next(err);
				return;
			}
			//console.log("am i here? books updated");

			mysql.pool.query("UPDATE Borrows SET returnDate=? WHERE borrowID = ?", [req.query.returnDate, req.query.borrowID], function (err, result) {
				if (err) {
					next(err);
					return;
				}
				//console.log("am i here? borrows updated");
			});
		});
	});

	return router;

}();
