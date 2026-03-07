"use client";

import { useState } from "react";
import type { TimespanFormat } from "@/lib/types";
import styles from "@/styles/Settings.module.css";

interface SettingsModalProps {
  timespanFormat: TimespanFormat;
  onSave: (format: TimespanFormat) => void;
  onClose: () => void;
}

export default function SettingsModal({
  timespanFormat,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [format, setFormat] = useState<TimespanFormat>(timespanFormat);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Settings</h3>
        <fieldset className={styles.fieldset}>
          <legend>Timespan format</legend>
          <label className={styles.radio}>
            <input
              type="radio"
              name="format"
              checked={format === 0}
              onChange={() => setFormat(0)}
            />
            Days
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="format"
              checked={format === 1}
              onChange={() => setFormat(1)}
            />
            Years only
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="format"
              checked={format === 2}
              onChange={() => setFormat(2)}
            />
            Precise (years, months, days)
          </label>
        </fieldset>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={() => {
              onSave(format);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
