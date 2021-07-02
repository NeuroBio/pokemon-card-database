# Pokemon Card Database

## App Link
https://carddatabase-6dfef.web.app/

## Overview
This is a personal project to organize my pokemon cards and show off my Angular skills in a compact app.  Previously, I used a series of Google sheets to keep track of my card collection.  This was problematic for several reasons:

1. Cards had to be tracked in multiple places; if I got a new card in my series, I would have to manually add it to my series checklist, my binder collection list, and my master list.
2. Adding images for thousands of cards to google sheets was not going to be feasible.
3. The database had noticeable errors and inconsistencies, including typos and incorrect print numbers.

## Adding and Handling Card Data
My new app allows me to upload cards based on card expansion and print number (reducing typoes and errors).  The rest of the card's data is referenced from a list of set expansions (again reducing errors, time spent filling out repetitive data, and the amount of stored data).  The card uploader allows me to add photos of the front and back of each card, resizes them, and provides a preview in the browser prior to upload (adding images to my collection data).  There is a new standardized format for tracking flaws in the card quality.  Uploaded cards are displayed automatically in the Masterlist, but I can also make checklists.

Each checklist consists of an ordered set of card types in one of three states: 1) no card instances of a card type (none), 2) card instance that matches that card type (have), or 3) card instances that does not match the card type (placeholder).  When a checklist is made, I can populate it with card instances by either picking a card instance for a card type or by allowing the app to pick out what it thinks is the best card to associate with that card type (if an appropriate card exists).  I can also tell the list to check for new cards to put into none slots on click.  Because I only have to add the reference to an existing card for these checklists, rather than recreating the data for a card, I can more quickly manage my collection. To add a new expansion to the list of set expansions, I upload a .csv of the card names, types, and rarities taken from Bulbepedia.com.  The app parses the file into a set of cards, and ensures that special characters are handled correctly (e.g. reformats Nidoran(m) to Nidoran♂).

Card titles are used to match a pokemon card to its pokedex number, but some cards have special modifies in their card title (e.g. Dark Dragonite or Lapras gx). To account for this, I am using RegEx to split the card title on white space except in special cases.  The special cases include ". " (Mr. Mime), ": " (Type: Null), and "Tapu " (Tapu Koko, Tapu Bulu, Tapu Fini, and Tapu Lele), which are handled with: `RegExp('(?<![\\.:]|.*Tapu)\\s')`.

## Collection-Specific Problems and Solutions

### Set Completion
I often wonder how many cards I have for a specific expansion (bulk), how much of the set I have completed, and which cards I am missing and their rarities.  Previously, I would download my google sheets as excel files, filter the sheets, and use sort and sum to get this information.  This was an unwieldy manual process.  Now, I have a section in the app that calculates this information on request and displays it.

### Binder View
When organizing my binder collection, I put a lot of thought into which cards to include in the binder and where.  In general, I like to keep all cards for one pokemon and it's evolutions on one page or across two adjacent pages when possible, and I always order pokemon by their national pokedex number.  It is very difficult to keep track of how additions or removal of individual card will affect the organization of the binder at large without taking all of the cards out of the binder and arranging them manually.  I created binder view so I can add, remove, or move around cards in a checklist and then view how this would affect binder organization without having to touch my physical binders.

### Fetching Expansion Data
Manually copying and cleaning set list data from Bulbapedia was time consuming, error prone, and frustrating.  To simplify this step, I wrote a python script that makes a call to the WIkiMedia APIs to get the html code for a set/card list table from a specified expansion or subset.   The code then removes unnecessary html to yeild just the table rows for the first table in the section, which is always the main set for the English expansion.  Rows were then parsed to retrieve the card title, type, rarity, and any special information about its print number (e.g. Alph Lithographs are numbered as ONE, TWO, ect instead of numerically).  A number of special cases that modify the card type, rarity, or title are handled, and explained in comments in the script.  Once the data is cleaned, it is output as a csv file for manual loading onto the website.  In the future, I would like figure out how to automate the load step as well.

## Summary
The app has increased the amount of data I can display for each card and made collection management faster and easier.  In the future, I plan to make new item-specific versions of this app to help my family organize their stamp, ornament, and shell collections.

## Implemented Techniques, Tools, and Features
* Angular 11
* Angular Materials
* Firebase and Angularfire
* ngLint for code quality control
* Custom Fonts
* APP_INITIALIZER for prefetching data
* OAUTH with Google as a provider
* Google cloud platform for cloud functions and managing and restricting api keys
* Reactive forms with CRUD services for updating firestore and storage data
* live updating
* sub modules and reused components
* RegEx
* rxjs and rxjs operators: tap, map, switchmap, forkjoin, take, skip, skipWhile, of, catchError, finalize, Observable, BehaviorSubject, Subscription
* routing, resolvers, and lazy-loaded modules
* cacheing with soft deletes and local storage to reduce read counts on firebase; only changed data is requested from the server; cache expires after 12 hours
* Google cloud function written in `Python 3.8` to handle hard deletes on a scheduled interval (once per day, clears out soft deletes that are at least 12 hours old).  [Function source](src/assets/cloud%20functions/main.py).
* card instances that are deleted but referenced in a checklist are automatically removed from the checklist on next load
* checklists can be told to seek out cards to fill empty slots on button click
* expansion data is fetched from Bulpapedia and automatically cleaned into the correct formatting using `Python 3.8`.  [Api caller source](src/api_caller/get_expansion.py)
and [api call functions source](src/api_caller/get_expansion_functions.py).

### Next Task
* add custom icon
* add custom illustrations for the background to add some interest to the empty blue space

### Planned Tasks
* unit tests with Jasmine
