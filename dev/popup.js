// -----------------------------------------
// Gathering data to populate the icon list
// -----------------------------------------

// Overall storage for icon ID, Name, and SVG
let _iconData = [];

// What to do every time the popup is opened
document.addEventListener('DOMContentLoaded', async () => {
	document.getElementById('bodyContent').innerHTML = '<i style="grid-column: span 3;">Getting icons...</i>';
	
	const tab = await getCurrentTab();
	// console.log(tab);

	let results = await chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: getIcons,
	});

	processIcons(results[0].result);
	populateIconList(_iconData);
});

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function getIcons() {
	let symbols = document.getElementById('FxSymbolContainer');
	let defs = document.getElementById('DefsContainer');
	defs = defs.getElementsByTagName('defs')[0];
	
	// Make the Icon list, and find names
	let returnElements = [];
	let nameMap = {};

	if(symbols) {
		let nameElement;
		let symbol;
		let symbolID;
		let name;
		let query;

		for(let e=0; e<symbols.children.length; e++) {
			/*
			 *	ADD THE ICON TO THE LIST
			*/
			symbol = symbols.children[e];
			returnElements.push(symbol.outerHTML);
			
			/*
			*	GET THE NAME OF THE ICON
			*/
			name = false;
			symbolID = symbol.firstChild.firstChild.id;
			
			// Look for common icons that are known to not have title attributes
			if(symbol.getElementsByTagName('path').length) {
				let pathData = symbol.getElementsByTagName('path')[0].getAttribute('d');
				if(pathData === 'M25.561 23.167a.562.562 0 0 1-.288-.083L6.011 12.045a.578.578 0 0 1 0-1.002L25.149.075c.182-.1.405-.1.579 0L44.994 11.12c.174.102.29.291.29.496 0 .212-.116.4-.29.504L25.853 23.084a.573.573 0 0 1-.292.083') {
					nameMap[symbolID] = 'Resource';
				} else if (pathData === 'M8.2 6l-5.5 5.5.6.5 6-6-6-6-.6.5z') {
					nameMap[symbolID] = 'Chevron';
				} else if (pathData === 'M-790.5 996c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm.7 7.5h-1.5v-3.6h1.5v3.6zm-.7-4.4c-.5 0-.8-.4-.8-.8s.4-.8.8-.8.8.4.8.8-.3.8-.8.8z') {
					nameMap[symbolID] = 'Info';
				} else if (pathData === 'M4.992 9.819l8.018-7.991v4.005H14V0H8.167v1h4.038L4.232 8.987l.76.833z') {
					nameMap[symbolID] = 'Link';
				} else if (pathData === 'M8.7 7.9l7.1 7.1-.8.8-7.1-7.1-7.1 7.1L0 15l7.1-7.1L0 .8.8 0l7.1 7.1L15 0l.8.8z') {
					nameMap[symbolID] = 'Close';
				} else if (pathData === 'M0 3h18v1H0zm0 5h18v1H0zm0 5h18v1H0z') {
					nameMap[symbolID] = 'Hamburger';
				} else if (pathData === 'M22.83 4.372a20.662 20.662 0 0 0-13.953 7.579 20.672 20.672 0 0 0-4.508 15.227 20.668 20.668 0 0 0 7.581 13.949c4.134 3.346 9.52 5.109 15.222 4.509 5.705-.601 10.606-3.451 13.955-7.581 3.34-4.132 5.106-9.519 4.505-15.225-.608-5.751-3.528-10.669-7.724-14.064-3.531-2.859-8.032-4.51-12.856-4.51-.733 0-1.474.038-2.222.116') {
					nameMap[symbolID] = 'Recent';
				} else if (pathData === 'M12.354 5.353l.896-.897.29.29-.897.896zm1.576 3.524h1.268v.409H13.93zm-1.634 3.876l.289-.29.896.897-.289.29zM8.71 14.077h.409v1.268H8.71zM4.249 4.704l.289-.29.897.897-.29.29zm.061 8.693l.896-.897.29.29-.897.896zm-1.757-4.52h1.268v.409H2.553zm9.419 2.483L9.821 9.209a.518.518 0 0 0-.351-.148.507.507 0 0 0 .065-.238V3.348a.522.522 0 0 0-.52-.521h-.1a.522.522 0 0 0-.521.521v5.475a.522.522 0 0 0 .521.521h.058a.514.514 0 0 0 .042.67l2.151 2.151a.521.521 0 0 0 .735 0l.07-.07a.521.521 0 0 0 .001-.735z') {
					nameMap[symbolID] = 'Recent';
				} else if (pathData === 'M14.9 10.4l.4.4.4.5a1.4 1.4 0 0 1 .2.6 1.3 1.3 0 0 1 .1.6 3.6 3.6 0 0 1-.2 1 3.5 3.5 0 0 1-.5.8l-.8.5-1 .2a2 2 0 0 1-1.3-.4 5.4 5.4 0 0 1-2 1A5.4 5.4 0 0 1 8 16a5.7 5.7 0 0 1-2.2-.4 5.4 5.4 0 0 1-2-1 2 2 0 0 1-1.3.4l-1-.2-.8-.5a3.5 3.5 0 0 1-.5-.8 3.6 3.6 0 0 1-.2-1 1.3 1.3 0 0 1 .1-.6 1.4 1.4 0 0 1 .2-.6l.4-.5c.1-.2.3-.3.4-.4a1.7 1.7 0 0 0-.1-.7V9a7.6 7.6 0 0 1 .3-2.1A6.6 6.6 0 0 1 2.2 5l1.5-1.5a5.2 5.2 0 0 1 1.8-1 3 3 0 0 1 .2-1 2.2 2.2 0 0 1 .5-.8L7 .2 8 0l1 .2.8.5a2.2 2.2 0 0 1 .5.8 3 3 0 0 1 .2 1 5.2 5.2 0 0 1 1.8 1L13.8 5a6.6 6.6 0 0 1 .9 1.9A7.6 7.6 0 0 1 15 9v.7a1.7 1.7 0 0 0-.1.7zM1 12.5a1.3 1.3 0 0 0 .1.6l.3.5.5.3h1.2l.5-.3.3-.5a1.3 1.3 0 0 0 .1-.6 1.3 1.3 0 0 0-.1-.6l-.3-.5-.5-.3H1.9l-.5.3-.3.5a1.3 1.3 0 0 0-.1.6zM8 15a5.7 5.7 0 0 0 1.8-.3 4.8 4.8 0 0 0 1.6-.8l-.3-.7a1.5 1.5 0 0 1-.1-.7 3.6 3.6 0 0 1 .2-1 3.5 3.5 0 0 1 .5-.8l.8-.5 1-.2h.4a3.4 3.4 0 0 0 .1-1 5.7 5.7 0 0 0-.3-1.8 4.1 4.1 0 0 0-.7-1.5 4.9 4.9 0 0 0-1.2-1.3 3.8 3.8 0 0 0-1.5-.9l-.4.6c-.1.2-.3.3-.5.5l-.7.3H7.3l-.7-.3-.5-.5-.4-.6a3.8 3.8 0 0 0-1.5.9A4.9 4.9 0 0 0 3 5.7a5.1 5.1 0 0 0-.7 1.5A5.7 5.7 0 0 0 2 9a3.4 3.4 0 0 0 .1 1h1.1l.9.5a2.7 2.7 0 0 1 .7.8 4.3 4.3 0 0 1 .2 1.2 1.5 1.5 0 0 1-.1.7l-.3.7a4.8 4.8 0 0 0 1.6.8A5.7 5.7 0 0 0 8 15zM8 1h-.6l-.5.3-.3.5a1.3 1.3 0 0 0-.1.6 1.3 1.3 0 0 0 .1.6l.3.5.5.3h1.2l.5-.3.3-.5a1.3 1.3 0 0 0 .1-.6 1.3 1.3 0 0 0-.1-.6l-.3-.5-.5-.3zm5.5 13h.6l.5-.3.3-.5a1.3 1.3 0 0 0 .1-.6 1.3 1.3 0 0 0-.1-.6l-.3-.5-.5-.3h-1.2l-.5.3-.3.5a1.3 1.3 0 0 0-.1.6 1.3 1.3 0 0 0 .1.6l.3.5.5.3z') {
					nameMap[symbolID] = 'Share';
				} else if (pathData === 'M3.578 0a1.766 1.766 0 0 0-.744.166A2.153 2.153 0 0 0 2.217.6a2.13 2.13 0 0 0-.433.621 1.762 1.762 0 0 0-.165.739V4H0v1.418h1.619v6.589H0v1.415h1.619v2.044a1.893 1.893 0 0 0 .154.762 1.969 1.969 0 0 0 .42.623 1.944 1.944 0 0 0 .625.421 1.91 1.91 0 0 0 .75.152h7.459v-1.415H6.485V1.416h9.13v6h1.415V0zm1.5 16.009H3.7a.645.645 0 0 1-.26-.051.686.686 0 0 1-.212-.144.711.711 0 0 1-.145-.214 1.861 1.861 0 0 1-.047-.387v-1.791h.7v-1.415h-.7V5.418h.7V4h-.7V2.084a.493.493 0 0 1 .054-.22.88.88 0 0 1 .39-.391.5.5 0 0 1 .22-.057h1.382z') {
					nameMap[symbolID] = 'Directory + Subscription';
				} else if (pathData === 'M8.267 8H.733c-.6 0-.916-.623-.62-1.129L2.014 3.53 3.896.384c.302-.507.903-.514 1.197-.008L7.001 3.65l1.882 3.229C9.183 7.383 8.881 8 8.267 8z') {
					nameMap[symbolID] = 'Warning';
				} else if (pathData === 'M11 3.9l-.7-.8L6 7.4 1.7 3.1l-.7.8 5 5z') {
					nameMap[symbolID] = 'Chevron down';
				} else if (pathData === 'M7 0h1v16H7z') {
					nameMap[symbolID] = 'Pipe';
				} else if (pathData === 'M1 8.1l.7.8L6 4.6l4.3 4.3.7-.8-5-5z') {
					nameMap[symbolID] = 'Chevron up';
				} else if (pathData === 'M4 3.7l-4 4 .7.7L4 5l3.3 3.4.7-.7-4-4z') {
					nameMap[symbolID] = 'Double chevron up';
				}
			}

			// Look for icon name based on DOM tree
			if(!nameMap[symbolID]) {
				query = '[href="#' + symbolID + '"]';
				nameElement = document.querySelector(query);
				if(nameElement) {
					// Home > Recent
					if(nameElement.parentNode.parentNode.parentNode.parentNode.querySelector('.fxs-home-recent-typename')) {
						name = nameElement.parentNode.parentNode.parentNode.parentNode.querySelector('.fxs-home-recent-typename').innerText;
						// console.log(`Special case name found for Home>Recent is ${name}`);
					}
					
					// TOC nav
					if(nameElement.parentNode.parentNode.parentNode.querySelector('.ext-fxc-menu-listView-item')) {
						name = nameElement.parentNode.parentNode.parentNode.querySelector('.ext-fxc-menu-listView-item').innerText;
						// console.log(`Special case name found for TOC is ${name}`);
					}
				
					// All services list
					if(nameElement.parentNode.parentNode.parentNode.querySelector('.fxs-sidebar-label') &&
						nameElement.parentNode.parentNode.parentNode.querySelector('.fxs-sidebar-label').children[0]) {
						name = nameElement.parentNode.parentNode.parentNode.querySelector('.fxs-sidebar-label').children[0].innerText;
						// console.log(`Special case name found for All Services is ${name}`);
					}
					
					// SVG Title node in grid views
					if(nameElement.parentNode.getElementsByTagName('title').length) {
						name = nameElement.parentNode.getElementsByTagName('title')[0].textContent;
						// console.log(`Special case name found for SVG Title is ${name}`);
					}
				
					// generic title attributes
					if(nameElement && nameElement.title) name = nameElement.title;
					else if (nameElement.parentNode.title) name = nameElement.parentNode.title;
					else if (nameElement.parentNode.parentNode.title) name = nameElement.parentNode.parentNode.title;
					else if (nameElement.parentNode.parentNode.parentNode.title) name = nameElement.parentNode.parentNode.parentNode.title;
					else if (nameElement.parentNode.parentNode.parentNode.parentNode.title) name = nameElement.parentNode.parentNode.parentNode.parentNode.title;
				}

				if(name) nameMap[symbolID] = name;
				// console.log(`Getting name for symbol ${symbolID} returned ${name}`);
			}
		}
	}
	
	// Pull out all the gradient definitions
	let returnDefs = {};

	if(defs) {
		let def;
		let defID;

		for(let d=0; d<defs.children.length; d++) {
			def = defs.children[d];
			defID = def.getAttribute('id');
			returnDefs[defID] = (def.outerHTML);
		}
	}

	let result = {elements: returnElements, names: nameMap, defs: returnDefs};
	return result;
}

