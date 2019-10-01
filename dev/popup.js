let translate = [
	{find:' class="msportalfx-svg-c01"', replace:' fill="#ffffff"'},
	{find:' class="msportalfx-svg-c02"', replace:' fill="#e5e5e5"'},
	{find:' class="msportalfx-svg-c03"', replace:' fill="#a0a1a2"'},
	{find:' class="msportalfx-svg-c04"', replace:' fill="#7a7a7a"'},
	{find:' class="msportalfx-svg-c05"', replace:' fill="#3e3e3e"'},
	{find:' class="msportalfx-svg-c06"', replace:' fill="#1e1e1e"'},
	{find:' class="msportalfx-svg-c07"', replace:' fill="#0f0f0f"'},
	{find:' class="msportalfx-svg-c08"', replace:' fill="#ba141a"'},
	{find:' class="msportalfx-svg-c09"', replace:' fill="#dd5900"'},
	{find:' class="msportalfx-svg-c10"', replace:' fill="#ff8c00"'},
	{find:' class="msportalfx-svg-c11"', replace:' fill="#fcd116"'},
	{find:' class="msportalfx-svg-c12"', replace:' fill="#fee087"'},
	{find:' class="msportalfx-svg-c13"', replace:' fill="#b8d432"'},
	{find:' class="msportalfx-svg-c14"', replace:' fill="#7fba00"'},
	{find:' class="msportalfx-svg-c15"', replace:' fill="#59b4d9"'},
	{find:' class="msportalfx-svg-c16"', replace:' fill="#3999c6"'},
	{find:' class="msportalfx-svg-c17"', replace:' fill="#804998"'},
	{find:' class="msportalfx-svg-c18"', replace:' fill="#ec008c"'},
	{find:' class="msportalfx-svg-c19"', replace:' fill="#0072c6"'},
	{find:' class="msportalfx-svg-c20"', replace:' fill="#68217a"'},
	{find:' class="msportalfx-svg-c21"', replace:' fill="#00188f"'},
	{find:' class="msportalfx-svg-c22"', replace:' fill="#e81123"'},
	{find:' class="msportalfx-svg-c23"', replace:' fill="#cae3f3"'},
	{find:' class="msportalfx-svg-c24"', replace:' fill="#59aed3"'},
	{find:' class="msportalfx-svg-c25"', replace:' fill="#4c3b12"'},
	{find:' class="msportalfx-svg-c26"', replace:' fill="#be9555"'},
	{find:' class="msportalfx-svg-c27"', replace:' fill="#4f4d52"'},
	{find:' class="msportalfx-svg-c28"', replace:' fill="#ef6f59"'},
	{find:' class="msportalfx-svg-c29"', replace:' fill="#f7cb64"'},
	{find:' class="msportalfx-svg-c97"', replace:' fill="#ffb900"'},
	{find:' class="msportalfx-svg-c98"', replace:' fill="#00a4ef"'},
	{find:' class="msportalfx-svg-c99"', replace:' fill="#f25022"'}
];

let idSuffix = 1;
let ids = [];

// What to do every time the popup is opened
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('bodyContent').innerHTML = '<i style="grid-column: span 3;">Getting icons...</i>';
	
	// So, this tabs.executeScript takes a code string :-\
	// 'getIcons' is defined below, then use fn.toString and call it in an IIFE
	chrome.tabs.executeScript({
		code: `
			(function () {
				${getIcons.toString()}
				getIcons();
			})();
			`
	});

	// document.getElementById('');
});

function getIcons() {
	let returnElements = [];
	let nameMap = {};
	let query;
	
	function tryToGetIconName(elem) {
		// special case classes
		let name = '';

		// Home > Recent
		if(elem.parentNode.parentNode.parentNode.parentNode.querySelector('.fxs-home-recent-typename')) {
			name = elem.parentNode.parentNode.parentNode.parentNode.querySelector('.fxs-home-recent-typename').innerText;
			// console.log(`Special case name found for Home>Recent is ${name}`);
			return name;
		}
		
		// TOC nav
		if(elem.parentNode.parentNode.parentNode.querySelector('.ext-fxc-menu-listView-item')) {
			name = elem.parentNode.parentNode.parentNode.querySelector('.ext-fxc-menu-listView-item').innerText;
			// console.log(`Special case name found for TOC is ${name}`);
			return name;
		}

		// All services list
		if(elem.parentNode.parentNode.parentNode.querySelector('.fxs-sidebar-label') &&
			elem.parentNode.parentNode.parentNode.querySelector('.fxs-sidebar-label').children[0]) {
			name = elem.parentNode.parentNode.parentNode.querySelector('.fxs-sidebar-label').children[0].innerText;
			// console.log(`Special case name found for All Services is ${name}`);
			return name;
		}
		
		// SVG Title node in grid views
		if(elem.parentNode.getElementsByTagName('title').length) {
			name = elem.parentNode.getElementsByTagName('title')[0].textContent;
			// console.log(`Special case name found for SVG Title is ${name}`);
			return name;
		}

		// generic title attributes
		if(elem && elem.title) return elem.title;
		else if (elem.parentNode.title) return elem.parentNode.title;
		else if (elem.parentNode.parentNode.title) return elem.parentNode.parentNode.title;
		else if (elem.parentNode.parentNode.parentNode.title) return elem.parentNode.parentNode.parentNode.title;
		else if (elem.parentNode.parentNode.parentNode.parentNode.title) return elem.parentNode.parentNode.parentNode.parentNode.title;
		
		return false;
	}

	let symbols = document.getElementById('FxSymbolContainer');
	let symbol;
	let symbolID;
	let nameElement;
	let name;

	if(symbols) {
		for(let e=0; e<symbols.children.length; e++) {
			name = false;
			symbol = symbols.children[e];
			symbolID = symbol.firstChild.firstChild.id;

			if(symbol.getElementsByTagName('path').length) {
				// Look for generic resource icon based on path data
				if(symbol.getElementsByTagName('path')[0].getAttribute('d') === 'M25.561 23.167a.562.562 0 0 1-.288-.083L6.011 12.045a.578.578 0 0 1 0-1.002L25.149.075c.182-.1.405-.1.579 0L44.994 11.12c.174.102.29.291.29.496 0 .212-.116.4-.29.504L25.853 23.084a.573.573 0 0 1-.292.083') {
					nameMap[symbolID] = 'Resource';
				}
			}

			if(!nameMap[symbolID]) {
				// Look for icon name based on DOM tree
				query = '[href="#' + symbolID + '"]';
				nameElement = document.querySelector(query);
				if(nameElement) name = tryToGetIconName(nameElement);
				if(name) nameMap[symbolID] = name;
				// console.log(`Getting name for symbol ${symbolID} returned ${name}`);
			}
			
			returnElements.push(symbol.outerHTML);
		}
	}
	
	let result = {returnElements: returnElements, nameMap: nameMap};
	chrome.runtime.sendMessage(JSON.stringify(result));
}

