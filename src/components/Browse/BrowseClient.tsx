"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";
import { formatYear } from "@/lib/date-utils";
import CategoryIcon from "@/components/CategoryIcon";
import styles from "@/styles/Browse.module.css";

interface EraData {
  id: string;
  label: string;
  description: string;
  events: Event[];
}

interface BrowseClientProps {
  eras: EraData[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function BrowseClient({ eras }: BrowseClientProps) {
  const [openEras, setOpenEras] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) => {
    setOpenEras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Browse by era</h1>
      <p className={styles.subtitle}>
        Explore {eras.reduce((sum, e) => sum + e.events.length, 0)} events across history.
        Click an event to add it to your timeline.
      </p>
      <div className={styles.eras}>
        {eras.map((era) => {
          const isOpen = openEras.has(era.id);
          return (
            <div key={era.id} className={styles.era}>
              <button
                className={styles.eraHeader}
                onClick={() => toggle(era.id)}
                aria-expanded={isOpen}
                aria-controls={`era-${era.id}`}
              >
                <div className={styles.eraInfo}>
                  <span className={styles.eraLabel}>{era.label}</span>
                  <span className={styles.eraDescription}>{era.description}</span>
                </div>
                <span className={styles.eraCount}>{era.events.length} events</span>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
                  &#9662;
                </span>
              </button>
              {isOpen && (
                <div id={`era-${era.id}`} className={styles.eventList} role="list">
                  {era.events.map((event) => (
                    <a
                      key={event.id}
                      href={`/${event.id}`}
                      className={styles.eventItem}
                      role="listitem"
                    >
                      <span className={styles.eventIcon}>
                        <CategoryIcon type={event.type} size={20} />
                      </span>
                      <span className={styles.eventName}>{capitalize(event.name)}</span>
                      <span className={styles.eventYear}>{formatYear(event.year)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.backLink}>
        <a href="/">&#8592; Back to timeline</a>
      </div>
    </div>
  );
}
