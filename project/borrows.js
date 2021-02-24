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
		if (!req.query.memberEmail || !req.query.memberPWD) {
			context.results = [0];
			res.send(context);
		} else {
			getMemberBorrows(req, res, next, context);
		}
	});

	function getMemberBorrows(req, res, next, context) {
		//var mysql = req.app.get('mysql');
		var a_query = 'SELECT * FROM Members WHERE memberEmail = ?';

		mysql.pool.query(a_query, [req.query.memberEmail], function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}

			//console.log("row len", rows.length);
			//console.log("pwd", rows[0].memberPWD);
			if (rows.length == 0) {
				context.results = [1];
				res.send(context);
			} else if (rows[0].memberPWD != req.query.memberPWD) {
				context.results = [2];
				res.send(context);
			} else {
				var a_query = 'SELECT borrowID, Books.bookID, firstName, lastName, transactionID, title, borrowDate, dueDate, returnDate, overdue FROM Members INNER JOIN Borrows ON Members.memberID = Borrows.memberID INNER JOIN Books ON Borrows.bookID = Books.bookID WHERE memberEmail = ? ORDER BY borrowDate';
				mysql.pool.query(a_query, [req.query.memberEmail], function (err, rows, fields) {
					if (err) {
						next(err);
						return;
					}
					context.results = rows;
					res.send(context);
				});
			}
		});
	}

	router.post('/update', function (req, res, next) {
		var context = {};
		console.log('req.query', req.query);
		mysql.pool.query("UPDATE Books SET isAvailable=? WHERE bookID = ?", [req.query.isAvailable, req.query.bookID], function (err, result) {
			if (err) {
				next(err);
				return;
			}
			//console.log("am i here? books updated");

			mysql.pool.query("UPDATE Borrows SET returnDate=?, overdue=? WHERE borrowID = ?", [req.query.returnDate, req.query.overdue, req.query.borrowID], function (err, result) {
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
