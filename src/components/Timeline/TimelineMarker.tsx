import type { MarkerData } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import EventAvailable from "@mui/icons-material/EventAvailable";
import styles from "@/styles/Timeline.module.css";

interface TimelineMarkerProps {
  marker: MarkerData;
}

export default function TimelineMarker({ marker }: TimelineMarkerProps) {
  const { event, label } = marker;
  const isNow = event.id === 0;
  const hasLink = !isNow && event.link;

  const circle = (
    <div className={`${styles.markerCircle} ${hasLink ? styles.markerClickable : ""}`}>
      {isNow ? (
        <EventAvailable sx={{ fontSize: 28, color: "white" }} />
      ) : (
        <CategoryIcon
          type={event.type}
          sx={{ fontSize: 28, color: "white" }}
        />
      )}
    </div>
  );

  const info = (
    <div className={`${styles.markerInfo} ${hasLink ? styles.markerClickable : ""}`}>
      <span className={styles.markerDate}>{label}</span>
      <span className={styles.markerName}>{event.name}</span>
    </div>
  );

  if (hasLink) {
    return (
      <a
        href={event.link!}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.marker}
        aria-label={`Read Wikipedia article about ${event.name}`}
      >
        {circle}
        {info}
      </a>
    );
  }

  return (
    <div className={styles.marker}>
      {circle}
      {info}
    </div>
  );
}
