chrome.runtime.onMessage.addListener(function(message, callback) {
	console.log(`Got Message ${message}`);
	
	if(message === 'getIcons') {
		chrome.runtime.message({
			elements: JSON.stringify(document.getElementsByClassName('fxs-portal-svg'))
		});
	}
});