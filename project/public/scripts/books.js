/******************************************************************************
 ** Books Page Scripts
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
  // Bind Add Authors
  document.getElementById('addAuthor').addEventListener('click', function(event){
	event.preventDefault();
	var data = {};

	// Get Values
    data.title = document.getElementById('title').value;
    data.firstName = document.getElementById('firstName').value;
    data.lastName = document.getElementById('lastName').value;
	

	  
    // Alert if title or author name fields are empty
    if(data.title=="" || data.firstName=="" || data.lastName==""){
      alert("Title, Author's First Name and Author's Last Name Required");
	}
	else{
	  // Send Data
	  data.addAuthor = true;
	  sendData(data, 0);	
	  
      // Message that it was submitted
      document.getElementById('authorMessage').innerHTML = ""+data.firstName + " " + data.lastName + " submitted.";	 
      // Clear Author Fields
	  document.getElementById('firstName').value = "";
	  document.getElementById('lastName').value = "";	  
	}
	


  });  
  // Bind Add Categories
  document.getElementById('addCategory').addEventListener('click', function(event){
	event.preventDefault();
	var data = {};

	// Get Values
    data.title = document.getElementById('title').value;
    data.category = document.getElementById('category').value;
	

	  
    //Alert if title or category fields are empty
    if(data.title=="" || data.category==""){
      alert("Title and Category Required");
	}
	else{
	  // Send Data
	  data.addCategory = true;
	  sendData(data, 0);	
	  
      // Message that it was submitted
      document.getElementById('categoryMessage').innerHTML = ""+data.category+ " submitted.";

	  // Clear Author Fields
	  document.getElementById('category').value = "";	  
	}
	


  });  
  
  // Bind Submit
  document.body.addEventListener('submit', function(event){
    event.preventDefault();
    //Source: https://www.daolf.com/posts/things-to-know-js-events/
    var buttonType = event.target.lastElementChild.value;
    var data = {};
	
	// Add Book
    if(buttonType == 'Add Book'){
      data.title = document.getElementById('title').value;
      data.firstName = document.getElementById('firstName').value;
      data.lastName = document.getElementById('lastName').value;
      data.price = document.getElementById('price').value;
      data.copyrightYear = document.getElementById('copyrightYear').value;
      data.publisher = document.getElementById('publisher').value;
      data.category = document.getElementById('category').value;
      data.Add = true;
    }
	
	// Delete Book
	else if(buttonType == 'Delete'){
	  data.bookID = event.target.lastElementChild.previousElementSibling.value;
      data.Delete = true;
    }
	
    if(buttonType != 'Additional Author' && buttonType != 'Additional Category'){
      // Send Input Data
	  sendData(data, 1);	
	}
  });
	
}

function sendData(data, reload){
      // Send Input Data
      var request = new XMLHttpRequest();
      request.open('POST', 'http://flip1.engr.oregonstate.edu:3956/books', true);
      request.setRequestHeader('content-type', 'application/json');
      request.addEventListener('load', function(){
        if(request.status >= 200 && request.status <400){
          console.log('Request Successful');
		  if(reload){
			console.log('Reloading');
  		// Source: https://techbriefers.com/10-methods-for-how-to-refresh-a-page-in-javascript/
        	window.location.reload();
          }
        }
        else{
          console.log('Error: ' + request.status);
        }
      }); 
      request.send(JSON.stringify(data));	
}

/*DELETE
      -- goes in add section
	  if(authorIndex > 0){
		for(var i = 1; i<=data.additionalAuthors; i++ ){
		  if(document.getElementById('firstName'+i).value && document.getElementById('lastName'+i).value){
			  
		  }
	    }
		  
	  }
	  ---- goes in additional authors section
 	  data.additionalAuthors++;
      var button = document.getElementById('addAuthor');
	 // Source: https://stackoverflow.com/questions/21422337/append-element-as-sibling-after-element
	  
	  // Add First Name Label
      var element = getLabelElem( "firstName"+data.additionalAuthors, "Author "+(data.additionalAuthors+1)+"'s First Name");
	  event.target.insertBefore(element, button);
	  // Add First Name Field
      element = getInputElem("firstName"+data.additionalAuthors);
      event.target.insertBefore(element, button);
	  
	  // Add Last Name Label
      var element = getLabelElem( "lastName"+data.additionalAuthors, "Author "+(data.additionalAuthors+1)+"'s Last Name");
	  event.target.insertBefore(element, button);	  
	  // Add Last Name Field
	  element = getInputElem("lastName"+data.additionalAuthors);
      event.target.insertBefore(element, button);

// Adds HTML Label Tag and For Attribute
// Parameters: elemName is used for the for attribute value
//             text is innerHTML text

function getLabelElem(elemName, text){
	
  // Create Label
  var element = document.createElement("label");
  
  // Add Attribute
  element.setAttribute("for", elemName)
  
  // Add Inner HTML
  element.innerHTML = text;
  
  return element;

}

// Adds HTML Input Tag and Attributes
// Parameters: elemName is used for name and id attributes
function getInputElem(elemName){
  // Create Input
  var element = document.createElement("input");	  
  element = document.createElement("input");
  var inputAtts = {class:"form-control w-50", type: "text", name: elemName, id: elemName}
//DELETE	  var inputAtts = ["class", "type", "name", "id"]
//DELETE	  var inputAttVals = ["form-control w-50", "text", "firstName"+data.additionalAuthors, "firstName"+data.additionalAuthors]
      // Add Input Attributes
    for (var att in inputAtts){
      element.setAttribute(att, inputAtts[att]);
console.log(att+inputAtts[att]);
	}
  return element;	  
}*/