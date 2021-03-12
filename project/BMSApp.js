var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require("body-parser");
var mysql = require("./dbcon.js");
var warnings = require("./warnings.js");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use('/borrows', require('./borrows.js'));
app.use('/categories', require('./categories.js'));
app.use('/authors', require('./authors.js'));
app.use('/search', require('./search.js'));

/****************
 ** Index Page **
 ****************/
app.get('/', function (req, res, next) {
  var context = {};
  context.type = 'BMS Home';
  res.render('index', context);
});

/******************
 ** Members Page **
 ******************/
app.get('/members', function (req, res, next) {
  var context = {};

  mysql.pool.query("SELECT lastName, firstName, memberEmail, phoneNum, memberID FROM Members ORDER BY lastName", function (err, result) {
    if (err) {
      console.log(err);
    }
    context.type = 'Members';
    context.members = result;
    res.render('members', context);
  });
});

app.post('/members', function (req, res, next) {
  var context = {};
  if (req.body['Add']) {
    mysql.pool.query(
      "INSERT INTO Members (firstName, lastName, phoneNum, memberEmail, memberPWD) VALUES (?,?,?,?,?)",
      [req.body.firstName, req.body.lastName, req.body.phoneNum, req.body.memberEmail, req.body.memberPWD],
      function (err, result) {
        if (err) {
          context.SQLWarning = warnings.message(err.errno, 'member or member email');
    	  console.log(err);
        }
		else{
          context.SQLWarning = false;
		}
		context.type = 'Members';
        res.send(context);
      });
  }

  else if (req.body['Update']) {
    mysql.pool.query(
      "UPDATE Members SET lastName=?, firstName=?, memberEmail=?, phoneNum=? WHERE memberID = ?",
      [req.body.lastName, req.body.firstName, req.body.memberEmail, req.body.phoneNum, req.body.memberID],
      function (err, result) {
        if (err) {
          context.SQLWarning = warnings.message(err.errno, 'member or member email');
    	  console.log(err);
        }
		else{
          context.SQLWarning = false;
		}
		context.type = 'Members';
        res.send(context);
      });
  }
});


/****************
 ** Books Page **
 ****************/
//DISPLAY DOESN'T ACCOUNT FOR MULTIPLE AUTHORS AND CATEGORIES
// res.append Source: https://www.tutorialspoint.com/nodejs/nodejs_response_object.htm
app.get('/books', function (req, res, next) {
  var context = {};
  mysql.pool.query(
    "SELECT bookID, title, price, copyrightYear, publisher FROM Books ORDER BY title",
    function (err, result) {
      if (err) {
		console.log(err);
      }
      context.type = 'Books';
      context.books = result;
	  mysql.pool.query(
	    "SELECT catName FROM Categories ORDER BY catName", 
		function (err, result) {
          if (err) {
		    console.log(err);
          }
	    context.dropdown = result;
        getLists(0, context, res);
	  });

    });
});


