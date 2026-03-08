"use client";

import { useState, useEffect } from "react";

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function goOffline() { setOffline(true); }
    function goOnline() { setOffline(false); }

    // Check initial state
    if (!navigator.onLine) setOffline(true);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--color-text)",
        color: "var(--color-bg)",
        padding: "8px 20px",
        borderRadius: 8,
        fontSize: "0.85rem",
        fontWeight: 600,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      You're offline — using cached data
    </div>
  );
}