function getIconName(iconSVG, nameMap){
	let findID = document.createElement('div');
	findID.innerHTML = iconSVG;
	let elemID = findID.getElementsByTagName('svg') || 'name';
	if(elemID[0] && elemID[0].id) elemID = elemID[0].id;

	let name = nameMap[elemID];
	if(!name) name = elemID;

	return name;
}


// -----------------------------------------
// Making the icon list
// -----------------------------------------
function processIcons(list) {
	// console.log(list);
	let elements = list.elements;
	let idSuffix = 0;
	let oneSVG, oneName;
	
	for(let i = elements.length-1; i > -1; i--) {
		oneSVG = convertSVG(elements[i], list.defs);
		oneName = getIconName(oneSVG, list.names);
		_iconData[`id${idSuffix}`] = {
			name: oneName,
			svg: oneSVG
		};
		idSuffix++;
	}
}

function populateIconList() {
	let keys = Object.keys(_iconData);

	if(keys.length) {
		// Top row
		let bodyContent = `
			<div class="headerRow">
				<input type="text" id="searchBox" placeholder="Search across ${keys.length} icons"></input>
				<button id="openInfo"><span>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
						x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" style="enable-background:new 0 0 14 14;" >
					<path d="M7,0C3.1,0,0,3.1,0,7c0,3.9,3.1,7,7,7s7-3.1,7-7C14,3.1,10.9,0,7,0z M8,12H6V6h2V12z 
						M7,4.5c-0.8,0-1.3-0.6-1.3-1.3 S6.4,2,7,2c0.6,0,1.3,0.6,1.3,1.3S7.8,4.5,7,4.5z"/>
					</svg>
				</span></button>
				</div>
				<button id="downloadAll" class="downloadButton">Download all icons as a .zip</button>
		`;

		// Build all the rows per icon
		keys.forEach((key) => {
			data = _iconData[key];
			bodyContent += `
				<div class="rowWrapper" data-search-name="${data.name}">
					<div style="grid-column: 1;" class="iconPreview" title="SVG file preview">${data.svg}</div>
					<div style="grid-column: 2;" class="iconName">
						<input type="text" value="${data.name}" class="iconNameInput" data-icon-id="${key}" title="Rename the SVG file"></input>
					</div>
					<button style="grid-column: 3;" class="downloadButton" onclick="downloadIcon();" data-icon-id="${key}" title="Download the SVG file">
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
							x="0px" y="0px" width="14px" height="16px" viewBox="0 0 14 16" style="enable-background:new 0 0 14 16;"
							data-icon-id="${key}" >
							<polygon data-icon-id="${key}" points="12,7 8.5,10.5 8.5,0 5.5,0 5.5,10.5 2,7 0,9 7,16 14,9 "/>
						</svg>
					</button>
				</div>
			`;
		});

		// Bottom row
		bodyContent += '<i style="grid-column: span 3;">End of icon list</i>';
		document.getElementById('bodyContent').innerHTML = bodyContent;

	} else {
		document.getElementById('bodyContent').innerHTML = '<i style="grid-column: span 3;">No icons found</i>';
	}

	// Add event listeners
	document.getElementById('searchBox').onchange = search;
	document.getElementById('searchBox').onkeyup = search;
	document.getElementById('openInfo').onclick = () => document.getElementById('info').style.display = 'block';
	document.getElementById('closeInfo').onclick = () => document.getElementById('info').style.display = 'none';
	document.getElementById('downloadAll').onclick = downloadAllIcons;
	Array.from(document.getElementsByClassName('downloadButton')).forEach((button) => {
		if(button.id !== 'downloadAll') button.onclick = downloadIcon;
	});
	Array.from(document.getElementsByClassName('iconNameInput')).forEach((input) => input.onkeyup = updateIconName);
}

