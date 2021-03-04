module.exports = function () {
	var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var bodyParser = require('body-parser');

	router.get('/', function (req, res) {
		res.render('search');
	});

	router.post('/select', function (req, res, next) {
		var context = {};
		//console.log(req.query.length);
		//console.log("query", req.query);

		var condition = '', a_query;
		var tableName = req.body.searchBy;
		if (tableName == 'title') {
			condition = 'Books.title = ' + "'" + req.body.searchInput + "'";
		} else if (tableName == 'category') {
			condition = 'Categories.catName = ' + "'" + req.body.searchInput + "'";
		} else {
			condition = "CONCAT(firstName, ' ', lastName) LIKE " + "'" + req.body.searchInput + "'";
		}

		a_query = "SELECT Books.bookID, title, CONCAT(firstName,' ',lastName) AS fullName, catName, isAvailable FROM Books INNER JOIN author_book_table ON Books.bookID = author_book_table.bookID INNER JOIN Authors ON author_book_table.authorID = Authors.authorID INNER JOIN cat_book_table ON Books.bookID = cat_book_table.bookID INNER JOIN Categories ON cat_book_table.catID = Categories.catID WHERE " + condition + 'ORDER BY Books.bookID';

		mysql.pool.query(a_query, function (err, rows, fields) {
			if (err) {
				next(err);
				return;
			}

			if (rows.length != 0) {
				mergeDupBooks(0, rows);
			}

			context.results = rows;
			res.send(context);
		});
	});

	router.post('/insert-borrow', function (req, res, next) {
		var context = {};
		var a_query = "INSERT INTO Borrows (`bookID`, `transactionID`, `borrowDate`, `dueDate`, `returnDate`, `memberID`, `overdue`) VALUES (?, ?, ?, ?, ?, ? ,?)";

		var i;
		for (i = 0; i < req.body.bookIDs.length; i++) {
			var bookID = req.body.bookIDs[i];
			var a_list = [bookID, req.body.transactionID, req.body.borrowDate, req.body.dueDate, req.body.returnDate, req.body.memberID, req.body.overdue];

			mysql.pool.query(a_query, a_list, function (err, result) {
				if (err) {
					next(err);
					return;
				}
			});

			// update availability to 0
			mysql.pool.query("UPDATE Books SET isAvailable=? WHERE bookID = ?", [0, bookID], function (err, result) {
				if (err) {
					next(err);
					return;
				}
			});
		}
		context.results = [i];
		res.send(context);
	});

	function mergeDupBooks(i, rows) {
		if (i + 1 == rows.length) {
			return rows;
		} else {
			var row = rows[i];
			var next = rows[i + 1];
			var authors = [row.fullName];
			var categories = [row.catName];
			if (row.bookID == next.bookID) {
				if (!categories.includes(next.catName)) {
					categories.push(next.catName);
					row.catName = categories;
				}
				if (!authors.includes(next.fullName)) {
					authors.push(next.fullName);
					row.fullName = authors;
				}
				rows.splice(i + 1, 1);
			} else {
				i += 1;
			}
			mergeDupBooks(i, rows);
		}
	}

	return router;
}();
