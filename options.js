$(document).ready(function(){
console.log(document.location);
$('#status').hide();
var token="";
var username="";
// store auth code string in URL
var authCode = document.location.search.substr(document.location.search.indexOf('code=')+5);
// var extID= chrome.extension.getURL("options.html");
// $("#login").attr('href',"https://quizlet.com/authorize?response_type=code&client_id=hzueWsxa2r&scope=read&state=abcdef&redirect_uri="+extID);
console.log($('#login').attr('href'));
chrome.storage.sync.get(function(results){
	token=results.access_token;
	username=results.user_id;
	//if no access token found
	if(token==undefined){
		$.ajax({
			url: "https://api.quizlet.com/oauth/token", 
			type: 'POST', 
			data:  {grant_type: "authorization_code", 
					code: authCode,
					redirect_uri: chrome.extension.getURL("options.html")
			},
			headers: {"Authorization": 'Basic aHp1ZVdzeGEycjpudFFrU2ZRM1ZQeG4zd0ZuUGpZSGdk'},
			success: function(result){
				console.log(result);

				chrome.storage.sync.set(result, function(){});
				chrome.storage.sync.get(function(results){
					token=results.access_token;
					username=results.user_id;
					createSetList(token,username);
					$('#login').text('User: '+username);
					$('#login').attr('href','https://quizlet.com/'+username);
				});

			}
		});
	//create set list 
	} else{
		$('#login').text('User: '+username);
		$('#login').attr('href','https://quizlet.com/'+username);
		console.log("token recieved");
		if(token){
			createSetList(token,username);
		}	
	}
});

/*
	Choose the current set(s).
*/
function createSetList(accessToken,username){
	var userSets=[];
	$.ajax({
		type: 'GET',
		url: "https://api.quizlet.com/2.0/users/" + username,
		headers: {
			"Authorization":"Bearer " + accessToken
		},
		success: function(result){
			console.log(result);
			for(var i=0; i<result.sets.length; i++){
				var set = new Object();
				set.title=result.sets[i].title;
				set.id=result.sets[i].id;
				set.url=result.sets[i].url;
				userSets.push(set);
			}
			console.log(userSets);
			for(var i=userSets.length-1; i>=0; i--){
				var option = '<input type="radio" name="sets" id="'+userSets[i].id+'"/>'+
					'<label for="'+userSets[i].id+'">'+userSets[i].title+'</label>';
				$('form').prepend(option+'<br />');
				chrome.storage.sync.get(function(results){

					$('#'+results.current_set.id).prop("checked", true);
				});
			}
		}
	});

}
$("form").on('submit',function(e){
	e.preventDefault();

	var currentSet = new Object();
	currentSet.id=$('form input:checked').attr('id');
	console.log(currentSet.id);
	if(currentSet.id){
		console.log("token received, ready to load terms");
		$.ajax({
			type: 'GET',
			url: "https://api.quizlet.com/2.0/sets/" + currentSet.id,
			headers: {"Authorization":"Bearer " + token},
			success: function(result){
				console.log(result.title);
				var numTerms= result.terms.length;
				var terms = [];
				for(var i=0;i<numTerms;i++){
					var word= new Object();
					word.term=result.terms[i].term;
					word.definition=result.terms[i].definition;
					terms.push(word);
				}
				currentSet.terms=terms;
				currentSet.title=result.title;
				currentSet.url=result.url;
				console.log(currentSet);
				chrome.storage.sync.set({"current_set": currentSet});
				chrome.storage.sync.get(function(results){
					console.log(results);
				});
			}
		});

		$('#status').css('color','#6FBC69');
		$('#status').html('Saved &#10003;').text();
		$('#status').fadeIn(100);
	}//end of if statement
	else {
		$('#status').css('color','#F76A6A');
		$('#status').text('No set selected');
		$('#status').fadeIn(100);
	}
}); //end of on form submit
$("#clear").on('click',function(){
	chrome.storage.sync.clear();
	location.reload();
});

});