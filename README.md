# ![logo](https://raw.githubusercontent.com/mattlag/Amazing-Icon-Downloader/master/dev/icons/icon32.png) Amazing Icon Downloader

A Chrome and Edge browser extension to easily find and download 
SVG icons from the Azure&trade; Management portal.


## Basically does two things:
 - When you're on portal.azure.com, it lists all the icons that are in the current view.
 - You can give each icon a name, and download it from the extension's popup.
   - In the background, the extension adds `fill="#"` color attributes that correspond to the CSS-based fill colors, so that the SVG icons can be used outside of the Azure&trade; portal.
   - Tries to guess the name of the icon based on DOM `title` attributes that are 'close' to the SVG.

## Download the extension
### [for Chrome](https://chrome.google.com/webstore/detail/amazing-icon-downloader/kllljifcjfleikiipbkdcgllbllahaob/)
### [for Edge](https://microsoftedge.microsoft.com/addons/detail/amazing-icon-downloader/goanjjfecbakkdmbchgoooajnbiafong/)
