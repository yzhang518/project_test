
/******************************************************************************
 ** Members Page Scripts
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
   var request = new XMLHttpRequest();
   
  // Bind Buttons
  document.body.addEventListener('submit', function(event){
    event.preventDefault();
    //Source: https://www.daolf.com/posts/things-to-know-js-events/
    var buttonType = event.target.lastElementChild.value;
    var request = new XMLHttpRequest();
    var data = {};
    
	// Add Member
    if(buttonType == 'Add'){
      data.firstName = document.getElementById('addFirstName').value;;
      data.lastName = document.getElementById('addLastName').value;
      data.phoneNum = document.getElementById('addPhoneNum').value;
      data.memberEmail = document.getElementById('addMemberEmail').value;
      data.memberPWD = document.getElementById('addMemberPWD').value;
      data.Add = true;
    }
	
	// Update Member
	else if(buttonType == 'Update'){
	  data.memberID = event.target.lastElementChild.previousElementSibling.value;
      data.firstName = document.getElementById('firstName' + data.memberID).value;
      data.lastName = document.getElementById('lastName' + data.memberID).value;
      data.phoneNum = document.getElementById('phoneNum' + data.memberID).value;
      data.memberEmail = document.getElementById('memberEmail' + data.memberID).value;
      data.Update = true;
    }
	
    // Send Input Data
    request.open('POST', '/members', true);
    request.setRequestHeader('content-type', 'application/json');
    request.addEventListener('load', function(){
      if(request.status >= 200 && request.status <400){
        console.log('Request Successful');
		// Source: https://techbriefers.com/10-methods-for-how-to-refresh-a-page-in-javascript/
		window.location.reload();
      }
      else{
        console.log('Error: ' + request.status);
      }
    }); 
    request.send(JSON.stringify(data));	
	
  });
	
}