function updateIconName(event) {
	let id = event.srcElement.getAttribute('data-icon-id');
	_iconData[id].name = event.srcElement.value;
}

function downloadIcon(event) {
	let id = event.srcElement.getAttribute('data-icon-id');
	let data = _iconData[id];
	downloadFile(`${data.name}.svg`, data.svg); 
}

function downloadFile(fileName, fileContent) {
	let file = new Blob([fileContent], {type: 'svg'});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, fileName);
	else { // Others
		let a = document.createElement("a");
		let url = URL.createObjectURL(file);
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);	
		}, 0); 
	}
}


// ------------------------------------------------
// Change SVG properties so icons work stand-alone
// ------------------------------------------------

function convertSVG(iconSVG, defs) {
	// lookup table to get static colors for classes
	let translate = [
		{className: 'msportalfx-svg-c01', fillValue: '#ffffff'},
		{className: 'msportalfx-svg-c02', fillValue: '#e5e5e5'},
		{className: 'msportalfx-svg-c03', fillValue: '#a0a1a2'},
		{className: 'msportalfx-svg-c04', fillValue: '#7a7a7a'},
		{className: 'msportalfx-svg-c05', fillValue: '#3e3e3e'},
		{className: 'msportalfx-svg-c06', fillValue: '#1e1e1e'},
		{className: 'msportalfx-svg-c07', fillValue: '#0f0f0f'},
		{className: 'msportalfx-svg-c08', fillValue: '#ba141a'},
		{className: 'msportalfx-svg-c09', fillValue: '#dd5900'},
		{className: 'msportalfx-svg-c10', fillValue: '#ff8c00'},
		{className: 'msportalfx-svg-c11', fillValue: '#fcd116'},
		{className: 'msportalfx-svg-c12', fillValue: '#fee087'},
		{className: 'msportalfx-svg-c13', fillValue: '#b8d432'},
		{className: 'msportalfx-svg-c14', fillValue: '#57a300'},
		{className: 'msportalfx-svg-c15', fillValue: '#59b4d9'},
		{className: 'msportalfx-svg-c16', fillValue: '#3999c6'},
		{className: 'msportalfx-svg-c17', fillValue: '#804998'},
		{className: 'msportalfx-svg-c18', fillValue: '#ec008c'},
		{className: 'msportalfx-svg-c19', fillValue: '#0072c6'},
		{className: 'msportalfx-svg-c20', fillValue: '#68217a'},
		{className: 'msportalfx-svg-c21', fillValue: '#00188f'},
		{className: 'msportalfx-svg-c22', fillValue: '#a4262c'},
		{className: 'msportalfx-svg-c23', fillValue: '#cae3f3'},
		{className: 'msportalfx-svg-c24', fillValue: '#59aed3'},
		{className: 'msportalfx-svg-c25', fillValue: '#4c3b12'},
		{className: 'msportalfx-svg-c26', fillValue: '#be9555'},
		{className: 'msportalfx-svg-c27', fillValue: '#4f4d52'},
		{className: 'msportalfx-svg-c28', fillValue: '#ef6f59'},
		{className: 'msportalfx-svg-c29', fillValue: '#f7cb64'},
		{className: 'msportalfx-svg-c30', fillValue: '#fdd8db'},
		{className: 'msportalfx-svg-c31', fillValue: '#f6ffec'},
		{className: 'msportalfx-svg-c32', fillValue: '#57a300'},
		{className: 'msportalfx-svg-c33', fillValue: '#8a2da5'},
		{className: 'msportalfx-svg-c34', fillValue: '#e00b1c'},
		{className: 'msportalfx-svg-c35', fillValue: '#015cda'},
		{className: 'msportalfx-svg-c36', fillValue: '#5db300'},
		{className: 'msportalfx-svg-c97', fillValue: '#ffb900'},
		{className: 'msportalfx-svg-c98', fillValue: '#00a4ef'},
		{className: 'msportalfx-svg-c99', fillValue: '#f25022'}
	];

	// Change from a symbol reference to an SVG element
	iconSVG = iconSVG.replace('<svg><defs><symbol', '<svg');
	iconSVG = iconSVG.replace('</symbol></defs></svg>', '</svg>');
	iconSVG = iconSVG.replace('<title></title><defs></defs>', '');

	// Setting the XML NameSpace directly enables the SVG graphic to be viewed instead of the XML tree
	iconSVG = iconSVG.replace('xmlns:svg', 'xmlns');
	
	// Reservations icon has a bug where they specify the same class twice :-/
	iconSVG = iconSVG.replace(new RegExp('msportalfx-svg-c01 msportalfx-svg-c01', 'gi'), 'msportalfx-svg-c01');
	iconSVG = iconSVG.replace(new RegExp('msportalfx-svg-c04 msportalfx-svg-c04', 'gi'), 'msportalfx-svg-c04');

	// Add fill colors for all fill style classes
	for(let i=0; i<translate.length; i++){
		iconSVG = iconSVG.replace(
			new RegExp(` class="${translate[i].className}"`, 'gi'), 
			` class="${translate[i].className}" fill="${translate[i].fillValue}"`
		);
	}
	
	// Include the right gradient definitions based on fill URLs
	
	let gradIDs = [];
	for(let defID in defs) {
		if(defs.hasOwnProperty(defID)) {
			if(iconSVG.indexOf(defID) > -1) {
				gradIDs.push(defID);
			}
		}
	}

	let defCode = '<defs>';
	for(let i=0; i<gradIDs.length; i++){
		defCode += `\n${defs[gradIDs[i]]}`;
	}
	defCode += '\n</defs>\n';
	iconSVG = iconSVG.replace('</g></svg>', `</g>${defCode}</svg>`);

	return iconSVG;
}


// -----------------------------------------
// Support functions
// -----------------------------------------
function search() {
	let term = document.getElementById('searchBox').value;
	let rows = document.querySelectorAll('.rowWrapper');
	let rowName;

	rows.forEach(row => {
		rowName = row.getAttribute('data-search-name');
		if(rowName.toLocaleLowerCase().includes(term.toLocaleLowerCase()) || term === '') {
			row.style.display = 'contents';
		} else {
			row.style.display = 'none';
		}
	});
}

function downloadAllIcons() {
	const zip = new JSZip();
	
	const iconFolder = zip.folder("icons");
	Object.keys(_iconData).forEach((key) => {
		let data = _iconData[key];
		iconFolder.file(`${data.name}.svg`, new Blob([data.svg], {type: 'svg'}));
	});
	
	zip.generateAsync({type:"blob"}).then(function(content) {
		downloadFile('icons.zip', content);
	});
}