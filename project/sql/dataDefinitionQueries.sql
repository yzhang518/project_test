-- CREATE tables --
--Create Books
DROP TABLE IF EXISTS Books;
CREATE TABLE Books (
	bookID int(11) NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL UNIQUE,
	price decimal(12, 2) NOT NULL,
	publisher varchar(255) NOT NULL,
	copyrightYear year NOT NULL,
	isAvailable boolean NOT NUll,
	PRIMARY KEY (bookID)
) ENGINE=InnoDB;

--Create Members 
--*Changed memberID to int auto_increment also limited characters for varchar variables
DROP TABLE IF EXISTS Members;
CREATE TABLE Members (
	memberID int(11) NOT NULL AUTO_INCREMENT,
	memberPWD varchar(50) NOT NULL,
	memberEmail varchar(100) NOT NULL UNIQUE,
	firstName varchar(50) NOT NULL,
	lastName varchar(50) NOT NULL,
	phoneNum varchar(50) NOT NULL,
	PRIMARY KEY (memberID)
) ENGINE=InnoDB;

-- Create Authors table
-- Changed Bio to text and varchar limit for firstName, lastName and hometown
-- UNIQUE firstName + lastName, updated
DROP TABLE IF EXISTS Authors;
CREATE TABLE Authors (
    authorID int(11) NOT NULL AUTO_INCREMENT,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    hometown varchar(50) NOT NULL,
    bio text NOT NULL,
    PRIMARY KEY (authorID),
    UNIQUE (firstName, lastName)
) ENGINE=InnoDB;

-- Create Categories table
-- Changed varchar limit for catName
-- UNIQUE catName, updated
DROP TABLE IF EXISTS Categories;
CREATE TABLE Categories (
    catID int(11) NOT NULL AUTO_INCREMENT,
    catName varchar(50) NOT NULL UNIQUE,
    catDescription text NOT NULL,
    PRIMARY KEY (catID)
) ENGINE=InnoDB;

--Create cat_book_table
DROP TABLE IF EXISTS cat_book_table;
CREATE TABLE cat_book_table (
	catID int(11) NOT NULL,
	bookID int(11) NOT NULL,
	PRIMARY KEY (catID, bookID),
	FOREIGN KEY (catID) 
	REFERENCES Categories(catID)
	ON UPDATE CASCADE,
	FOREIGN KEY (bookID) 
	REFERENCES Books(bookID)
	ON DELETE CASCADE
) ENGINE=InnoDB;

