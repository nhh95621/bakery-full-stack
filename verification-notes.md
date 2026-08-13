# Enhancement Verification Notes

## Implemented

The current branch includes toast feedback for cart and favorite actions, promo-code state and calculations in CartContext/CartDrawer, and product auto-suggest in Header backed by the existing product query.

## Verification

- `pnpm check`: passed with no TypeScript errors.
- `pnpm test`: passed; auth logout and promo-code unit tests passed (4 tests total).
- `pnpm build`: passed; Vite frontend and Express server bundle completed successfully. Vite emitted only a non-blocking chunk-size warning.
- Desktop screenshot at 1280px: global Bodoni Moda styling, header search, hero, categories, and product cards render correctly.
- Tablet screenshot at 768px: navigation, hero, category controls, and two-column product grid render correctly.
- Mobile screenshot at 375px: compact header/menu, hero CTA, wrapped category controls, and single-column product layout render correctly.
- Fixed missing `index.css` import in `client/src/main.tsx` and updated Tailwind 4 stylesheet loading with `@config` plus `@import "tailwindcss"`.
- Removed nested anchor markup from `Header.tsx` to eliminate React DOM nesting warnings.

## Header Layout Refinement

The brand has been moved to a centered standalone row above the navigation, search, and account actions. On the 1280px desktop view, the logo is visually separated from “Trang Chủ” by a thin divider and the secondary row maintains a balanced left navigation, centered search, and right actions. At 768px, the compact secondary row preserves navigation and action spacing without collision. At 375px, the centered logo remains on its own row while the favorite, cart, and menu controls occupy the next row with sufficient touch spacing.

`pnpm check` completed successfully after the Header markup update.

## Catalogue, Reviews & Mini-cart Enhancement

- Desktop review confirms the homepage renders the verified-reviews fallback without any seeded or fabricated customer content.
- The product catalogue renders the price-range control and four sorting options on desktop alongside the existing category controls.
- The mini-cart drawer opens from the right with a modal overlay and correct empty-state messaging. It now also supports Escape-to-close, background scroll locking, and keyboard focus containment.
- Browser verification confirms adding Entremet Vanilla Classic updates the cart badge to 1 and produces a success toast. The non-empty drawer correctly shows the selected size, quantity controls, removal action, shipping progress, promo input, shipping fee, subtotal, and total of 280.000₫.
- Increasing the quantity updates the cart badge to 2, recalculates the subtotal to 500.000₫, and switches shipping to the free-shipping state at the configured threshold.
- `pnpm check` passed after the catalogue refactor. `pnpm test` passed with 4 test files and 9 tests, including new price-band and sorting coverage. `pnpm build` passed; Vite reported only a non-blocking chunk-size advisory.
- Final screenshots at 1280px and 375px confirm the verified-reviews empty state, the desktop sidebar/mobile select variants for catalogue controls, and stable single-column product cards on mobile.

## Hồ sơ khách hàng, chuyển tiếp catalogue & gợi ý theo giỏ

- Desktop verification confirms the account area presents private profile metrics, tab navigation, and an empty order state without exposing another account's data.
- Mobile verification confirms the profile metrics stack cleanly, the tab bar remains horizontally reachable, and the catalogue preserves readable controls with single-column product cards at 375px.
- Catalogue filtering and sorting now use layout-preserving entry, exit, and repositioning transitions that honour the user's reduced-motion setting.
- The mini-cart queries the existing catalogue through tRPC and only suggests products excluded from the cart, prioritising the categories already selected by the customer.
- Interactive browser verification confirms that adding Entremet Vanilla Classic updates the badge to 1 and opens a mini-cart containing the “Dành riêng cho bạn” recommendation section for the selected category.
- Final verification: the profile renders its customer header, order/review/favourite tabs and empty order state at desktop width; the catalogue retains its editorial grid and controls. TypeScript check, production build, and 14 unit tests pass after adding protected review access and reduced-motion configuration coverage.
- Source-structure refactor verification: `pnpm verify` passed TypeScript, 14 unit tests and the production build after moving the application into `frontend/` and `backend/`. Desktop captures of the homepage and catalogue rendered successfully from the restarted server.
- After the final restart, direct requests to `/` and `/products` completed successfully. The latest server-log slice generated after those requests contains no new `/src/main.tsx`, `client/`, Vite pre-transform, module-resolution, or HTML-path error; the only matching line is historical and predates the final restart.
- API feedback and profile UX verification: the authenticated account page now completes its protected data requests and renders the account header, zero-count order/review/favourite tabs, and a clear empty order-history state rather than a persistent loader. The catalogue renders category navigation, price-range controls, sorting, search and the product grid at desktop width.
- Mobile verification at 375px: the profile card, counters, horizontally reachable tabs and empty-order state remain legible; the catalogue preserves compact category, price and sort controls with a single-column product grid and no horizontal overflow.

## API Feedback, Profile Query Guard & Vite Runtime Recovery

- `pnpm check` completed with no TypeScript errors; `pnpm test` passed **10 test files / 21 tests**, including new coverage for feedback copy, retry presentation tokens, protected-profile query gating, rendered loading/error feedback, and a customer retry click; `pnpm build` completed successfully. The build emitted only Vite's non-blocking chunk-size advisory.
- The `ApiFeedback` component now sources its loading labels, retry label and contrast-specific tokens from tested helpers. Account data queries remain disabled while authentication is resolving or no user is authenticated, preventing private profile requests from starting prematurely.
- After the 02:37 UTC+7 restart, direct browser requests to `/` and `/products` both rendered successfully. The post-restart log slice contains the server-ready marker and subsequent requests, with **no** `ENOENT`, `frontend/index.html`, `/src/main.tsx`, or Vite pre-transform error entries.
- The component test verifies that `ApiLoading` exposes the active loading context, `ApiError` exposes the error copy and its retry button invokes `onRetry`; the profile retry helper separately verifies that only the query for the active tab is refetched.
