
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

    if(document.getElementById('addMemberPWD').value===document.getElementById('confirmPWD').value || buttonType == 'Update'){ 	
      // Send Input Data
      request.open('POST', '/members', true);
      request.setRequestHeader('content-type', 'application/json');
      request.addEventListener('load', function(){
	    var response = JSON.parse(request.responseText);
        if(request.status >= 200 && request.status <400 && !response.SQLWarning){
          console.log('Request Successful');
		  // Source: https://techbriefers.com/10-methods-for-how-to-refresh-a-page-in-javascript/
		  window.location.reload();
        }
        else{
	      alert('Error: ' + response.SQLWarning);
          console.log('Error: ' + response.SQLWarning);
        }
        }); 
    request.send(JSON.stringify(data));	
    }
    else{
      alert('The passwords entered do not match.');
	}	
  });
	
}
