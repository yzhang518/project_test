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
      data.catName = document.getElementById('addCatName').value;;
      data.catDescription = document.getElementById('addCatDescription').value;
      data.Add = true;
    }

    // Update category
    else if (buttonType == 'Update') {
      data.catID = event.target.lastElementChild.previousElementSibling.value;
      data.catName = document.getElementById('catName' + data.catID).value;
      data.catDescription = document.getElementById('catDescription' + data.catID).value;
      data.Update = true;
    }

    console.log(data);

    // Send Data
    request.open('POST', '/categories', true);
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
