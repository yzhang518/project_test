var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 3956);
app.set('mysql', mysql);

app.use('/borrows', require('./borrows.js'));
app.use('/categories', require('./categories.js'));
app.use('/authors', require('./authors.js'));
app.use('/search', require('./search.js'));
app.use('/login', require('./login.js'));

app.use('/', express.static('public'));

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
          console.log(err);
        }
      });
  }

  else if (req.body['Update']) {
    mysql.pool.query(
      "UPDATE Members SET lastName=?, firstName=?, memberEmail=?, phoneNum=? WHERE memberID = ?",
      [req.body.lastName, req.body.firstName, req.body.memberEmail, req.body.phoneNum, req.body.memberID],
      function (err, result) {
        if (err) {
          console.log(err);
        }
      });
  }
  context.type = 'Members';
  res.send(context);
});


/****************
 ** Books Page **
 ****************/
//DISPLAY DOESN'T ACCOUNT FOR MULTIPLE AUTHORS AND CATEGORIES
app.get('/books', function (req, res, next) {
  var context = {};
  mysql.pool.query(
    "SELECT bookID, title, price, copyrightYear, publisher FROM Books ORDER BY title",
    function (err, result) {
      if (err) {
        console.log(err);
      }

      //Loop through each book and get categories and authors from database

      context.type = 'Books';
      context.books = result;
      res.render('books', context);

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
          console.log(err);
        }
      });
  }

  // Add Category Book Relationship 
  else if (req.body['addCategory']) {
    mysql.pool.query(
      "INSERT INTO cat_book_table (catID, bookID) VALUES ((SELECT catID FROM Categories WHERE catName = ?), (SELECT bookID FROM Books WHERE title = ?))",
      [req.body.category, req.body.title],
      function (err, result) {
        if (err) {
          console.log(err);
        }
      });
  }

  else if (req.body['Add']) {
    // Insert Into Books
    mysql.pool.query(
      "INSERT INTO Books (title, price, copyrightYear, publisher, isAvailable) VALUES (?,?,?,?,1)",
      [req.body.title, req.body.price, req.body.copyrightYear, req.body.publisher],
      function (err, result) {
        if (err) {
          console.log(err);
        }
        else {
          // Add Relationship to cat_book_table  
          mysql.pool.query(
            "INSERT INTO cat_book_table (catID, bookID) VALUES ((SELECT catID FROM Categories WHERE catName = ?), (SELECT bookID FROM Books WHERE title = ?))",
            [req.body.category, req.body.title],
            function (err, result) {
              if (err) {
                console.log(err);
              }
              else {
                // Add Relationship to author_book_table  
                mysql.pool.query(
                  "INSERT INTO author_book_table (authorID, bookID) VALUES ((SELECT authorID FROM Authors WHERE firstName = ? AND lastName = ?), (SELECT bookID FROM Books WHERE title = ?))",
                  [req.body.firstName, req.body.lastName, req.body.title],
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    }
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
      });
  }
  context.type = 'Books';
  res.send(context);
});

//NOT WORKING 
/****************
 ** Errors     **
 ****************/
app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});



/*
//Need soomething to create loop and send at end here    ({
console.log('length'+context.books.length); //DELETE
console.log('bookID'+context.books[i].bookID); //DELETE
  // Get Authors
    //https://stackoverflow.com/questions/21184340/async-for-loop-in-node-js
        if(i == context.books.length){

      return;
      }

    mysql.pool.query("SELECT firstName, lastName FROM author_book_table ab JOIN Authors a on ab.authorID = a.authorID AND ab.bookID = ?",
        [context.books[i].bookID], function(err, result){
            if(err){
          next(err);
          return;
        }
      context.books[i].authors = {};
      context.books[i].authors = result;
console.log('postAuthorIndex'+i); //DELETE
console.log('author row'+context.books[i].authors); //DELETE
      // Get Categories
        mysql.pool.query("SELECT catName FROM cat_book_table cb JOIN Categories c on cb.catID = c.catID AND cb.bookID = ?",
          [context.books[i].bookID], function(err, result){
            if(err){
            next(err);
            return;
          }
        context.books[i].categories = {};
        context.books[i].categories = result;
console.log('postCatIndex'+i); //DELETE
console.log('category row'+context.books[i].categories); //DELETE
      // Render Page After Last Result Stored
            addLists(i+1);
          });
       });
    //DELETE LOOP END });*/