
/******************************************************************************
 ** Author Page Scripts
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
	var request = new XMLHttpRequest();

	// Bind Buttons
	document.body.addEventListener('submit', function (event) {
		event.preventDefault();
		//Source: https://www.daolf.com/posts/things-to-know-js-events/
		var buttonType = event.target.lastElementChild.value;
		var request = new XMLHttpRequest();
		var data = {};

		// Add category
		if (buttonType == 'Add') {
			data.firstName = document.getElementById('addFirstName').value.replace(/(^\s*)|(\s*$)/g, "");
			data.lastName = document.getElementById('addLastName').value.replace(/(^\s*)|(\s*$)/g, "");
			data.hometown = document.getElementById('addHometown').value;
			data.bio = document.getElementById('addBio').value;
			data.Add = true;
		}

		// Update category
		else if (buttonType == 'Update') {
			data.authorID = event.target.lastElementChild.previousElementSibling.value;
			data.firstName = document.getElementById('firstName' + data.authorID).value.replace(/(^\s*)|(\s*$)/g, "");
			data.lastName = document.getElementById('lastName' + data.authorID).value.replace(/(^\s*)|(\s*$)/g, "");
			data.bio = document.getElementById('bio' + data.authorID).value;
			data.hometown = document.getElementById('hometown' + data.authorID).value;
			data.Update = true;
		}

		console.log(data);

		// Send Data
		request.open('POST', '/authors', true);
		request.setRequestHeader('content-type', 'application/json');
		request.addEventListener('load', function () {
			var response = JSON.parse(request.responseText);
			if (request.status >= 200 && request.status < 400 && !response.SQLWarning) {
				console.log('Request Successful');
				// Source: https://techbriefers.com/10-methods-for-how-to-refresh-a-page-in-javascript/
				window.location.reload();
			}
			else {
				alert('Error: ' + response.SQLWarning);
				console.log('Error: ' + response.SQLWarning);
			}
		});

		request.send(JSON.stringify(data));

	});

}