app.post('/books', function (req, res, next) {
  var context = {};

  // Add Author Book Relationship 
  if (req.body['addAuthor']) {

    // Insert into author_book_table
    mysql.pool.query(
      "INSERT INTO author_book_table (authorID, bookID) VALUES ((SELECT authorID FROM Authors WHERE firstName = ? AND lastName = ?), (SELECT bookID FROM Books WHERE title = ?))",
      [req.body.firstName, req.body.lastName, req.body.title],
      function (err, result) {
        if (err) {
          context.SQLWarning = warnings.author_book[err.errno];
    	  console.log(err);
        }
		else{
          context.SQLWarning = false;
		}
	    mysql.pool.query("UNLOCK TABLES", function (err, result) {
		  if (err) {
			next(err);
			return;
		  }
	    });
		context.type = 'Books';
	    res.send(context);
      });
	  }


  // Add Category Book Relationship 
  else if (req.body['addCategory']) {
    mysql.pool.query(
      "INSERT INTO cat_book_table (catID, bookID) VALUES ((SELECT catID FROM Categories WHERE catName = ?), (SELECT bookID FROM Books WHERE title = ?))",
      [req.body.category, req.body.title],
      function (err, result) {
        if (err) {
          context.SQLWarning = warnings.category_book[err.errno];
    	  console.log(err);
        }
		else{
          context.SQLWarning = false;
		}
		context.type = 'Books';
	    res.send(context);
      });
  }

  else if (req.body['Add']) {
    // Insert Into Books
    mysql.pool.query(
      "INSERT INTO Books (title, price, copyrightYear, publisher, isAvailable) VALUES (?,?,?,?,1)",
      [req.body.title, req.body.price, req.body.copyrightYear, req.body.publisher],
      function (err, result) {
        if (err) {
          context.SQLWarning = warnings.book[err.errno];
    	  console.log(err);
		  context.type = 'Books';
	      res.send(context);
        }
        else {
          // Add Relationship to cat_book_table  
          mysql.pool.query(
            "INSERT INTO cat_book_table (catID, bookID) VALUES ((SELECT catID FROM Categories WHERE catName = ?), (SELECT bookID FROM Books WHERE title = ?))",
            [req.body.category, req.body.title],
            function (err, result) {
              if (err) {
                context.SQLWarning = warnings.book[err.errno];
                console.log(err);
		        context.type = 'Books';
				mysql.pool.query("DELETE FROM Books WHERE title=?",[req.body.title], function (err, result){
				  if (err) {
                    console.log(err);
				  }
				});
	            res.send(context);
              }
              else {
                // Add Relationship to author_book_table  
                mysql.pool.query(
                  "INSERT INTO author_book_table (authorID, bookID) VALUES ((SELECT authorID FROM Authors WHERE firstName = ? AND lastName = ?), (SELECT bookID FROM Books WHERE title = ?))",
                  [req.body.firstName, req.body.lastName, req.body.title],
                  function (err, result) {
                    if (err) {
                      context.SQLWarning = warnings.book[err.errno];
                      console.log(err);
    				  mysql.pool.query("DELETE FROM Books WHERE title=?",[req.body.title], function (err, result){
	    			    if (err) {
                          console.log(err);
			    	    }
				    });
                    }
					else{
                      context.SQLWarning = false;
					}
		            context.type = 'Books';
	                res.send(context);	
                  });
              }
            });
        }
      });
  }

  // Delete Book
  else if (req.body['Delete']) {
    mysql.pool.query(
      "DELETE FROM Books WHERE bookID=?",
      [req.body.bookID],
      function (err, result) {
        if (err) {
          console.log(err);
        }
		else
		{
		  context.SQLWarning = false;
		  res.send(context);
		}
      });
  }

//DELETE  res.send(context);
});


/****************
 ** Errors     **
 ****************/
app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

//NOT WORKING NOT USING NEXT FOR DEBUGGING
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

function getLists(i, context, res){
  var bookTotal = context.books.length;
  
  // At last book render page
  if(i === bookTotal){
    res.render('books', context);
    return;
  }
  
  // Get Author List for Current Book
  var bookID = context.books[i].bookID
  mysql.pool.query("SELECT firstName, lastName FROM author_book_table ab JOIN Authors a on ab.authorID = a.authorID AND ab.bookID = ?", 
  [bookID], function(err, result){
    if(err){
  	  console.log(err);
  	}
	
	// Store Author List
    context.books[i].authors = result;

    // Get Category List for Current Book
    mysql.pool.query("SELECT catName FROM cat_book_table cb JOIN Categories c on cb.catID = c.catID AND cb.bookID = ?", 
    [context.books[i].bookID], function(err, result){
      if(err){
 	    console.log(err);
      }
	  
      // Store Category List
      context.books[i].categories = result;	
	  
      // Go to next book			
      getLists(i+1, context, res);
    });
  });
}
