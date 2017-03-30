$(document).ready(function() {
	$("#correct").hide();
	$("#alert").hide();
// 	$.getJSON("https://api.quizlet.com/2.0/sets/138834540?client_id=hzueWsxa2r&whitespace=1", function(data) {
// 		var numTerms= data.terms.length;
// 		var setName= data.title;
// 		$("#set_url").text(setName);
// 		$("#set_url").attr('href','https://quizlet.com/'+data.url);
// 		var terms = [];
// 		for(var i=0;i<numTerms;i++){
// 			var word= new Object();
// 			word.term=data.terms[i].term;
// 			word.definition=data.terms[i].definition;
// 			terms.push(word);
// 		}

// 		var random = Math.floor(Math.random() * terms.length);
// 		console.log(random);
// 		$("#question").text(terms[random].definition);
// 		$("#correct").text(terms[random].term);
// 	});

	var username = "";
	var accessToken = "";
	var userSets = [];
	var currentSet = new Object();
	chrome.storage.sync.get(function(results){
		console.log(results);
		username = results.user_id;
		accessToken = results.access_token;
		currentSet = results.current_set;

		console.log(currentSet);
		loadSet(currentSet);
	});

function loadSet(setInfo){
	var terms = setInfo.terms;
	var random = Math.floor(Math.random() * terms.length);
	console.log(random);
	$("#question").text(terms[random].definition);
	$("#correct").text(terms[random].term);
	$('#set_name').text(setInfo.title);
	$('#set_name').attr('href',"https://quizlet.com"+setInfo.url);
}
$("form").on('submit', function(event){
	event.preventDefault();
	if (document.getElementById("answer").value === "")
	{            
		$("#alert").show(); 
		$('#alert').fadeTo(100, 0 ).fadeTo(100, 1).fadeTo(100, 0).fadeTo(100, 1); 
		$('#answer').on('focus',function(){
			$('#alert').fadeOut(150);
		})
	}        
	else 
	{
		$('#alert').hide();
		$("#correct").slideDown();
	}
});


})