--Create author_book_table
DROP TABLE IF EXISTS author_book_table;
CREATE TABLE author_book_table (
	authorID int(11) NOT NULL,
	bookID int(11) NOT NULL,
	PRIMARY KEY (authorID, bookID),
	FOREIGN KEY (authorID)
	REFERENCES Authors(authorID)
	ON UPDATE CASCADE,
	FOREIGN KEY (bookID) 
	REFERENCES Books(bookID)
	ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create Borrows table
DROP TABLE IF EXISTS Borrows;
CREATE TABLE Borrows (
    borrowID int(11) NOT NULL AUTO_INCREMENT,
    bookID int(11),
    memberID int(11) NOT NULL,
    transactionID varchar(50) NOT NULL,
    borrowDate date NOT NULL,
	dueDate date NOT NULL,
    returnDate date,
    PRIMARY KEY (borrowID),
    FOREIGN KEY (bookID)
    REFERENCES Books(bookID),
    FOREIGN KEY (memberID)
    REFERENCES Members(memberID)
) ENGINE=InnoDB;


-- INSERT sample data --

--INSERT sample data into Authors table
INSERT INTO Authors (firstName,lastName,hometown,bio)
VALUES 
    ('Cixin',
    'Liu',
    'Shanxi, China',
    "Liu Cixin is a prominent Chinese science fiction writer. He is a nine-time winner of China's Galaxy Award and has also received the 2015 Hugo Award for his novel The Three-Body Problem as well as the 2017 Locus Award for Death's End. He has also been nominated for the Nebula Award."
    ),
	('Ken',
    'Liu',
    'Gansu, China',
    'Ken Liu is a multiple Hugo Award-winning American author of science fiction and fantasy. His epic fantasy series The Dandelion Dynasty, the first work in the "silkpunk" genre, is published by Simon & Schuster.'
    ),
	('Rachael',
    'Ray',
    'New York, US',
    "Rachael Domenica Ray is an American television personality, businesswoman, celebrity cook and author. She hosts the syndicated daily talk and lifestyle program Rachael Ray, and the Food Network series 30 Minute Meals."
    ),
	('Charlotte',
    'Brontë',
    'Thornton, United Kingdom',
    "Charlotte Brontë was an English novelist and poet, the eldest of the three Brontë sisters who survived into adulthood and whose novels became classics of English literature."
    ),
    ('J.K.',
    'Rowling ',
    'Yate, United Kingdom',
    "Joanne Rowling, better known by her pen name J. K. Rowling, is a British author and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history."
    );

-- INSERT sample data into Categories table
INSERT INTO Categories (catName, catDescription)
VALUES 
	('Classic',
    "Fiction that has become part of an accepted literary canon, widely taught in schools."
    ),
    ('Romance',
    "Genre which place their primary focus on the relationship and romantic love between two people,which usually has an emotionally satisfying and optimistic ending"
    ),    
	('Fantasy',
    "Fiction in an unreal setting that often includes magic, magical creatures, or the supernatural"
    ),
    ('Science Fiction',
    "Story based on the impact of actual, imagined, or potential science, often set in the future or on other planets"
    ),
	('Cookbook',
    "Traditionally penned by professional chefs or celebs, cookbooks offer an appetizing collection of recipes, specific to a theme, cuisine, or experience chosen by the author"
    );

-- INSERT sample data into Books table
INSERT INTO Books (title, price, publisher, copyrightYear, isAvailable)
VALUES
("Harry Potter and the Sorcerer's Stone", 10.99, 'Burbank', 2007, 1),
("Jane Eyre", 10.95, 'Universal', 2011, 1),
("Rachael Ray's Look + Cook", 23.99, 'Clarkson Potter', 2010, 1),
("The Three-Body Problem", 17.99, 'Tor Books', 2015, 1);

-- INSERT sample data into Members table
INSERT INTO Members (memberPWD, memberEmail, firstName, lastName, phoneNum)
VALUES
  ('P@$$word', 'email@email.com', 'Pauli', 'Murray', '555-555-5555'),
  ('P@$$word', 'email2@email.com', 'Bayard', 'Rustin', '123-555-5555'),
  ('P@$$word', 'email3@email.com', 'Lorraine', 'Hansberry', '555-456-5555'),
  ('test', 'test@gmail.com', 'James', 'Baldwin', '123-456-7890');
  
-- INSERT sample data into Borrows table
INSERT INTO Borrows (bookID, memberID, transactionID, borrowDate, dueDate, returnDate)
VALUES(
    1,
    (SELECT memberID FROM Members WHERE memberEmail='test@gmail.com'),
    CONCAT(CURDATE(),'-',1),
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 21 DAY),
	NULL
),
(
    2,
    2,
    CONCAT(CURDATE(),'-',1),
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 21 DAY),
	NULL
),
(
    3,
    3,
    CONCAT(CURDATE(),'-',1),
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 21 DAY),
	NULL
);


-- INSERT sample data into cat_book table
INSERT INTO cat_book_table (catID, bookID)
VALUES
    ((SELECT catID FROM Categories WHERE catName='Classic'),
	 (SELECT bookID FROM Books WHERE title="Jane Eyre")
	),
    ((SELECT catID FROM Categories WHERE catName='Romance'),
	 (SELECT bookID FROM Books WHERE title="Jane Eyre")
	),
	((SELECT catID FROM Categories WHERE catName='Science Fiction'),
	 (SELECT bookID FROM Books WHERE title="The Three-Body Problem")
	),
	((SELECT catID FROM Categories WHERE catName='Cookbook'),
	 (SELECT bookID FROM Books WHERE title="Rachael Ray's Look + Cook")
	),
    ((SELECT catID FROM Categories WHERE catName='Fantasy'),
	 (SELECT bookID FROM Books WHERE title="Harry Potter and the Sorcerer's Stone")
	);

-- INSERT sample data into author_book table
INSERT INTO author_book_table (authorID, bookID)
VALUES
   ((SELECT authorID FROM Authors WHERE firstName='Rachael' AND lastName='Ray'),
	(SELECT bookID FROM Books WHERE title="Rachael Ray's Look + Cook")
   ),
   ((SELECT authorID FROM Authors WHERE firstName='Cixin' AND lastName='Liu'),
	(SELECT bookID FROM Books WHERE title="The Three-Body Problem")
   ),
   ((SELECT authorID FROM Authors WHERE firstName='Ken' AND lastName='Liu'),
	(SELECT bookID FROM Books WHERE title="The Three-Body Problem")
   ),
   ((SELECT authorID FROM Authors WHERE firstName='Charlotte' AND lastName='Brontë'),
	(SELECT bookID FROM Books WHERE title="Jane Eyre")
   ),
   ((SELECT authorID FROM Authors WHERE firstName='J.K.' AND lastName='Rowling'),
	(SELECT bookID FROM Books WHERE title="Harry Potter and the Sorcerer's Stone")
   );

