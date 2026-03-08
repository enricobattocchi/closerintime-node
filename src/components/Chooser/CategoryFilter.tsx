import { useMemo } from "react";
import type { Event } from "@/lib/types";
import { EVENT_TYPES } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import styles from "@/styles/Chooser.module.css";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
  events: Event[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CategoryFilter({ selected, onSelect, events }: CategoryFilterProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) {
      map.set(e.type, (map.get(e.type) || 0) + 1);
    }
    return map;
  }, [events]);

  return (
    <div className={styles.categoryChips}>
      {EVENT_TYPES.map((type) => (
        <button
          key={type}
          className={`${styles.categoryChip}${selected === type ? ` ${styles.categoryChipActive}` : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(selected === type ? null : type);
          }}
          aria-pressed={selected === type}
          title={capitalize(type)}
        >
          <CategoryIcon type={type} size={16} />
          <span>{capitalize(type)} ({counts.get(type) || 0})</span>
        </button>
      ))}
    </div>
  );
}
