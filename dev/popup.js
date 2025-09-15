// -----------------------------------------
// Gathering data to populate the icon list
// -----------------------------------------

// Overall storage for icon ID, Name, and SVG
let _iconData = [];
let iconDownloadMode = 'svg';

// What to do every time the popup is opened
document.addEventListener('DOMContentLoaded', async () => {
	// console.log(`\n\nDOMContentLoaded - START`);
	let content = document.getElementById('bodyContent');
	content.innerHTML = '<i style="grid-column: span 3;">Getting icons...</i>';

	const tab = await getCurrentTab();
	// console.log(`getCurrentTab results`);
	// console.log(tab);
	if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
		showURLErrorMessage();
		return;
	}

	let results = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: getIcons,
	});
	// console.log(`executeScript results`);
	// console.log(results);

	if (results[0]?.result) {
		results = results[0].result;
		processIcons(results);
		if (Object.keys(_iconData).length) {
			populateIconList(_iconData);
		} else {
			content.innerHTML =
				'<i style="grid-column: span 3; color: darkred;">No icons found to display.</i>';
		}
	} else {
		showURLErrorMessage();
	}
});

function showURLErrorMessage() {
	document.getElementById('bodyContent').innerHTML = `
	<i style="grid-column: span 3; color: darkred;">
		Amazing Icon Downloader does not work for this URL.
		<br>
		Currently this extension only works on:
		<ul>
			<li>portal.azure.com</li>
			<li>endpoint.microsoft.com</li>
		</ul>
		<br>
		Contact <a href="mailto:matt@mattlag.com">matt@mattlag.com</a> for help.
	</i>`;
}

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function getIcons() {
	// console.log(`\n\ngetIcons - START`);

	// ========================================
	// Find icons and early return if needed
	// ========================================
	let symbols = document.getElementById('FxSymbolContainer');
	// console.log(symbols);

	let webContainerSVG = document
		.getElementById('web-container')
		.querySelectorAll('svg');
	// console.log(webContainerSVG);
	let hardCodedSVG = [];
	webContainerSVG.forEach((node) => {
		if (
			node.querySelectorAll('use').length === 0 &&
			node.querySelectorAll('path').length !== 0 &&
			node.querySelectorAll('[class^=azc]').length === 0 &&
			node.id === ''
		) {
			hardCodedSVG.push(node);
		}
	});
	// console.log(hardCodedSVG);

	if (!symbols && !hardCodedSVG) {
		console.warn(
			`Amazing Icon Downloader - No symbol library or hard-coded SVG icons found.`
		);
		return false;
	}

	// ========================================
	// Declared within getIcons because
	// getIcons is inside a function wrapper
	// ========================================
	function getOneIcon(symbol, nameMap) {
		/*
		 *	GET THE NAME OF THE ICON
		 */
		let name = false;
		let symbolID = symbol?.firstChild?.firstChild?.id;
		if (!symbolID) {
			symbolID = `generated-id-${Date.now()}`;
			nameMap[symbolID] = 'Icon';
		}

		// Look for common icons that are known to not have title attributes
		// if (symbol.getElementsByTagName('path').length) {
		if (symbol.querySelector('path')) {
			let pathData = symbol.querySelector('path').getAttribute('d');
			if (
				pathData ===
				'M25.561 23.167a.562.562 0 0 1-.288-.083L6.011 12.045a.578.578 0 0 1 0-1.002L25.149.075c.182-.1.405-.1.579 0L44.994 11.12c.174.102.29.291.29.496 0 .212-.116.4-.29.504L25.853 23.084a.573.573 0 0 1-.292.083'
			) {
				nameMap[symbolID] = 'Resource';
			} else if (pathData === 'M8.2 6l-5.5 5.5.6.5 6-6-6-6-.6.5z') {
				nameMap[symbolID] = 'Chevron';
			} else if (
				pathData ===
				'M-790.5 996c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm.7 7.5h-1.5v-3.6h1.5v3.6zm-.7-4.4c-.5 0-.8-.4-.8-.8s.4-.8.8-.8.8.4.8.8-.3.8-.8.8z'
			) {
				nameMap[symbolID] = 'Info';
			} else if (pathData.startsWith('M7,14a6.68,6.68,0,0,1-1.86-.25,7.28')) {
				nameMap[symbolID] = 'Info';
			} else if (
				pathData ===
				'M4.992 9.819l8.018-7.991v4.005H14V0H8.167v1h4.038L4.232 8.987l.76.833z'
			) {
				nameMap[symbolID] = 'Link';
			} else if (
				pathData ===
				'M8.7 7.9l7.1 7.1-.8.8-7.1-7.1-7.1 7.1L0 15l7.1-7.1L0 .8.8 0l7.1 7.1L15 0l.8.8z'
			) {
				nameMap[symbolID] = 'Close';
			} else if (pathData === 'M0 3h18v1H0zm0 5h18v1H0zm0 5h18v1H0z') {
				nameMap[symbolID] = 'Hamburger';
			} else if (
				pathData ===
				'M22.83 4.372a20.662 20.662 0 0 0-13.953 7.579 20.672 20.672 0 0 0-4.508 15.227 20.668 20.668 0 0 0 7.581 13.949c4.134 3.346 9.52 5.109 15.222 4.509 5.705-.601 10.606-3.451 13.955-7.581 3.34-4.132 5.106-9.519 4.505-15.225-.608-5.751-3.528-10.669-7.724-14.064-3.531-2.859-8.032-4.51-12.856-4.51-.733 0-1.474.038-2.222.116'
			) {
				nameMap[symbolID] = 'Recent';
			} else if (
				pathData ===
				'M12.354 5.353l.896-.897.29.29-.897.896zm1.576 3.524h1.268v.409H13.93zm-1.634 3.876l.289-.29.896.897-.289.29zM8.71 14.077h.409v1.268H8.71zM4.249 4.704l.289-.29.897.897-.29.29zm.061 8.693l.896-.897.29.29-.897.896zm-1.757-4.52h1.268v.409H2.553zm9.419 2.483L9.821 9.209a.518.518 0 0 0-.351-.148.507.507 0 0 0 .065-.238V3.348a.522.522 0 0 0-.52-.521h-.1a.522.522 0 0 0-.521.521v5.475a.522.522 0 0 0 .521.521h.058a.514.514 0 0 0 .042.67l2.151 2.151a.521.521 0 0 0 .735 0l.07-.07a.521.521 0 0 0 .001-.735z'
			) {
				nameMap[symbolID] = 'Recent';
			} else if (
				pathData ===
				'M14.9 10.4l.4.4.4.5a1.4 1.4 0 0 1 .2.6 1.3 1.3 0 0 1 .1.6 3.6 3.6 0 0 1-.2 1 3.5 3.5 0 0 1-.5.8l-.8.5-1 .2a2 2 0 0 1-1.3-.4 5.4 5.4 0 0 1-2 1A5.4 5.4 0 0 1 8 16a5.7 5.7 0 0 1-2.2-.4 5.4 5.4 0 0 1-2-1 2 2 0 0 1-1.3.4l-1-.2-.8-.5a3.5 3.5 0 0 1-.5-.8 3.6 3.6 0 0 1-.2-1 1.3 1.3 0 0 1 .1-.6 1.4 1.4 0 0 1 .2-.6l.4-.5c.1-.2.3-.3.4-.4a1.7 1.7 0 0 0-.1-.7V9a7.6 7.6 0 0 1 .3-2.1A6.6 6.6 0 0 1 2.2 5l1.5-1.5a5.2 5.2 0 0 1 1.8-1 3 3 0 0 1 .2-1 2.2 2.2 0 0 1 .5-.8L7 .2 8 0l1 .2.8.5a2.2 2.2 0 0 1 .5.8 3 3 0 0 1 .2 1 5.2 5.2 0 0 1 1.8 1L13.8 5a6.6 6.6 0 0 1 .9 1.9A7.6 7.6 0 0 1 15 9v.7a1.7 1.7 0 0 0-.1.7zM1 12.5a1.3 1.3 0 0 0 .1.6l.3.5.5.3h1.2l.5-.3.3-.5a1.3 1.3 0 0 0 .1-.6 1.3 1.3 0 0 0-.1-.6l-.3-.5-.5-.3H1.9l-.5.3-.3.5a1.3 1.3 0 0 0-.1.6zM8 15a5.7 5.7 0 0 0 1.8-.3 4.8 4.8 0 0 0 1.6-.8l-.3-.7a1.5 1.5 0 0 1-.1-.7 3.6 3.6 0 0 1 .2-1 3.5 3.5 0 0 1 .5-.8l.8-.5 1-.2h.4a3.4 3.4 0 0 0 .1-1 5.7 5.7 0 0 0-.3-1.8 4.1 4.1 0 0 0-.7-1.5 4.9 4.9 0 0 0-1.2-1.3 3.8 3.8 0 0 0-1.5-.9l-.4.6c-.1.2-.3.3-.5.5l-.7.3H7.3l-.7-.3-.5-.5-.4-.6a3.8 3.8 0 0 0-1.5.9A4.9 4.9 0 0 0 3 5.7a5.1 5.1 0 0 0-.7 1.5A5.7 5.7 0 0 0 2 9a3.4 3.4 0 0 0 .1 1h1.1l.9.5a2.7 2.7 0 0 1 .7.8 4.3 4.3 0 0 1 .2 1.2 1.5 1.5 0 0 1-.1.7l-.3.7a4.8 4.8 0 0 0 1.6.8A5.7 5.7 0 0 0 8 15zM8 1h-.6l-.5.3-.3.5a1.3 1.3 0 0 0-.1.6 1.3 1.3 0 0 0 .1.6l.3.5.5.3h1.2l.5-.3.3-.5a1.3 1.3 0 0 0 .1-.6 1.3 1.3 0 0 0-.1-.6l-.3-.5-.5-.3zm5.5 13h.6l.5-.3.3-.5a1.3 1.3 0 0 0 .1-.6 1.3 1.3 0 0 0-.1-.6l-.3-.5-.5-.3h-1.2l-.5.3-.3.5a1.3 1.3 0 0 0-.1.6 1.3 1.3 0 0 0 .1.6l.3.5.5.3z'
			) {
				nameMap[symbolID] = 'Share';
			} else if (
				pathData ===
				'M3.578 0a1.766 1.766 0 0 0-.744.166A2.153 2.153 0 0 0 2.217.6a2.13 2.13 0 0 0-.433.621 1.762 1.762 0 0 0-.165.739V4H0v1.418h1.619v6.589H0v1.415h1.619v2.044a1.893 1.893 0 0 0 .154.762 1.969 1.969 0 0 0 .42.623 1.944 1.944 0 0 0 .625.421 1.91 1.91 0 0 0 .75.152h7.459v-1.415H6.485V1.416h9.13v6h1.415V0zm1.5 16.009H3.7a.645.645 0 0 1-.26-.051.686.686 0 0 1-.212-.144.711.711 0 0 1-.145-.214 1.861 1.861 0 0 1-.047-.387v-1.791h.7v-1.415h-.7V5.418h.7V4h-.7V2.084a.493.493 0 0 1 .054-.22.88.88 0 0 1 .39-.391.5.5 0 0 1 .22-.057h1.382z'
			) {
				nameMap[symbolID] = 'Directory + Subscription';
			} else if (
				pathData ===
				'M8.267 8H.733c-.6 0-.916-.623-.62-1.129L2.014 3.53 3.896.384c.302-.507.903-.514 1.197-.008L7.001 3.65l1.882 3.229C9.183 7.383 8.881 8 8.267 8z'
			) {
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
		if (!nameMap[symbolID]) {
			let query = '[href="#' + symbolID + '"]';
			let nameElement = document.querySelector(query);
			if (nameElement) {
				// Home > Recent
				if (
					nameElement.parentNode.parentNode.parentNode.parentNode.querySelector(
						'.fxs-home-recent-typename'
					)
				) {
					name =
						nameElement.parentNode.parentNode.parentNode.parentNode.querySelector(
							'.fxs-home-recent-typename'
						).innerText;
					// console.log(`Special case name found for Home>Recent is ${name}`);
				}

				// TOC nav
				if (
					nameElement.parentNode.parentNode.parentNode.querySelector(
						'.ext-fxc-menu-listView-item'
					)
				) {
					name = nameElement.parentNode.parentNode.parentNode.querySelector(
						'.ext-fxc-menu-listView-item'
					).innerText;
					// console.log(`Special case name found for TOC is ${name}`);
				}

				// All services list
				if (
					nameElement.parentNode.parentNode.parentNode.querySelector(
						'.fxs-sidebar-label'
					) &&
					nameElement.parentNode.parentNode.parentNode.querySelector(
						'.fxs-sidebar-label'
					).children[0]
				) {
					name =
						nameElement.parentNode.parentNode.parentNode.querySelector(
							'.fxs-sidebar-label'
						).children[0].innerText;
					// console.log(`Special case name found for All Services is ${name}`);
				}

				// SVG Title node in grid views
				if (nameElement.parentNode.getElementsByTagName('title').length) {
					name =
						nameElement.parentNode.getElementsByTagName('title')[0].textContent;
					// console.log(`Special case name found for SVG Title is ${name}`);
				}

				// generic title attributes
				if (nameElement && nameElement.title) name = nameElement.title;
				else if (nameElement.parentNode.title)
					name = nameElement.parentNode.title;
				else if (nameElement.parentNode.parentNode.title)
					name = nameElement.parentNode.parentNode.title;
				else if (nameElement.parentNode.parentNode.parentNode.title)
					name = nameElement.parentNode.parentNode.parentNode.title;
				else if (nameElement.parentNode.parentNode.parentNode.parentNode.title)
					name = nameElement.parentNode.parentNode.parentNode.parentNode.title;
			}

			if (name) nameMap[symbolID] = name;
			// console.log(`Getting name for symbol ${symbolID} returned ${name}`);
		}
	}

	// Track classes used inside collected symbols/SVGs for later style extraction
	const usedClasses = new Set();
	function recordUsedClasses(node) {
		if (!node || !node.querySelectorAll) return;
		const classNodes = node.querySelectorAll('[class]');
		classNodes.forEach((el) => {
			const cls = el.getAttribute('class');
			if (!cls) return;
			cls.split(/\s+/).forEach((c) => {
				if (c.startsWith('msportalfx-svg-c')) usedClasses.add(c);
			});
		});
	}

	// ========================================
	// Process definitions
	// ========================================
	let defs = document.getElementById('DefsContainer');
	if (defs && defs.getElementsByTagName) {
		defs = defs.getElementsByTagName('defs');
		if (defs && defs.length) defs = defs[0];
	}
	// console.log(defs);

	// ========================================
	// Make the Icon list, and find names
	// ========================================
	let returnElements = [];
	let nameMap = {};

	// Get hard-coded SVG from the page
	let hasInfoIcon = false;
	let hasSortIcon = false;
	if (hardCodedSVG) {
		// console.log('getOneIcon for hardCodedSVG');
		for (let j = 0; j < hardCodedSVG.length; j++) {
			let blocked = false;
			let svg = hardCodedSVG[j];
			// console.log(svg);
			let firstPathD = svg.querySelector('path').getAttribute('d');
			if (firstPathD) {
				// Filter duplicate Info icons
				if (firstPathD.startsWith('M7,14a6.68,6.68,0,0,1-1.86-.25,7.28')) {
					if (!hasInfoIcon) hasInfoIcon = true;
					else blocked = true;
				}

				// Filter duplicate Sort icons
				if (firstPathD.startsWith('m15.359 9.478-6.226-6.21v17.557H')) {
					if (!hasSortIcon) hasSortIcon = true;
					else blocked = true;
				}
			}

			if (!blocked) {
				returnElements.push(svg.outerHTML);
				getOneIcon(svg, nameMap);
				recordUsedClasses(svg);
			}
		}
	}

	// Get SVG from the Symbols Library
	if (symbols) {
		// console.log('getOneIcon for symbols');
		for (let i = 0; i < symbols.children.length; i++) {
			let symbol = symbols.children[i];
			// console.log(symbol);
			returnElements.push(symbol.outerHTML);
			getOneIcon(symbol, nameMap);
			recordUsedClasses(symbol);
		}
	}

	// ========================================
	// Pull out all the gradient definitions
	// ========================================
	let returnDefs = {};

	if (defs) {
		let def;
		let defID;

		for (let d = 0; d < defs.children.length; d++) {
			def = defs.children[d];
			defID = def.getAttribute('id');
			returnDefs[defID] = def.outerHTML;
		}
	}

	// ========================================
	// Extract fill & stroke styles for used classes
	// ========================================
	const classStyles = {};
	if (usedClasses.size) {
		// Attempt to read CSS rules; ignore cross-origin stylesheets
		for (const sheet of Array.from(document.styleSheets)) {
			let rules;
			try {
				rules = sheet.cssRules;
			} catch (e) {
				continue;
			}
			if (!rules) continue;
			for (const rule of Array.from(rules)) {
				if (!rule.selectorText || !rule.style) continue;
				if (!/\.msportalfx-svg-c\d+/.test(rule.selectorText)) continue;
				const fillVal = rule.style.fill || null;
				const strokeVal = rule.style.stroke || null;
				const strokeWidth = rule.style.strokeWidth || null;
				const fillOpacity = rule.style.fillOpacity || null;
				const strokeOpacity = rule.style.strokeOpacity || null;
				const opacity = rule.style.opacity || null;
				const strokeLinecap = rule.style.strokeLinecap || null;
				const strokeLinejoin = rule.style.strokeLinejoin || null;
				const strokeDasharray = rule.style.strokeDasharray || null;
				if (
					!fillVal &&
					!strokeVal &&
					!strokeWidth &&
					!fillOpacity &&
					!strokeOpacity &&
					!opacity &&
					!strokeLinecap &&
					!strokeLinejoin &&
					!strokeDasharray
				)
					continue;
				const selectors = rule.selectorText.split(',');
				for (let sel of selectors) {
					sel = sel.trim();
					if (sel.startsWith('.')) sel = sel.slice(1);
					if (usedClasses.has(sel)) {
						if (!classStyles[sel]) classStyles[sel] = {};
						if (fillVal && !classStyles[sel].fill)
							classStyles[sel].fill = fillVal;
						if (strokeVal && !classStyles[sel].stroke)
							classStyles[sel].stroke = strokeVal;
						if (strokeWidth && !classStyles[sel].strokeWidth)
							classStyles[sel].strokeWidth = strokeWidth;
						if (fillOpacity && !classStyles[sel].fillOpacity)
							classStyles[sel].fillOpacity = fillOpacity;
						if (strokeOpacity && !classStyles[sel].strokeOpacity)
							classStyles[sel].strokeOpacity = strokeOpacity;
						if (opacity && !classStyles[sel].opacity)
							classStyles[sel].opacity = opacity;
						if (strokeLinecap && !classStyles[sel].strokeLinecap)
							classStyles[sel].strokeLinecap = strokeLinecap;
						if (strokeLinejoin && !classStyles[sel].strokeLinejoin)
							classStyles[sel].strokeLinejoin = strokeLinejoin;
						if (strokeDasharray && !classStyles[sel].strokeDasharray)
							classStyles[sel].strokeDasharray = strokeDasharray;
					}
				}
			}
		}
	}

	// ========================================
	// Finish up
	// ========================================
	let result = {
		elements: returnElements,
		names: nameMap,
		defs: returnDefs,
		classStyles,
	};
	// console.log(result);
	return result;
}

function getIconName(iconSVG, nameMap) {
	let findID = document.createElement('div');
	findID.innerHTML = iconSVG;
	let elemID = findID.querySelector('svg')?.id || 'Icon';
	let name = nameMap[elemID];
	if (!name) name = elemID;
	// if (name.startsWith('[object')) name = 'Icon';

	return name;
}

// -----------------------------------------
// Making the icon list
// -----------------------------------------
function processIcons(list) {
	// console.log(`\n\nprocessIcons - START`);
	// console.log(list);

	let elements = list.elements;
	let idSuffix = 0;
	let oneSVG, oneName;

	for (let i = elements.length - 1; i > -1; i--) {
		oneSVG = convertSVG(elements[i], list.defs, list.classStyles || {});
		oneName = getIconName(oneSVG, list.names);
		_iconData[`id${idSuffix}`] = {
			name: oneName,
			svg: oneSVG,
		};
		idSuffix++;
	}
}

function populateIconList() {
	let keys = Object.keys(_iconData);

	if (keys.length) {
		// Top row
		let bodyContent = `
			<div class="firstRow">
				<input type="text" id="searchBox" placeholder="Search across ${keys.length} icons"></input>
				<button id="openInfo" class="fancyButton"><span>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
						x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" style="enable-background:new 0 0 14 14;" >
					<path d="M7,0C3.1,0,0,3.1,0,7c0,3.9,3.1,7,7,7s7-3.1,7-7C14,3.1,10.9,0,7,0z M8,12H6V6h2V12z 
						M7,4.5c-0.8,0-1.3-0.6-1.3-1.3 S6.4,2,7,2c0.6,0,1.3,0.6,1.3,1.3S7.8,4.5,7,4.5z"/>
					</svg>
				</span></button>
			</div>
			<div class="secondRow">
				<button id="downloadAllButton">Download all icons as a .zip</button>
				<div class="downloadTypeArea">Download single icons as: <button id="downloadTypeButton">svg</button></div>
			</div>
			<div class="iconRows">
		`;

		// Build all the rows per icon
		keys.forEach((key) => {
			data = _iconData[key];
			bodyContent += `
				<div class="rowWrapper" data-search-name="${data.name}">
					<div style="grid-column: 1;" class="iconPreview" title="Icon file preview">${data.svg}</div>
					<div style="grid-column: 2;" class="iconName">
						<input type="text" value="${data.name}" class="iconNameInput" data-icon-id="${key}" title="Rename the icon file"></input>
					</div>
					<button style="grid-column: 3;" class="downloadButton" onclick="downloadIcon();" data-icon-id="${key}" title="Download the icon file">
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
		bodyContent += '</div>';
		document.getElementById('bodyContent').innerHTML = bodyContent;
	} else {
		document.getElementById('bodyContent').innerHTML =
			'<i style="grid-column: span 3;">No icons found</i>';
	}

	// Add event listeners
	document.getElementById('searchBox').addEventListener('change', search);
	document.getElementById('searchBox').addEventListener('keyup', search);
	document.getElementById('openInfo').addEventListener('click', () => {
		let info = document.getElementById('info');
		info.style.opacity = '0';
		info.style.display = 'block';
		window.setTimeout(() => {
			info.style.opacity = '1';
		}, 10);
	});
	document.getElementById('closeInfo').addEventListener('click', () => {
		let info = document.getElementById('info');
		info.style.opacity = '0';
		window.setTimeout(() => {
			info.style.display = 'none';
		}, 200);
	});
	document
		.getElementById('downloadAllButton')
		.addEventListener('click', downloadAllIcons);
	document
		.getElementById('downloadTypeButton')
		.addEventListener('click', toggleDownloadType);

	Array.from(document.getElementsByClassName('downloadButton')).forEach(
		(button) => {
			if (button.id !== 'downloadAllButton')
				button.addEventListener('click', downloadIcon);
		}
	);

	Array.from(document.getElementsByClassName('iconNameInput')).forEach(
		(input) => input.addEventListener('keyup', updateIconName)
	);
}

function updateIconName(event) {
	let id = event.srcElement.getAttribute('data-icon-id');
	_iconData[id].name = event.srcElement.value;
}

async function downloadIcon(event) {
	let id = event.srcElement.getAttribute('data-icon-id');
	let data = _iconData[id];
	if (iconDownloadMode === 'png') {
		const dataURL = await convertSVGToPNG(data.svg);
		if (dataURL !== false) {
			downloadFileFromDataURL(`${data.name}.png`, dataURL);
		} else {
			alert(`Failed to convert SVG to PNG for: ${data.name}`);
		}
	} else {
		downloadFileFromBlob(`${data.name}.svg`, data.svg);
	}
}

function downloadFileFromBlob(fileName, fileContent) {
	// console.log('downloadFileFromBlob', fileName);
	let file = new Blob([fileContent], { type: `image/svg` });
	let url = URL.createObjectURL(file);
	downloadFileFromDataURL(fileName, url);
}

function downloadFileFromDataURL(fileName, dataURL) {
	// console.log('downloadFileFromURL', fileName);
	let link = document.createElement('a');
	link.setAttribute('href', dataURL);
	link.setAttribute('download', fileName);
	// console.log(link);
	link.click();
}

// ------------------------------------------------
// Change SVG properties so icons work stand-alone
// ------------------------------------------------

function convertSVG(iconSVG, defs, classStyles) {
	// Dynamic flattening approach removing manual class to color mapping.

	function collectReferencedIds(fragment) {
		const ids = new Set();
		const urlRe = /url\(#([^)]+)\)/g;
		let m;
		while ((m = urlRe.exec(fragment))) ids.add(m[1]);
		const hrefRe = /(?:xlink:href|href)=["']#([^"']+)["']/g;
		while ((m = hrefRe.exec(fragment))) ids.add(m[1]);
		return ids;
	}

	function gatherDefinitions(availableDefs, initialIds) {
		const collected = new Map();
		const toProcess = [...initialIds];
		const seen = new Set();
		while (toProcess.length) {
			const id = toProcess.pop();
			if (seen.has(id)) continue;
			seen.add(id);
			const def = availableDefs[id];
			if (def) {
				collected.set(id, def);
				const nested = collectReferencedIds(def);
				for (const n of nested) if (!seen.has(n)) toProcess.push(n);
			}
		}
		return [...collected.values()];
	}

	// Change from a symbol reference to an SVG element
	iconSVG = iconSVG.replace('<svg><defs><symbol', '<svg');
	iconSVG = iconSVG.replace('</symbol></defs></svg>', '</svg>');
	iconSVG = iconSVG.replace('<title></title><defs></defs>', '');

	// Setting the XML NameSpace directly enables the SVG graphic to be viewed instead of the XML tree
	iconSVG = iconSVG.replace('xmlns:svg', 'xmlns');

	// Inline class-based fill/stroke (only when element lacks those attributes)
	if (classStyles && Object.keys(classStyles).length) {
		iconSVG = iconSVG.replace(
			/<([a-zA-Z]+)([^>]*?)class="([^"]+)"([^>]*)>/g,
			(m, tag, pre, classes, post) => {
				const existing = (attr) =>
					new RegExp(`${attr}\\s*=`, 'i').test(pre) ||
					new RegExp(`${attr}\\s*=`, 'i').test(post);
				const classList = classes.split(/\s+/);
				let collected = {};
				for (const c of classList) {
					const style = classStyles[c];
					if (!style) continue;
					if (!existing('fill') && !collected.fill && style.fill)
						collected.fill = style.fill;
					if (!existing('stroke') && !collected.stroke && style.stroke)
						collected.stroke = style.stroke;
					if (
						!existing('stroke-width') &&
						!collected.strokeWidth &&
						style.strokeWidth
					)
						collected.strokeWidth = style.strokeWidth;
					if (
						!existing('stroke-linecap') &&
						!collected.strokeLinecap &&
						style.strokeLinecap
					)
						collected.strokeLinecap = style.strokeLinecap;
					if (
						!existing('stroke-linejoin') &&
						!collected.strokeLinejoin &&
						style.strokeLinejoin
					)
						collected.strokeLinejoin = style.strokeLinejoin;
					if (
						!existing('stroke-dasharray') &&
						!collected.strokeDasharray &&
						style.strokeDasharray
					)
						collected.strokeDasharray = style.strokeDasharray;
					if (
						!existing('fill-opacity') &&
						!collected.fillOpacity &&
						style.fillOpacity
					)
						collected.fillOpacity = style.fillOpacity;
					if (
						!existing('stroke-opacity') &&
						!collected.strokeOpacity &&
						style.strokeOpacity
					)
						collected.strokeOpacity = style.strokeOpacity;
					if (!existing('opacity') && !collected.opacity && style.opacity)
						collected.opacity = style.opacity;
					// Break early if we have gathered all potential attributes
					if (
						collected.fill &&
						collected.stroke &&
						collected.strokeWidth &&
						collected.strokeLinecap &&
						collected.strokeLinejoin &&
						collected.strokeDasharray &&
						collected.fillOpacity &&
						collected.strokeOpacity &&
						collected.opacity
					)
						break;
				}
				if (Object.keys(collected).length === 0) return m;
				let ordered = '';
				if (collected.fill) ordered += ` fill="${collected.fill}"`;
				if (collected.stroke) ordered += ` stroke="${collected.stroke}"`;
				if (collected.strokeWidth)
					ordered += ` stroke-width="${collected.strokeWidth}"`;
				if (collected.strokeLinecap)
					ordered += ` stroke-linecap="${collected.strokeLinecap}"`;
				if (collected.strokeLinejoin)
					ordered += ` stroke-linejoin="${collected.strokeLinejoin}"`;
				if (collected.strokeDasharray)
					ordered += ` stroke-dasharray="${collected.strokeDasharray}"`;
				if (collected.fillOpacity)
					ordered += ` fill-opacity="${collected.fillOpacity}"`;
				if (collected.strokeOpacity)
					ordered += ` stroke-opacity="${collected.strokeOpacity}"`;
				if (collected.opacity) ordered += ` opacity="${collected.opacity}"`;
				return `<${tag}${pre}class="${classes}"${ordered}${post}>`;
			}
		);
	}

	// Fast path: if there are no url(#...) or href="#..." references, skip definition gathering entirely (after class fill inlining).
	if (!/url\(#|href="#/.test(iconSVG)) return iconSVG;

	// Collect referenced ids (gradients, masks, filters, etc.) and inline their definitions recursively.
	const referenced = collectReferencedIds(iconSVG);
	const neededDefs = gatherDefinitions(defs, referenced);
	if (neededDefs.length) {
		const defsBlock = `<defs>\n${neededDefs.join('\n')}\n</defs>`;
		if (iconSVG.includes('</g></svg>'))
			iconSVG = iconSVG.replace('</g></svg>', `</g>${defsBlock}</svg>`);
		else iconSVG = iconSVG.replace('</svg>', `${defsBlock}</svg>`);
	}
	return iconSVG;
}

// -----------------------------------------
// Support functions
// -----------------------------------------
function search() {
	let term = document.getElementById('searchBox').value;
	let rows = document.querySelectorAll('.rowWrapper');
	let rowName;

	rows.forEach((row) => {
		rowName = row.getAttribute('data-search-name');
		if (
			rowName.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
			term === ''
		) {
			row.style.display = 'contents';
		} else {
			row.style.display = 'none';
		}
	});
}

function toggleDownloadType() {
	if (iconDownloadMode === 'svg') iconDownloadMode = 'png';
	else iconDownloadMode = 'svg';

	document.getElementById('downloadTypeButton').innerHTML = iconDownloadMode;
}

function downloadAllIcons() {
	const button = document.getElementById('downloadAllButton');
	button.innerHTML = 'Downloading...';

	window.setTimeout(async () => {
		const zip = new JSZip();
		const iconFolder = zip.folder('icons');
		const dataURLHeaderLength = 'data:image/png;base64,'.length;
		const pngFailures = [];
		for (key of Object.keys(_iconData)) {
			let data = _iconData[key];
			// console.log(`\n\n${key} - ${data.name}`);
			// console.log(data.svg);
			iconFolder.file(
				`${data.name}.svg`,
				new Blob([data.svg], { type: 'svg' })
			);
			let base64Data = await convertSVGToPNG(data.svg);
			if (base64Data !== false) {
				base64Data = base64Data.slice(dataURLHeaderLength);
				// console.log(base64Data);
				iconFolder.file(`${data.name}.png`, base64Data, { base64: true });
			} else {
				pngFailures.push(data.name);
			}
		}

		zip.generateAsync({ type: 'blob' }).then(function (content) {
			downloadFileFromBlob('icons.zip', content);
			button.innerHTML = 'Download all icons as a .zip';
		});

		if (pngFailures.length > 0) {
			alert(`All icons were downloaded successfully as SVG. However, the following icons could not be converted to PNG:\n
${pngFailures.join('\n')}`);
		}
	}, 100);
}

async function convertSVGToPNG(svg) {
	/* convertSVGToPNG: Renders an SVG string to a PNG data URL using an off-screen
   canvas. Any gradient/filter definitions are already inlined earlier by
   convertSVG; no additional flattening is required here. */

	let resultData = false;
	try {
		const workingCanvas = document.createElement('canvas');
		workingCanvas.height = 1000;
		workingCanvas.width = 1000;
		const ctx = workingCanvas.getContext('2d');

		const workingImage = new Image();
		workingImage.src = 'data:image/svg+xml; charset=utf8, ';
		workingImage.src += encodeURIComponent(svg);
		// console.log(workingImage.src);
		await workingImage.decode();

		ctx.drawImage(workingImage, 0, 0);
		resultData = workingCanvas.toDataURL('image/png');
	} catch (e) {
		console.warn(e);
	}

	return resultData;
}
