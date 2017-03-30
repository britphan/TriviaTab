$(document).ready(function(){
	$('#options').attr('href',chrome.extension.getURL("options.html"))
	chrome.storage.sync.get(function(results){
		$('#current_set').append(results.current_set.title);
		$('#user').append(results.user_id);
	});
});