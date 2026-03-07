"use client";

import AccountBalance from "@mui/icons-material/AccountBalance";
import MusicNote from "@mui/icons-material/MusicNote";
import Movie from "@mui/icons-material/Movie";
import Domain from "@mui/icons-material/Domain";
import MenuBook from "@mui/icons-material/MenuBook";
import Science from "@mui/icons-material/Science";
import Palette from "@mui/icons-material/Palette";
import Memory from "@mui/icons-material/Memory";
import SportsSoccer from "@mui/icons-material/SportsSoccer";
import LiveTv from "@mui/icons-material/LiveTv";
import AccountCircle from "@mui/icons-material/AccountCircle";
import styles from "@/styles/HelpModal.module.css";

interface HelpModalProps {
  onClose: () => void;
}

const categories = [
  { icon: AccountBalance, label: "history" },
  { icon: MusicNote, label: "music" },
  { icon: Memory, label: "computer" },
  { icon: Palette, label: "art" },
  { icon: Movie, label: "film" },
  { icon: Domain, label: "building" },
  { icon: Science, label: "science" },
  { icon: MenuBook, label: "book" },
  { icon: SportsSoccer, label: "sport" },
  { icon: LiveTv, label: "pop culture" },
  { icon: AccountCircle, label: "personal" },
];

export default function HelpModal({ onClose }: HelpModalProps) {
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
                <Icon fontSize="small" className={styles.categoryIcon} />
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
