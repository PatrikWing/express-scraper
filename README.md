# Simple proof-of-concept https://blocket.se scraper
Express web server providing a post endpoint /blocket for scraping https://blocket.se with pupppeteer.
Provide a valid blocket location, e.g. "stockholm" and a search string, e.g. "soffa", in the body.
Returns an array with titel, price, img, link to article of the few first page results.

## Requirements
Requires node and npm.

## Install dependencies
$ npm install

## Start server
$ npm start
