// document.getElementById('iconList').style.borderWidth = '1px';

function populateIconList(response) {
	console.log('POPUP.JS GOT THE MESSAGE');

	let elements = JSON.parse(response.elements);

	document.getElementById('iconList').innerHTML = elements;
}


function getIcons() {
	// chrome.tabs.sendMessage(
	// 	chrome.tabs.query({active: true}),
	// 	'geticons',
	// 	populateIconList
	// );

	document.getElementById('iconList').innerHTML += 'Another!<br>';
}