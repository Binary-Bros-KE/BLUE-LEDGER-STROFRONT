<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blue Ledger Storefront

Multi-tenant e-commerce storefront. **One deployment serves every tenant's shop.**
The tenant is resolved per-request from the incoming `Host` (forwarded to the
SERVER `/shop` API as `X-Shop-Domain`); there is never per-tenant code or config
in this app.

See `../../ECOMMERCE-ARCHITECTURE.md` for the full design.

**Status:** P0 scaffold. `src/lib/` (API client + tenant resolution) is real;
`src/app/page.tsx` is a throwaway diagnostic placeholder. The real UI is pending
a design from the client — do not build storefront pages until that lands.
