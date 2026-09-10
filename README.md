# Eagle Creek Golf Club and Property Booking Website
A responsive property booking site, built using plain **HTML, CSS, JavaScript**, with **Node.js and Express.js** running the backend.


## What's Inside
- Express server handling all the API routes
- Property API with sorting (`most-popular`, `highest-price`, `lowest-price`) plus a `limit` param
- A small image API (`images`) serving property photos
- Responsive gallery with a modal, swipe support, and next/prev controls
- Image counter + dot indicators that adjust dynamically
- Read More / Collapse for property descriptions
- Hotel Datepicker integration for check-in/check-out selection
- Auto-filled check-in/check-out fields and live total price calculation
- Guest, infant, and pet counters
- Nearby Properties section with its own sorting dropdown
- Favorites saved locally so they survive a page refresh (Consistant in desktop, tablet and mobile view)
- Google Maps markers that sync with the property cards (hover/click both ways)
- Layouts tuned separately for desktop, tablet, and mobile


## Built With
- HTML5 / CSS3 / JavaScript
- Node.js + Express.js
- Google Maps API
- Hotel Datepicker
- Local Storage
- JSON (for the property datasets)


## Before You Start
You'll need these installed:
- Node.js
- npm
- Git

Quick check:
```bash
node -v
npm -v
git --version
```
If not available please install these first.


## Getting It Running

**1. Clone it**
```bash
git clone YOUR_REPOSITORY_URL
cd REPOSITORY_NAME
```

**2. Install packages**
```bash
npm install
```
This pulls in everything from `package.json` and creates `node_modules`. The `package-lock.json` is already in the repo so versions stay consistent for anyone else who clones it.


## Setting Up Environment Variables For Google Map API
The project reads config through `dotenv`. Create a `.env` file in the root.

import this to server.js
```js
import dotenv from "dotenv";
dotenv.config();
```

And keep the Google map API to this variable in .env file
```env
GOOGLE_MAPS_API_KEY = xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Backend exposes it through:
```
GET /api/maps-key
```

and the frontend fetches it from there when loading the map.


## Hotel Datepicker

Date selection is handled by the **Hotel Datepicker** library as a module.
Install Datepicker with:
```
npm i hotel-datepicker
```


## Folder Layout

```
project-folder/
│
├── data/
│   ├── most_popular.json
│   ├── highest_price.json
│   └── lowest_price.json
│
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── map.js
│   ├── getproperties.js
│   ├── favorite.js
│   ├── datepicker.js
│   ├── description.js
│   ├── gallery.js
│   ├── icons/
│   ├── hotel-datepicker.css
│   └── images/
│
├── .env
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── src/
   └── server.js
```

- `data/` — property datasets
- `public/` — everything the frontend needs
- `images/` — images for API
- `server.js` — Express server + API routes


## Running It

```bash
npm start
```

or, if you'd rather run it directly:
```bash
node src/server.js
```

Then open this link in your local browser:
```
http://localhost:3000
```


## Property API

**`GET /get-property`**

This end points accep the following Query params:
- `most-popular`
- `highest-price`
- `lowest-price`
- `limit`

Examples:
```
/get-property?most-popular=true
/get-property?highest-price=true
/get-property?lowest-price=true
/get-property?most-popular=true&limit=4
```
This parameters returns the data from (most_popular.json, highest_price.json, lowest_price.json) with appropriate limit rates.


## Image API

**`GET /images`**
There are 10 property images sitting in the images folder. Hitting this route returns their paths as a plain array:
```json
[
    "/images/image1.jpg",
    "/images/image2.jpg"
]
```


## The Gallery
Clicking **View All Images** pops open a modal that pulls images from `/images`. From there you get:

- Smooth scrolling through images
- Close via the ✕ button, clicking outside, or hitting Escape
- Background stays fixed on desktop so the page doesn't jump
- Next/prev arrows, plus swipe gestures on mobile and tablets smoothly
- An image counter and up to five dynamiclally changing dot indicators on tablet/mobile


## Description Section

Property descriptions expand with **Read More** button and collapsed with a **Read Less** button. Expanding or collapsing the section don't break DOM elements.


## Date Picker (Booking & Date Selection)

- Implemented through Hotel Datepicker Library
- Selected Date range automatically populate to the ```check-in``` and ```check-out``` fields
- Initial price is set to ```$2026```
- checking the guest field open a modal
- Past dates are disabled
- ```Total Price`` automatically calculated and updated based on selected range.
- Check-out has to be at least a day after check-in — no single-day bookings
- Check-in/check-out fields fill in automatically once you pick a range
- Total updates live based on how many nights you've selected
- Guest count can't go below 1
- Guests, infants, and pets are all managed through a separate guest modal


## Nearby Properties

A dropdown lets you switch between:

- Most Popular *(default)*
- Highest Price
- Lowest Price

Each option triggers a fresh call to `/get-property` and refreshes the list. How many show up depends on screen size:
| Device  | Properties shown |
|---------|-------------------|
| Desktop | 6                 |
| Tablet  | 4                 |
| Mobile  | 4                 |

Images for these listings are pulled from:

```
https://beta.imgservice.rentbyowner.com/640x300/
```
Example:
```https://beta.imgservice.rentbyowner.com/640x300/villa-te-soro-bed-and-bre-nz-
auckland-bc-4379041-0.jpg```

## Favorites

Tap the heart icon and it toggles red — that property's ID gets saved to Local Storage. Favorites stick around after a refresh and stay consistent no matter which device you're on.


## Google Maps Integration

Markers on the map correspond directly to whatever's showing in Nearby Properties:
- Hover a property card → its marker highlights
- Click a marker → the matching property card highlights

Both directions stay in sync.


## Security Notes

The Maps API key lives only in `.env`, which is excluded from version control:
```gitignore
node_modules/
.env
```


## Troubleshooting

**Missing dependencies?**
```bash
npm install
```

**Maps not loading?** Double-check:
- `.env` actually exists
- `GOOGLE_MAPS_API_KEY` is correct
- The Maps JavaScript API is enabled on your Google Cloud project
- The key isn't over-restricted
- You restarted the server after editing `.env`

**Testing the Property API:**
```
http://localhost:3000/get-property?most-popular=true&limit=6
```
Will show 6 most-popular properties from the ```most_popular.json``` file.

**Testing the Image API:**
```
http://localhost:3000/images
```
Will show 10 image from the ```/images``` folder.

---
<div align="center">

## The End

</div>
---