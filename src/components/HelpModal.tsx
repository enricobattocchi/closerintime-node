"use client";

import { useEffect } from "react";
import {
  AccountBalance, MusicNote, Movie, Domain, MenuBook,
  ScienceIcon, PaletteIcon, MemoryIcon, SportsSoccer,
  LiveTv, AccountCircle,
} from "@/components/Icon";
import styles from "@/styles/HelpModal.module.css";

interface HelpModalProps {
  onClose: () => void;
}

const categories = [
  { icon: AccountBalance, label: "history" },
  { icon: MusicNote, label: "music" },
  { icon: MemoryIcon, label: "computer" },
  { icon: PaletteIcon, label: "art" },
  { icon: Movie, label: "film" },
  { icon: Domain, label: "building" },
  { icon: ScienceIcon, label: "science" },
  { icon: MenuBook, label: "book" },
  { icon: SportsSoccer, label: "sport" },
  { icon: LiveTv, label: "pop culture" },
  { icon: AccountCircle, label: "personal" },
];

export default function HelpModal({ onClose }: HelpModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>How it works</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.description}>
            Visualize the time between historical events.
          </p>
          <p>
            Pick up to three events by typing in the search fields. You can
            search by name, year, or category:
          </p>
          <ul className={styles.categories}>
            {categories.map(({ icon: Icon, label }) => (
              <li key={label} className={styles.category}>
                <Icon size={20} className={styles.categoryIcon} />
                {label}
              </li>
            ))}
          </ul>
          <p>
            After you&apos;ve chosen your events, the timeline will update to
            show the proportional timespans between them and now.
          </p>
          <p>
            You can add your own personal events (e.g. your birthday) using the{" "}
            <strong>+</strong> button. They are stored locally in your browser
            and not shared with anyone.
          </p>
          <p>
            The dates chosen for some events may be approximate when precise
            dating is not possible. Click an event on the timeline to read its
            Wikipedia article and learn more.
          </p>
        </div>
        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
