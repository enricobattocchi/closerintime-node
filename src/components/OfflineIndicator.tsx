"use client";

import { useState, useEffect } from "react";
import { WifiOffIcon } from "./Icon";

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) setOffline(true);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <span
      role="status"
      aria-label="You are offline"
      title="No internet connection"
      style={{
        position: "absolute",
        right: 16,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <WifiOffIcon size={20} />
    </span>
  );
}
