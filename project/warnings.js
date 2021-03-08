const author_book = {
	1062: 'The author you entered is already listed for that title.',
	1048: 'No such book title or author exists. Please verify book title and author name on the books and authors pages and try again.'
};

const category_book = {
	1062: 'The category you entered is already listed for that title.',
	1048: 'No such book title or category exists. Please verify book title and category name on the books and categories pages and try again.'
};

const book = {
	1062: 'The book title you entered already exists.',
	1048: 'No such author or category exists. Please verify author name and category name on the authors and categories pages and try again.'
};

const err1048 = {
	author_book: 'No such book title or author exists. Please verify book title and author name on the books and authors pages and try again.',
	category_book: 'No such book title or category exists. Please verify book title and category name on the books and categories pages and try again.',
    book: 'No such author or category exists. Please verify author name and category name on the authors and categories pages and try again.'
};

function message(errno, type){
	if(errno === 1062){
		warning = 'The '+type+' you entered already exists.';
	}
	else if(errno===1048){
		warning = err1048[type];
	}
	return warning;
	
};

module.exports.author_book = author_book;
module.exports.category_book = category_book;
module.exports.book = book;
module.exports.message = message;