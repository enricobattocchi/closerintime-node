import { useState, useMemo } from "react";
import type { Event } from "@/lib/types";
import { ERAS, groupByEra } from "@/lib/eras";

export interface EraData {
  id: string;
  label: string;
  description: string;
  events: Event[];
}

export function buildErasFromEvents(events: Event[]): EraData[] {
  const groups = groupByEra(events);
  return ERAS.map((era) => ({
    id: era.id,
    label: era.label,
    description: era.description,
    events: groups.get(era.id) || [],
  }));
}

export function useBrowseData(allEvents: Event[]) {
  const [openEras, setOpenEras] = useState<Set<string>>(() => new Set());
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const eras = useMemo(() => buildErasFromEvents(allEvents), [allEvents]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of allEvents) {
      map.set(e.type, (map.get(e.type) || 0) + 1);
    }
    return map;
  }, [allEvents]);

  const filteredEras = useMemo(() => {
    if (!categoryFilter) return eras;
    return eras.map((era) => ({
      ...era,
      events: era.events.filter((e) => e.type === categoryFilter),
    }));
  }, [eras, categoryFilter]);

  const totalFiltered = filteredEras.reduce((sum, e) => sum + e.events.length, 0);

  const toggleEra = (id: string) => {
    setOpenEras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (type: string) => {
    setCategoryFilter(categoryFilter === type ? null : type);
  };

  return {
    openEras,
    categoryFilter,
    categoryCounts,
    filteredEras,
    totalFiltered,
    toggleEra,
    toggleCategory,
  };
}
