---
name: verify
description: Build, run and drive the PrimeNest real-estate portal to verify changes end-to-end.
---

# Verifying the Real Estate Portal

## Build & launch

```bash
npm run build            # must pass first
npx next start -p 3100   # production server (background); dev: npm run dev
```

Server is up when `curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/` returns 200 (~1s).

## Data

JSON store materializes `lib/seed.js` → `data/*.json` on first request (gitignored).
**Reset:** delete `data/` and restart. Writes (leads, views, property edits) persist
between runs, so seed-count assertions drift unless you reset first.

## Flows worth driving

- Listings + filters: count cards — `curl -s "localhost:3100/properties?city=Chennai&listingType=sale" | grep -o 'property-card h-100' | wc -l`
  (don't grep visible text like "3 results" — React splits it with HTML comments)
- Detail page: `/properties/1` embeds EMI calculator only for `listingType: sale`; each GET increments `views`
- Lead lifecycle: `POST /api/leads {name, phone, propertyId}` (agentId auto-derived from property) → `PUT /api/leads/:id {status|notes}` → `DELETE`
- Property lifecycle: `POST /api/properties {title, price, city, agentId}` → shows on `/properties` → `PUT {status:"sold"}` → Sold badge on detail → `DELETE` → 404
- Error paths: missing required fields → 400, unknown ids → 404, wrong method → 405

## Gotchas

- Dashboard pages (`/dashboard*`) are client-rendered via DashboardShell (fetches
  `/api/agents`, agent picked in localStorage) — curl only proves 200 + shell HTML;
  real interaction needs a browser
- Maps (Leaflet) and Bootstrap JS load client-side only — not observable via curl
