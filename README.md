# PrimeNest — Real Estate Portal

A full-featured real estate portal built with **Next.js 14 (pages router)** and **Bootstrap 5**.

## Features

- **Property listings** — search, filter (city, type, buy/rent, beds, budget), sort, grid & map views
- **Property details** — image gallery with lightbox, spec chips, amenities, similar properties
- **Image gallery** — thumbnails, full-screen lightbox with keyboard navigation
- **Maps** — Leaflet + OpenStreetMap (no API key needed), single-property and multi-marker result maps
- **Loan calculator** — EMI calculator (INR, lakh/crore formatting) with down payment, rate and tenure sliders, principal-vs-interest split and year-wise amortization schedule; embedded on sale listings and as a standalone page
- **Agent dashboard** — KPI tiles (listings, views, new leads, closed deals), lead pipeline, top listings, agent switcher (demo stand-in for login)
- **Listing management** — add / edit / delete properties, mark sold, featured flag
- **Lead management** — enquiry form on every listing feeds a pipeline (New → Contacted → Site Visit → Negotiation → Closed/Lost) with inline status updates, agent notes, search and filters
- **Agents directory** — profiles with ratings, specializations and listing links

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Data

Demo data lives in `lib/seed.js` and is materialized into `/data/*.json` on first
run (the `data/` folder is gitignored). All reads/writes go through `lib/store.js`,
so the JSON store can be swapped for MySQL / Cloudflare D1 without touching the
API routes.

To reset the demo data, delete the `data/` folder and restart the dev server.

## Structure

```
components/    Layout, PropertyCard, ImageGallery, MapView, LoanCalculator,
               LeadForm, DashboardShell
lib/           seed.js (demo data), store.js (JSON store), format.js (INR, statuses)
pages/         index, properties (list + [id]), agents, calculator,
               dashboard (overview, properties, leads)
pages/api/     REST endpoints: /api/properties, /api/leads, /api/agents
```

> Demo application — listings, agents and leads are sample data.
