chrome.runtime.onInstalled.addListener(function() {
	// Replace all rules ...
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		// With a new rule ...
		chrome.declarativeContent.onPageChanged.addRules([
			{
				// That fires when a page's URL contains:
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: 'portal.azure.com' },
					})
				],
				// And shows the extension's page action.
				actions: [ new chrome.declarativeContent.ShowPageAction() ]
			}
		]);
	});
});


window.AzureIconDownloader = {};

AzureIconDownloader.tryToGetIconName = function(iconID) {
	let element = document.querySelectorAll('[href = "#FxSymbol0-00f"]')[0];
	let name = '';

	if(element) {
		name = element.parentNode.parentNode.parentNode.children[1].innerText;
	}

	return name;
};
