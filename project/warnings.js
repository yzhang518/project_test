const author_book = {
	1452: 'No such author exists.  Please verify author first and last name on author page and try again.',
	1062: 'The author you entered is already listed for that title.',
	1048: 'No such book title or author exists. Please verify book title and author name on the books and authors pages and try again.'
};

const category_book = {
	1452: 'No such category exists.  Please verify category name on category page and try again.',
	1062: 'The category you entered is already listed for that title.',
	1048: 'No such book title or category exists. Please verify book title and category name on the books and categories pages and try again.'
};

const book = {
	1062: 'The book title you entered already exists.',
	1048: 'No such author or category exists. Please verify author name and category name on the authors and categories pages and try again.'
};

const category = {
	1062: 'The category name you entered already exists.',
};

const author = {
	1062: 'The author first and last name combination you entered already exists.',
};

module.exports.author_book = author_book;
module.exports.category_book = category_book;
module.exports.book = book;
module.exports.category = category;
module.exports.author = author;