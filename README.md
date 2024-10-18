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

## Recent change history

#### Version 2.2 (October 2024)
 * Some SVG icons could not be converted to PNG format, and were causing individual and `.zip` folder downloads to fail. These PNG conversions are now skipped so they don't cause the overall process to stop. An alert is shown listing which PNGs could not be downloaded.

#### Version 2.1 (September 2023)
 * Download individual icons as `.png`, and `.png`s also included in `.zip` downloads.
 * Better support for 'hard coded' svg icons that are not part of the site's icon library.

#### Version 2.0 (September 2022)
* Download all icons as `.zip`
* Better error handling / display unsupported sites to user
* Migrate to Manifest v3

#### For more history see the [releases page](https://github.com/mattl-msft/Amazing-Icon-Downloader/releases).