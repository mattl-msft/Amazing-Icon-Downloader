# ![logo](https://raw.githubusercontent.com/mattlag/Amazing-Icon-Downloader/master/dev/icons/icon32.png) Amazing Icon Downloader

## Main features
 - Easily view all icons on a page, works with:
   - **portal.azure.com**
   - **endpoint.microsoft.com**
 - Search to filter down long lists of icons
 - Rename and download any single icon
 - Bulk download all icons as a .zip file
 - Works with either Chrome or Edge

## Basically does two things:
 - When you're on portal.azure.com or endpoint.microsoft.com, it lists all the icons that are in the current view.
 - You can give each icon a name, and download it from the extension's popup.
   - In the background, the extension adds `fill="#"` color attributes that correspond to the CSS-based fill colors, so that the SVG icons can be used outside of the Azure&trade; portal.
   - Tries to guess the name of the icon based on DOM `title` attributes that are 'close' to the SVG.

## Download the extension
Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/amazing-icon-downloader/kllljifcjfleikiipbkdcgllbllahaob/)
 in either Edge or Chrome to add the extension.
