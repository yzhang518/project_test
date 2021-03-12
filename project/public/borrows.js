document.getElementById('memberEmail').value = null;

document.addEventListener('DOMContentLoaded', bindButtons);
function bindButtons() {
	document.getElementById("emailSubmit").addEventListener('click', function (event) {
		var req = new XMLHttpRequest();

		var payload = {
			memberEmail: document.getElementById('memberEmail').value
		};
		console.log(payload.memberEmail);
		if (payload.memberEmail.length == 0) {
			alert("Email cannot be empty!");
			return;
		}

		var query = '?memberEmail=' + payload.memberEmail;
		req.open('GET', '/borrows/return-data' + query, true);

		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText);
				console.log(response.results);
				if (response.results[0] == 0) {
					alert('Incorrect email address!');
					return;
				} else {
					buildPage(response.results);
				}

			}
		});
		req.send();
		event.preventDefault();
	});
}

function buildPage(data) {
	if (data[0] == 1) {
		clearTopSec(data[1], "No borrowed items!");
		return;
	}

	clearTopSec(data, "Items Out:");

	var div, headers, myTable, header, cell, keys, key, btnKeys, eventBtns;
	div = document.getElementById("borrowTable");
	headers = ["transaction ID", "Book Title", "Borrow Date", "Due Date", "Return Date", "Over Due"];
	keys = ["transactionID", "title", "borrowDate", "dueDate", "returnDate"];
	btnKeys = "return";

	myTable = document.createElement("table");
	headRow = document.createElement("tr");

	// display header row
	for (var i = 0; i < headers.length; i++) {
		cell = document.createElement("th");
		cell.innerHTML = headers[i];
		headRow.appendChild(cell);
	}
	myTable.appendChild(headRow);

	// add data rows to the table 
	data.forEach(addRows);

	function addRows(item) {
		var row = document.createElement("tr");
		// add data info
		for (var i = 0; i < headers.length; i++) {
			cell = document.createElement("td");
			key = keys[i];

			// modify date format
			if (i == 2 || i == 3 || i == 4) {
				if (item[key] != null) {
					cell.innerText = item[key].slice(0, 10);
				}
			} else if (i == 5) { // display overdue or not
				var now = new Date().toISOString().slice(0, 10);
				console.log(item.returnDate, item.dueDate, now < item.dueDate);
				if (!item.returnDate && now > item.dueDate) {
					cell.innerText = "Yes";
				} else {
					cell.innerText = "No";
				}
			} else {
				cell.innerText = item[key];
			}

			row.appendChild(cell);
		}

		// add return button
		cell = document.createElement("td");
		if (item.returnDate) {
			cell.innerHTML = "RETURNED";
		} else {
			var a_form = document.createElement("form");
			var input = document.createElement("input");
			var btn = document.createElement("input");

			input.type = "hidden"
			input.value = item.borrowID;

			btn.type = "button";
			btn.value = btnKeys.toUpperCase();
			btn.id = btnKeys + String(item.borrowID);

			// add return event listeners
			attach_return(item.borrowID, item.bookID, btn);

			a_form.appendChild(btn);
			a_form.appendChild(input);
			cell.appendChild(a_form);
		}
		row.appendChild(cell);

		myTable.appendChild(row);
	}
	div.appendChild(myTable);
}


function clearTopSec(data, s) {
	// clear login form and display member name
	var topDiv = document.getElementById("topSec");
	var emailInput = document.getElementById("inputEmail");
	topDiv.removeChild(emailInput);

	var memberName = document.createElement("p");
	memberName.id = "memberName";
	memberName.innerText = data[0].lastName + ', ' + data[0].firstName;
	topDiv.appendChild(memberName);

	document.getElementById("borrowTableTitle").innerText = s;
}


function attach_return(borrowID, bookID, btn) {
	btn.onclick = function () {
		// update return Date, overdue in Borrows, update availability in Books
		returnBook(borrowID, bookID);

		// modify contents of 'Return Date' and 'Over Due' columns in display Borrows Table
		var cell = btn.parentElement.parentElement;
		var overdueCol = cell.previousSibling;
		overdueCol.innerText = "No";
		var returnDateCol = overdueCol.previousSibling;
		returnDateCol.innerText = new Date().toISOString().slice(0, 10);

		// clear return btn
		//cell.removeChild(cell.firstChild);
		cell.innerHTML = "RETURNED";
	}
}


function returnBook(borrowID, bookID) {
	//console.log("i`m here edit ", borrowID, bookID);
	var req = new XMLHttpRequest();
	var payload = {
		isAvailable: 1,
		returnDate: new Date().toISOString().slice(0, 10)
	};

	payload.borrowID = borrowID;
	payload.bookID = bookID;

	var query = createQuery(payload);

	req.open("POST", "/borrows/update" + query, true);
	//req.setRequestHeader('Content-Type', 'application/json');

	req.addEventListener('load', function () {
		if (req.status >= 200 && req.status < 400) {
			//var reponse = JSON.parse(req.responseText)
			console.log("I`m here, bookreturned");
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});

	req.send();
	event.preventDefault();
}

function createQuery(payload) {
	var keys = ['isAvailable', 'returnDate', 'borrowID', 'bookID']
	var a_query = "?";
	keys.forEach(function (key) {
		var ele = payload[key];
		if (ele != null) {
			a_query += key + "=" + ele + "&";
		}
	});
	return a_query;
};
