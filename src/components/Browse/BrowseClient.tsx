"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { EVENT_TYPES } from "@/lib/types";
import { formatYear } from "@/lib/date-utils";
import { capitalize } from "@/lib/string-utils";
import { getCacheDb } from "@/lib/cache-db";
import { useBrowseData, buildErasFromEvents } from "@/hooks/useBrowseData";
import type { EraData } from "@/hooks/useBrowseData";
import CategoryIcon from "@/components/CategoryIcon";
import styles from "@/styles/Browse.module.css";

interface BrowseClientProps {
  eras: EraData[];
}

export default function BrowseClient({ eras: serverEras }: BrowseClientProps) {
  const router = useRouter();
  const [allEvents, setAllEvents] = useState(() => serverEras.flatMap((e) => e.events));
  const [isOffline, setIsOffline] = useState(false);

  // Track offline state
  useEffect(() => {
    if (!navigator.onLine) setIsOffline(true);
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // Fall back to cached events when server returned nothing (offline)
  useEffect(() => {
    const hasEvents = serverEras.some((e) => e.events.length > 0);
    if (!hasEvents) {
      getCacheDb()
        .then((db) => db.cachedEvents.toArray())
        .then((cached) => {
          if (cached.length > 0) {
            setAllEvents(cached);
          }
        })
        .catch((err) => console.warn("Failed to load cached events for browse:", err));
    } else {
      setAllEvents(serverEras.flatMap((e) => e.events));
    }
  }, [serverEras]);

  // When offline, store event ID and navigate to cached home page
  const handleEventClick = useCallback(
    (e: React.MouseEvent, eventId: number) => {
      if (!isOffline) return; // let normal Link navigation proceed
      e.preventDefault();
      sessionStorage.setItem("pendingEventId", String(eventId));
      window.location.href = "/";
    },
    [isOffline]
  );

  const {
    openEras,
    categoryFilter,
    categoryCounts,
    filteredEras,
    totalFiltered,
    toggleEra,
    toggleCategory,
  } = useBrowseData(allEvents);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Browse by era</h1>
      <p className={styles.subtitle}>
        {categoryFilter
          ? `${totalFiltered} ${categoryFilter} events across history.`
          : `Explore ${totalFiltered} events across history.`}
        {" "}Click an event to add it to your timeline.
      </p>
      <div className={styles.chips}>
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            className={`${styles.chip}${categoryFilter === type ? ` ${styles.chipActive}` : ""}`}
            onClick={() => toggleCategory(type)}
            aria-pressed={categoryFilter === type}
            title={capitalize(type)}
          >
            <CategoryIcon type={type} size={16} />
            <span>{capitalize(type)} ({categoryCounts.get(type) || 0})</span>
          </button>
        ))}
      </div>
      <div className={styles.eras}>
        {filteredEras.map((era) => {
          if (era.events.length === 0) return null;
          const isOpen = openEras.has(era.id);
          return (
            <div key={era.id} className={styles.era}>
              <button
                className={styles.eraHeader}
                onClick={() => toggleEra(era.id)}
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
                <div id={`era-${era.id}`} className={styles.eventList} role="list" tabIndex={-1}>
                  {era.events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/${event.id}`}
                      className={styles.eventItem}
                      role="listitem"
                      onClick={(e) => handleEventClick(e, event.id)}
                    >
                      <span className={styles.eventIcon}>
                        <CategoryIcon type={event.type} size={20} />
                      </span>
                      <span className={styles.eventName}>{capitalize(event.name)}</span>
                      <span className={styles.eventYear}>{formatYear(event.year)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.backLink}>
        <Link href="/">&#8592; Back to timeline</Link>
      </div>
    </div>
  );
}
