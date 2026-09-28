"use client";

/**
 * Shown when a page can't load its store (SERVER unreachable, store not live at this address, …).
 * Deliberately brand-neutral: at this point we can't know WHOSE shop this is, so it must not wear
 * any template's look or name — least of all show another shop's products (see lib/store.ts).
 */
export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f5f6f8",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: "#1f2328",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <p style={{ fontSize: 44, margin: 0 }} aria-hidden="true">
          🛍️
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "12px 0 8px" }}>This shop is temporarily unavailable</h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5d6270", margin: 0 }}>
          We couldn&rsquo;t load the store just now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 22,
            padding: "11px 22px",
            border: 0,
            borderRadius: 8,
            background: "#1f2328",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
