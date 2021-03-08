--Members Page: Insert into Members table
INSERT INTO Members (firstName, lastName, phoneNum, memberEmail, memberPWD)
VALUES(
	:firstNameInput,
	:lastNameInput,
	:phoneNumInput,
	:memberEmailInput,
	:memberPWDInput
);

--Members Page: Select from Members table
SELECT lastName, firstName, memberEmail, phoneNum FROM Members ORDER BY lastName;

--Members Page: Update Members table
UPDATE Members 
SET lastName=:lastNameInput, firstName=:firstNameInput, memberEmail=:memberEmailInput, phoneNum=:phoneNumInput
WHERE memberID=:memberIDValue;

--Borrows Page Member Name 
SELECT firstName, lastName FROM Members WHERE memberEmail= :memberEmail;

--Log In Page: Select from Members table
SELECT memberPWD FROM Members WHERE memberID=:memberIDInput;

--Books Page: Insert into cat_book_table
INSERT INTO cat_book_table (catID, bookID)
VALUES (
	(SELECT catID FROM Categories WHERE catName = :catNameInput),
	(SELECT bookID FROM Books WHERE title = :titleInput)
);
--Books Page: Insert into author_book_table
INSERT INTO author_book_table (authorID, bookID)
VALUES (
	(SELECT authorID FROM Authors WHERE lastName = :lastNmeInput AND firstName = :firstNameInput),
	(SELECT bookID FROM Books WHERE title = :titleInput)
);

--Books Page: Insert into Books table
INSERT INTO Books (title, price, copyrightYear, publisher, isAvailable)
VALUES(
	:titleInput,
	:priceInput,
	:copyrightYearInput,
	:publisherInput,
	1
);

--**THIS DOESN'T ACCOUNT FOR MULTIPLE AUTHORS OR CATEGORIES Books Page: Select from Books, Authors, Categories Joins
SELECT b.bookID, b.title, a.firstName, a.lastName, b.price, b.copyrightYear, b.publisher, c.catName 
FROM Books b INNER JOIN cat_book_table cb ON cb.bookID=b.bookID 
INNER JOIN Categories c ON c.catID=cb.catID
INNER JOIN author_book_table ab ON ab.bookID=b.bookID
INNER JOIN Authors a ON a.authorID = ab.authorID
ORDER BY b.title;

--Select from Books, Authors, Categories
SELECT bookID, title, price, copyrightYear, publisher FROM Books ORDER BY title;
SELECT firstName, lastName FROM author_book_table ab JOIN Authors a on ab.authorID = a.authorID AND ab.bookID = :bookIDVar;
SELECT catName FROM cat_book_table cb JOIN Categories c on cb.catID = c.catID AND cb.bookID = :bookIDVar;


--Books Page: Delete from Books table 
--(Delete from cat_book_table is covered by delete on cascade when a book is deleted)
DELETE FROM Books WHERE bookID=:bookIDValue;

--Borrows Page: Update Book isAvailable
UPDATE Books SET isAvailable=1 WHERE bookID=:bookIDValue;

--Search Page: Update Book isAvailable
UPDATE Books SET isAvailable=0 WHERE bookID=:bookIDValue;
 
--Search Page: Select from Books, Authors, Categories by Book Title
SELECT b.title, a.firstName, a.lastName, c.catName, b.isAvailable 
FROM (SELECT bookID, title, isAvailable FROM Books WHERE title=:titleInput) AS b 
INNER JOIN cat_book_table cb ON cb.bookID=b.bookID 
INNER JOIN Categories c ON c.catID=cb.catID
INNER JOIN author_book_table ab ON ab.bookID=b.bookID
INNER JOIN Authors a ON a.authorID = ab.authorID;

--Search Page: Select from Books, Authors, Categories by Category Name
SELECT b.title, a.firstName, a.lastName, c.catName, b.isAvailable 
FROM (SELECT catID, catName FROM Categories WHERE catName=:catNameInput) AS c
INNER JOIN cat_book_table cb ON cb.catID=c.catID
INNER JOIN Books b ON b.bookID=cb.bookID 
INNER JOIN author_book_table ab ON ab.bookID=b.bookID
INNER JOIN Authors a ON a.authorID = ab.authorID
ORDER BY a.lastName;


-- Borrows table Manipulations --
-- INSERT into Borrows 
-- Borrow books on Search page. 
-- Need to update the availability to False in Books table
-- QUERY UPDATED
INSERT INTO Borrows (bookID, memberID, transactionID, borrowDate, returnDate)
VALUES(
    :bookID_input,
    :memberID_input,
    :transactionID_input,
    :borrowDate_input,
    :returnDate_input,
    NULL
);

-- SELECT from Borrows 
-- Display all the books borrowed by a specific member on View Borrows and Return Books page
-- QUERY UPDATED
SELECT borrowID, Books.bookID, firstName, lastName, transactionID, title, borrowDate, dueDate, returnDate FROM Members 
INNER JOIN Borrows ON Members.memberID = Borrows.memberID 
INNER JOIN Books ON Borrows.bookID = Books.bookID 
WHERE memberEmail = :memberEmail_input
ORDER BY borrowDate

SELECT * FROM Members WHERE memberEmail = :memberEmail;

-- UPDATE Borrows UPDATED
-- Return A Book On View Borrows and Return Books page
-- Need to update the availability to True in Books table
-- QUERY UPDATED
UPDATE Borrows 
SET returnDate = :returnDate_input
WHERE borrowID = :borrowID_input;


-- Authors table Manipulations --
-- INSERT into Authors
INSERT INTO Authors (firstName,lastName,hometown,bio)
VALUES (
    :firstName_input,
    :lastName_input,
    :hometown_input,
    :bio_input
);

-- SELECT from Authors 
-- Display all the authors on Authors page
SELECT * FROM Authors ORDER BY lastName

SELECT firstName, lastName, hometown, bio FROM Authors
ORDER BY lastName, firstName;

-- UPDATE Authors 
UPDATE Authors 
SET firstName = :firstName_input,
    lastName = :lastName_input,
    hometown = :hometown_input,
    bio = :bio_input
WHERE authorID = :authorID_input;

-- Categories table Manipulations --
-- INSERT into Categories
INSERT INTO Categories (catName,catDescription)
VALUES (
    :catName_input,
    :catDescription_input
);

-- SELECT from Categories 
-- Display all the Categories on Categories page
SELECT catName, catDescription FROM Categories
ORDER BY catName;

-- UPDATE Categories 
UPDATE Categories 
SET catName = :catName_input,
    catDescription = :catDescription_input
WHERE catID = :catID_input;


-- Search by Author name and display result on Search page
-- M:M relationship between Authors and Books
-- QUERY UPDATED
SELECT Books.bookID, title, CONCAT(firstName,' ',lastName) AS fullName, catName, isAvailable 
FROM Books 
INNER JOIN author_book_table ON Books.bookID = author_book_table.bookID 
INNER JOIN Authors ON author_book_table.authorID = Authors.authorID 
INNER JOIN cat_book_table ON Books.bookID = cat_book_table.bookID 
INNER JOIN Categories ON cat_book_table.catID = Categories.catID 
WHERE CONCAT(firstName, ' ', lastName) LIKE authorName_input
ORDER BY Books.bookID

