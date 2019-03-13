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


document.addEventListener('DOMContentLoaded', function() {
	getIcons();
});

function getIcons() {
	document.getElementById('iconList').innerHTML = '<i>Getting icons...</i>';

	chrome.tabs.executeScript({
		code: `
			(function () {
				let returnElements = [];
				
				let symbols = document.getElementById('FxSymbolContainer');
				if(symbols) {
					for(let e=0; e<symbols.children.length; e++) returnElements.push(symbols.children[e].outerHTML);
				}
				
				chrome.runtime.sendMessage(JSON.stringify(returnElements));
			})();
		`
	});
}

chrome.runtime.onMessage.addListener(function(message) {
	// console.log(`POPUP Got Message`);
	// console.log(message);
	
	populateIconList(message);
});

function populateIconList(list) {
	let elements = JSON.parse(list);
	// console.log(elements);

	ids = [];

	if(elements.length) {
		let listContent = '';
		let iconSVG = '';

		for(let i=0; i<elements.length; i++) {
			iconSVG = elements[i];

			for(let i=0; i<translate.length; i++){
				iconSVG = iconSVG.replace(new RegExp(translate[i].find, 'gi'), (translate[i].find + translate[i].replace));
			}
			
			listContent += makeOneIconRow(iconSVG);
		}
	
		document.getElementById('iconList').innerHTML = listContent;
	} else {
		document.getElementById('iconList').innerHTML = '<i>No icons found</i>';
	}

	for(let j=0; j<ids.length; j++) {
		document.getElementById('button'+ids[j]).onclick = function() { downloadIcon(ids[j]) };
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

function makeOneIconRow(iconSVG) {
	// console.log(`\n makeOneIconRow`);
	// console.log(iconSVG);

	let element = document.createElement('div');
	element.innerHTML = iconSVG;
	let name = element.getElementsByTagName('symbol')[0];
	name = name? name.id : 'name';

	iconSVG = iconSVG.replace('<svg><defs><symbol', '<svg');
	iconSVG = iconSVG.replace('</symbol></defs></svg>', '</svg>');
	
	idSuffix++;
	ids.push(idSuffix);

	let con = '';
	con += `<div style="grid-column: 1;" class="iconPreview" id="icon${idSuffix}">${iconSVG}</div>`;
	con += `<div style="grid-column: 2;" class="iconName">
				<input type="text"  id="name${idSuffix}" value="${name}"></input>
			</div>`;
	con += `<button style="grid-column: 3;" class="downloadButton" id="button${idSuffix}">&#x21e9;</button>`;

	return con;
}

function downloadFile(name = 'icon', fContent) {
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