"use client";

import { useEffect } from "react";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isExternalUrl(url: string): boolean {
  try {
    const link = new URL(url, window.location.origin);
    return link.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export default function ExternalLinkHandler() {
  useEffect(() => {
    if (!isStandalone()) return;

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !isExternalUrl(href)) return;

      e.preventDefault();
      window.open(href, "_blank");
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
