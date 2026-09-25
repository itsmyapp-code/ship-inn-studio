# The Ship Inn Porlock Weir - Analytics & Event Tracking Guide

This guide documents every custom event tracked across the website, where it originates, and how it appears in the **Vercel Analytics** dashboard (under the **Events** tab).

---

## 1. Events Catalog

| Event Name in Dashboard | What Fires It | Key Data Recorded |
| :--- | :--- | :--- |
| **`Phone Call Click`** | Visitor clicks any telephone link (`tel:`) | `location` *(header, footer, contact page, rooms CTA)*, `phone` |
| **`Direct Email Click`** | Visitor clicks any email link (`mailto:`) | `location` *(footer, contact page, legal pages)*, `email` |
| **`Google Maps Directions Click`** | Visitor clicks to open Google Maps directions | `location`, `destination: "TA24 8PB"` |
| **`Hero CTA Click`** | Visitor clicks hero buttons (*"From the Cabins"* or *"Contact us"*) | `button_name`, `target_url` |
| **`Rooms Feature Click`** | Visitor clicks the *"Explore Our Rooms"* card on the Homepage | `target_url: "/rooms"` |
| **`Pub & Restaurant Feature Click`** | Visitor clicks the *"View Food & Menus"* card on the Homepage | `target_url: "/food-drink"` |
| **`Things to Do Feature Click`** | Visitor clicks the *"Discover Things to Do"* card on the Homepage | `target_url: "/things-to-do"` |
| **`Menu PDF Click`** | Visitor clicks to open or download any PDF menu on Food & Drink | `menu_title` *(e.g. Lunch, Evening, Sunday Roast, Wine List)*, `menu_url` |
| **`Promo Banner Click`** | Visitor clicks the **Saturday BBQ / Braai** banner or button | `promo_name`, `target_url` |
| **`Article Click`** | Visitor clicks an Upcoming Event card or Latest News article | `content_type` *(event / news)*, `title`, `slug` |
| **`Gallery Interaction`** | Visitor clicks a category filter button or opens a photo lightbox | `action` *(filter / lightbox_open)*, `label` |
| **`Contact Form Submission`** | Visitor submits the main contact enquiry form | `enquiry_type` *(room booking, table, general)*, `has_phone` |
| **`Newsletter Signup`** | Visitor subscribes to the newsletter | `page` |

---

## 2. How to Read Your Vercel Analytics Dashboard

1. **Events Overview Table**: Displays total count and unique visitors for each event over any selected timeframe (*24h, 7d, 30d, etc.*).
2. **Drill Down**: Click any specific event to filter the entire dashboard to only the traffic that took that action.
3. **Property Insights**: Expand event rows to inspect properties such as which menu was clicked most or which contact enquiry types were submitted.

---

## 3. Key Metrics to Watch

* **Direct Lead Volume**: `Phone Call Click` + `Contact Form Submission` + `Direct Email Click`.
* **Menu Interest**: `Menu PDF Click` breakdown shows food and drink preferences before arrival.
* **Stay vs Dine Traffic**: Compare `Rooms Feature Click` vs `Pub & Restaurant Feature Click`.
