chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log('POPUP.JS GOT THE MESSAGE');
		let elements = JSON.parse(request.elements);

		// let con = '';

		// if(elements) {
		// 	elements.forEach(element => {
		// 		con += `${element.outerHTML}<h1>`;
		// 	});
		// }

		document.getElementById('content').innerHTML = elements;
	}
);