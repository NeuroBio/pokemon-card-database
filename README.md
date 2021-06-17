# CardDatabase

## App Link
https://carddatabase-6dfef.web.app/

## Overview
This is a personal project to organize my pokemon cards and show off my skills in angular in a compact app.  Previously, I used a series of Google sheets to keep track of my card collection.  This was problematic for several reasons:

1) Cards had to be tracked in multiple places; if I got a new card in my series, I would have to manually add it to my series checklist, my binder collection list, and my master list.
2) Adding images for thousands of cards to google sheets was not going to be feasible.
3) The database had noticible errors and inconsistencies, including typos and incorrect print numbers.

My new app allows me to upload cards based on card expansion and print number (reducing typoes and errors).  The rest of the card's data is referenced from a list of set expanions (again reducing errors and decreasing the amount of data that has to be stored).  The card uploader allows me to add photos of the front and back of each card, resizes them, and provides a preview in the browser prior to upload (adding images to my collection data).  There is a new standardized format for tracking flaws in the card quality.  Uploaded cards are displayed automatically in the Masterlist, but I can also make checklists.  Each checklist consists of an ordered set of card types in one of three states:  no card instances of a card type (none), card instance that matches that card type (have), or card instances that does not match the card type (placeholder).  When a checklist is made, I can populate it with card instances by either picking a card instance for a card type or by allowing the app to pick out what it thinks is the best card to associate with that card type (if an appropriate card exists).  I can also tell the list to check for new cards to put into none slots on click.  Because I only have to add the reference to an existing card for these checklists, rather than recreating the data for a card, I can more quickly manage my collection. To add a new expansion to the list of set expansions, I upload a .csv of the card names, types, and rarities taken from Bulbepedia.com.  The app parses the file into a set of cards, and ensures that special characters are handled correctly (e.g. reformats Nidoran(m) to Nidoran♂).  Card titles are used to match a pokemon card to its pokedex number, but some cards have special modifies in their card title (e.g. Dark Dragonite or Lapras gx). To account for this, I am splitting the card title on white space except in special cases.  The special cases include "." (Mr. Mime), ":" (Type: Null), and "Tapu" (Tapu Koko, Tapu Bulu, Tapu Fini, and Tapu Lele). which are handled with regex: `RegExp('(?<![\\.:]|.*Tapu)\\s')`.  In total, the app has increased the amount of data I can display for each card and made collection management faster and easier.

In the future, I plan to make new item-specific versions of this app to help my family organize their stamp, ornament, and shell collections.

## Implemented Techniques, Tools, and Features
* Angular 11
* Angular Materials
* Firebase and Angularfire
* ngLint for code quality
* Custom Fonts
* APP_INITIALIZER for prefetching data
* OAUTH with Google as a provider
* Google cloud platform for cloud functions and managing and restrincting api keys
* Reactive forms with CRUD services for updating firestore and storage data
* live updating
* sub modules and reused components
* regex
* rxjs and rxjs operators: tap, map, switchmap, forkjoin, take, skip, skipWhile, of, catchError, finalize, Observable, BehaviorSubject, Subscription
* routing, resolvers, and lazy-loaded modules
* cacheing with soft deletes and local storage to reduce read counts on firebase; only changed data is requested from the server
* Google cloud functions written in `Python` 3.8 to handle hard deletes on a scheduled interval (once per day, clears out soft deletes that are at least 12 hours old)
* card instances that are deleted but referenced in a checklist are automatically removed from the checklist on next load
* checklists can be told to seek out cards to fill empty slots on button click

## Implementing
* "binder view" for checklists

## Planning to implement
* unit tests with Jasmine
* custom icon
* web scraper or API calls to get expansion data from Bulbepedia
