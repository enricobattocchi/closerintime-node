"use client";

import type { MarkerData, SegmentData } from "@/lib/types";
import TimelineMarker from "./TimelineMarker";
import TimelinePart from "./TimelinePart";
import styles from "@/styles/Timeline.module.css";
import { Fragment } from "react";

interface TimelineProps {
  markers: MarkerData[];
  segments: SegmentData[];
}

export default function Timeline({ markers, segments }: TimelineProps) {
  if (markers.length === 0) {
    return <div className={styles.empty} />;
  }

  return (
    <div className={styles.timeline}>
      {markers.map((marker, i) => (
        <Fragment key={marker.event.id}>
          <TimelineMarker marker={marker} />
          {i < segments.length && <TimelinePart segment={segments[i]} />}
        </Fragment>
      ))}
    </div>
  );
}
