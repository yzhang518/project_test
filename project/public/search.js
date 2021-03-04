var a_member = {
	memberID: 1,
	memberEmail: 'test@gmail.com',
	memberPWD: 'test'
}

document.addEventListener('DOMContentLoaded', bindButtons);
function bindButtons() {
	document.getElementById("searchSubmit").addEventListener('click', function (event) {
		var req = new XMLHttpRequest();

		var payload = {
			searchInput: document.getElementById('searchInput').value,
			searchBy: document.querySelector('input[name="searchBy"]:checked').value
		};

		req.open("POST", "/search/select", true);
		req.setRequestHeader('Content-Type', 'application/json');

		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText);
				buildTable(response.results);
			} else {
				alert("error" + req.statusText);
			}
		});

		req.send(JSON.stringify(payload));
		event.preventDefault();
	});

	if (document.getElementById("borrowSubmit")) {
		document.getElementById("borrowSubmit").addEventListener('click', function (event) {
			var req = new XMLHttpRequest();
			var booksChecked = document.getElementsByClassName("checkBook");
			var id_list = [];
			for (var i = 0; i < booksChecked.length; i++) {
				if (booksChecked[i].checked) {
					console.log(parseInt(booksChecked[i].id));
					id_list.push(parseInt(booksChecked[i].id));
				}
			}

			if (!id_list.length) {
				alert("Please select at least ONE book.")
				return;
			}

			var now = new Date();
			var payload = {
				bookIDs: id_list,
				transactionID: now.getTime(),
				overdue: 0,
				borrowDate: now.toISOString().slice(0, 10),
				returnDate: null,
				dueDate: addDays(now, 30),
				memberID: a_member.memberID
			};

			console.log(payload);

			req.open("POST", "/search/insert-borrow", true);
			req.setRequestHeader('Content-Type', 'application/json');

			req.addEventListener('load', function () {
				if (req.status >= 200 && req.status < 400) {
					var response = JSON.parse(req.responseText);
					alert(response.results[0] + ' book(s) borrowed!');
					window.location.reload();
				} else {
					alert("error" + req.statusText);
				}
			});

			req.send(JSON.stringify(payload));
			event.preventDefault();
		});
	}
}

function buildTable(data) {
	var cell, key, row;
	var keys = ["title", "fullName", "catName", "isAvailable"];
	var tableBody = document.getElementById('tableBody');
	tableBody.innerHTML = null;

	if (data.length == 0) {
		alert("Nothing Found!");
		return;
	}

	data.forEach(addRows);
	function addRows(item) {
		var row = document.createElement("tr");
		for (var i = 0; i < keys.length; i++) {
			cell = document.createElement("td");
			key = keys[i];
			if (i == 3) {
				if (item[key] == 1) {
					cell.innerText = "YES";
				} else {
					cell.innerText = "NO";
				}
			} else { cell.innerText = item[key]; }
			row.appendChild(cell);
		}

		if (item[keys[3]]) {
			cell = document.createElement("td");
			var checkBox = document.createElement("input");
			checkBox.type = "checkBox";
			checkBox.className = "checkBook"
			checkBox.id = item.bookID;
			cell.appendChild(checkBox);
			row.appendChild(cell);
		}
		tableBody.appendChild(row);
	}
}

function addDays(date, days) {
	const copy = new Date(Number(date))
	copy.setDate(date.getDate() + days)
	return copy
}