# ![logo](https://raw.githubusercontent.com/mattlag/Amazing-Icon-Downloader/master/dev/icons/icon32.png) Amazing Icon Downloader

Chrome (and [chromium-Edge](https://www.microsoftedgeinsider.com/download)!) extension to easily find and download 
SVG icons from the Azure&trade; Management portal.


## Basically does two things:
 - When you're on portal.azure.com, it lists all the icons that are in the current view.
 - You can give each icon a name, and download it from the extension's popup.
   - In the background, the extension adds `fill="#"` color attributes that correspond to the CSS-based fill colors, so that the SVG icons can be used outside of the Azure&trade; portal.
   - Tries to guess the name of the icon based on DOM `title` attributes that are 'close' to the SVG.


## [Download the extension from the Chrome Web Store](https://chrome.google.com/webstore/detail/amazing-icon-downloader/kllljifcjfleikiipbkdcgllbllahaob/)


## This is not an official extension
I'm just a guy that needs icons, okay?