chrome.runtime.onMessage.addListener(function(message) {
	// console.log(`POPUP Got Message`);
	// console.log(message);
	
	populateIconList(message);
});

function populateIconList(list) {
	let result = JSON.parse(list);
	let elements = result.returnElements;
	let nameMap = result.nameMap;
	// console.log(nameMap);

	ids = [];

	if(elements.length) {
		let iconSVG = '';
		let bodyContent = `
			<div class="headerRow">
				<input type="text" id="searchBox" placeholder="Search across ${elements.length} icons"></input>
				<button id="openInfo"><span>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px"
						height="14px" viewBox="0 0 14 14" style="enable-background:new 0 0 14 14;" xml:space="preserve">
					<path d="M7,0C3.1,0,0,3.1,0,7c0,3.9,3.1,7,7,7s7-3.1,7-7C14,3.1,10.9,0,7,0z M8,12H6V6h2V12z M7,4.5c-0.8,0-1.3-0.6-1.3-1.3
						S6.4,2,7,2c0.6,0,1.3,0.6,1.3,1.3S7.8,4.5,7,4.5z"/>
					</svg>
				</span></button>
			</div>
		`;

		for(let i = elements.length-1; i > -1; i--) {
			iconSVG = elements[i];

			for(let i=0; i<translate.length; i++){
				iconSVG = iconSVG.replace(new RegExp(translate[i].find, 'gi'), (translate[i].find + translate[i].replace));
			}
			
			bodyContent += makeOneIconRow(iconSVG, nameMap);
		}
	
		document.getElementById('bodyContent').innerHTML = bodyContent;
	} else {
		document.getElementById('bodyContent').innerHTML = '<i style="grid-column: span 3;">No icons found</i>';
	}

	document.getElementById('openInfo').onclick = () => document.getElementById('info').style.display = 'block';
	document.getElementById('closeInfo').onclick = () => document.getElementById('info').style.display = 'none';

	for(let j=0; j<ids.length; j++) {
		document.getElementById('button'+ids[j]).onclick = function() { downloadIcon(ids[j]); };
	}
}


function downloadIcon(number) {
	// console.log(number);
	let name = document.getElementById('name'+number).value;
	let icon = document.getElementById('icon'+number).innerHTML;
	downloadFile(name, icon);
}

function isSingleInstance(keyword, searchString) {
	let first = searchString.indexOf(keyword);

	if(first > -1) {
		let second = searchString.indexOf(keyword, (first+1));
		return second === -1? true : false;
	} else {
		return true;
	}
}

function isSVG(searchString) {
	return searchString.indexOf('<svg') === 0;
}

function makeOneIconRow(iconSVG, nameMap) {
	// console.log(`\n makeOneIconRow`);
	// console.log(iconSVG);

	let findID = document.createElement('div');
	findID.innerHTML = iconSVG;
	let elemID = findID.getElementsByTagName('symbol') || 'name';
	if(elemID[0] && elemID[0].id) elemID = elemID[0].id;

	let name = nameMap[elemID];
	if(!name) name = elemID;

	iconSVG = iconSVG.replace('<svg><defs><symbol', '<svg');
	iconSVG = iconSVG.replace('</symbol></defs></svg>', '</svg>');
	
	idSuffix++;
	ids.push(idSuffix);

	let con = `
		<div class="rowWrapper" data-search-name="${name}">
			<div style="grid-column: 1;" class="iconPreview" id="icon${idSuffix}" title="SVG file preview">${iconSVG}</div>
			<div style="grid-column: 2;" class="iconName">
				<input type="text"  id="name${idSuffix}" value="${name}" title="Rename the SVG file"></input>
			</div>
			<button style="grid-column: 3;" class="downloadButton" id="button${idSuffix}" title="Download the SVG file">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
					x="0px" y="0px" width="14px" height="16px" viewBox="0 0 14 16" style="enable-background:new 0 0 14 16;">
					<polygon points="12,7 8.5,10.5 8.5,0 5.5,0 5.5,10.5 2,7 0,9 7,16 14,9 "/>
				</svg>
			</button>
		</div>
	`;

	return con;
}

function downloadFile(name = 'icon', fContent = '') {
	let file = new Blob([fContent], {type: 'svg'});
	name += '.svg';

	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, name);
	else { // Others
		let a = document.createElement("a");
		let url = URL.createObjectURL(file);
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}
