"use client";

import { useState, useRef, useEffect } from "react";
import type { Event } from "@/lib/types";
import { formatYear } from "@/lib/date-utils";
import CategoryIcon from "@/components/CategoryIcon";
import { SearchIcon, AddCircleOutline, CloseIcon, DeleteIcon } from "@/components/Icon";
import styles from "@/styles/Chooser.module.css";

interface EventAutocompleteProps {
  events: Event[];
  selectedIds: number[];
  value: Event | null;
  onSelect: (event: Event) => void;
  onClear: () => void;
  isLocal?: boolean;
  onDelete?: () => void;
  onAdd?: () => void;
  showingAddForm?: boolean;
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesQuery(event: Event, query: string): boolean {
  const tokens = tokenize(query);
  const searchable = `${event.name} ${event.year} ${event.type}`.toLowerCase();
  return tokens.every((t) => searchable.includes(t));
}

function getRandomEvents(events: Event[], count: number): Event[] {
  const copy = [...events];
  const result: Event[] = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export default function EventAutocomplete({
  events,
  selectedIds,
  value,
  onSelect,
  onClear,
  isLocal,
  onDelete,
  onAdd,
  showingAddForm,
}: EventAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [randomEvents] = useState(() => getRandomEvents(events, 10));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (value) {
    return (
      <div className={styles.inputWrapper}>
        <span className={styles.selectedIcon}>
          <CategoryIcon type={value.type} size={20} />
        </span>
        <input
          className={styles.input}
          disabled
          value={`${value.name} \u2013 ${formatYear(value.year)}`}
        />
        {value.link && (
          <a
            href={value.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
            aria-label="Wikipedia article"
            title="Wikipedia article"
          >
            <img src="/icons/wikipedia-w.svg" alt="Wikipedia" width={18} height={18} />
          </a>
        )}
        {isLocal && onDelete && (
          <button
            className={styles.deleteButton}
            onClick={onDelete}
            aria-label="Delete local event"
            title="Delete this local event"
          >
            <DeleteIcon size={18} />
          </button>
        )}
        <button className={styles.cancelButton} onClick={onClear} aria-label="Remove event">
          <CloseIcon size={18} />
        </button>
      </div>
    );
  }

  const available = events.filter((e) => !selectedIds.includes(e.id));
  const filtered = query
    ? available.filter((e) => matchesQuery(e, query)).slice(0, 10)
    : randomEvents.filter((e) => !selectedIds.includes(e.id)).slice(0, 10);

  return (
    <div className={styles.slot} ref={wrapperRef}>
      <div className={styles.inputWrapper}>
        <span className={styles.selectedIcon}>
          <SearchIcon size={20} />
        </span>
        <input
          className={styles.input}
          placeholder="Search for an event..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {onAdd && (
          <button
            className={styles.addIconButton}
            onClick={onAdd}
            aria-label={showingAddForm ? "Cancel adding event" : "Add your own event"}
            title={showingAddForm ? "Cancel" : "Add your own event"}
          >
            {showingAddForm ? <CloseIcon size={20} /> : <AddCircleOutline size={20} />}
          </button>
        )}
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {filtered.length === 0 ? (
            <div className={styles.noResults}>No events found</div>
          ) : (
            filtered.map((event) => (
              <div
                key={event.id}
                className={styles.option}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(event);
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                <span className={styles.optionIcon}>
                  <CategoryIcon type={event.type} size={20} />
                </span>
                <span className={styles.optionName}>{event.name}</span>
                <span className={styles.optionYear}>
                  {formatYear(event.year)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
