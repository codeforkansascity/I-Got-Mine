[![Stories Ready to Work On](https://badge.waffle.io/zmon/team3.svg?label=ready&title=Cards%20Ready%20To%20Work%20On)](https://waffle.io/zmon/team3)

Every year, many residents of Kansas City forego services provided by the City of Kansas City, MO Health Department (KCHD), frequently they are not aware such services exist.  KCHD wishes to create a presence in underserved areas throughout Kansas City, MO via mobile outreach.  By promoting better sexual health practices, testing, and KCHD sponosored events, KCHD intends to make Kansas City a healthier city for all.  

Current version of the website: http://igotmineinkc.org.

The philosophy from technical perspective to build this website is that we want it to be maintainable by non-programmer and the service can run smoothly at a low cost. The site is built on top of Github pages. Besides the benefit of convenient version control, the static pages, images and resources rendered by Github pages are automatically scaled and cached to give the best performance to the users. The dynamic content like the location information, events, cards and localized phrases are served from Google Sheets to ease the pain for non-technical member to access and update the critical site content. One aspect we need to continuously remind ourselves is that many of our users will access the site from their mobile devices. On that note, we need to work closely with designer to provide a screen-responsive, location-aware and bug-free site for main mobile browsers on different devices.

## Implementation Notes

All dynamic data (info about condom distribution sites, STD symptoms and treatment centers) are stored in several tabs in Google spreadsheet. In addition Spanish translations of both dynamic and static HTML content are stored in a separate tab of the spreadsheet. This enables a non-technical person to update the content in Excel-like interface without being exposed to the code.

The data is pulled into HTML template by 'tabletop.js' Javascript. The script uses column names stored in the first row of the spreadsheet, and, for Spanish/English translation, column letter in the spreadsheet (the column order is important, new columns for localized content should not be inserted, but rather appended at the end of the spreadsheet).

Localization (Spanish to English and English to Spanish) is done by 'l10n.js'. Note, that there are two English texts. One text is loaded from static HTML and, dynamically, from two main tabs in Google spreadsheet ('locations' and 'STDtesting'), when site loads. Another text is loaded from English text stored in 'localization' tab, when user toggles to Spanish and back to English in the UI. The awareness of this dual location for the same copy will prevent some consternation when the content is edited.

Interaction with the map and content displayed in the map (icons, site info) is via 'somemap.js'.

Bootstrap framework is used for top navigation, default button formatting, and glyphs. 

Carousel Javascript is...

STD card HTML template and flipping code is stored in std-card.js. Note, most of the flipping is done in CSS.

'scroll-to-top.js' shows scroll to top button, only when it is needed.

Most of the styling is in igotmine.css. Map content styling is in somemap.css.



![i got mine in kc layout 07](https://cloud.githubusercontent.com/assets/10410203/16285927/af98329e-389e-11e6-85e4-898f880c55dd.png)

## The Team

* Eric Dean (Project Lead, data management, Kansas City, MO Health Department)
* Shih-Wen Su (lead developer)
* Oleh Kovalchuke (UX designer, CSS, project coordination)
* Jason Devore (developer)
* Code for KC contributors: John Rake, John Kary, Paul Barham (see [Contributors](https://github.com/codeforkansascity/I-Got-Mine/graphs/contributors?from=2016-04-17&to=2016-08-18&type=c))

* Asssociate Members:  Samantha Hughes, Marquita Leverette, Bill Snook, and Denesha Snell (Kansas City, MO Health Department)

## What we need

* See [Issues](https://github.com/codeforkansascity/I-Got-Mine/issues)

## How to help

* Come to [Code for KC HackNights](http://www.meetup.com/KCBrigade/)
* Pick an [issue](https://github.com/codeforkansascity/I-Got-Mine/issues), fork the Repo and fix it.  
