"use client";

import { useState, useCallback } from "react";
import { ContentCopy, DownloadIcon } from "@/components/Icon";
import styles from "@/styles/Sentence.module.css";

interface SentenceProps {
  text: string;
  href: string;
  onExport?: () => void;
}

export default function Sentence({ text, href, onExport }: SentenceProps) {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = window.location.origin + href;
    await navigator.clipboard.writeText(url);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, [href]);

  if (!text) return null;

  return (
    <div className={styles.container}>
      <a href={href} className={styles.sentence}>
        {text}
      </a>
      <button
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label="Copy link"
        title="Copy link"
        data-hide-on-export
      >
        <ContentCopy size={18} />
      </button>
      {onExport && (
        <button
          className={styles.copyButton}
          onClick={onExport}
          aria-label="Download as image"
          title="Download as image"
          data-hide-on-export
        >
          <DownloadIcon size={18} />
        </button>
      )}
      {showToast && <div className={styles.toast}>Link copied!</div>}
    </div>
  );
}
