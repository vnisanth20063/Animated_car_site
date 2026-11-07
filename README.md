# ARS Automotive Care – cinematic service website

React + Vite + TypeScript + Tailwind + GSAP ScrollTrigger + Lenis + Framer Motion + React Router. Frontend only.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

## Assets (public/)
| Folder | Contents |
|---|---|
| `videos/1080`, `videos/720` | Service videos, one per service, named by service slug (silent, keyframe every 6 frames for smooth scroll scrubbing) |
| `posters/` | Poster still for every video |
| `comparisons/` | Before/after images (3 pairs, flagged `illustrative` in `src/data/comparisons.ts` until replaced by real ARS photos) |

Videos stay separate files. Only the current and next chapter keep their video loaded.

Service-to-video mapping lives in `src/data/services.ts` (the `slug` is the file name). 15 services are live; **Glass Panels Hard Water Marks** and **Paint Correction** were removed because no videos were supplied.

## Things ARS must supply
- **Contact details** and **final reveal video**: `src/data/site.ts` (placeholders shown until set).
- **Before/after images**: `src/data/comparisons.ts` (placeholders labelled "not an ARS result" until set).
- **Prices**: `src/data/pricing.ts` (services without a price show "Request a quote").
- **Packages**: `src/data/packages.ts`. Only `approved: true` entries show. Drafts are visible at `/packages?preview=drafts`.
- **Service copy** (benefits, process) is draft text based on the footage; ARS should review it.

## Booking and enquiry forms
Nothing is sent anywhere by default; requests are saved to this device and the UI says so. To send them, set `VITE_FORM_ENDPOINT` (any URL that accepts a JSON POST, e.g. a form service) in `.env`.

## Behaviour notes
- Brand intro plays once per session, has a Skip button, and auto-skips after 5s if it cannot start or when reduced motion is on.
- Reduced motion / data saver: the scroll-scrubbed journey is replaced by a normal service grid, and Lenis is off.
- Cart is saved in LocalStorage (`ars-cart-v1`).
- Brand clip check: a few supplied clips show other companies' names on technician clothing. Review before launch.
