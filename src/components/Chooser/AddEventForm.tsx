"use client";

import { useState } from "react";
import { currentYear, daysInMonth } from "@/lib/date-utils";
import styles from "@/styles/AddEventForm.module.css";

interface AddEventFormProps {
  onSave: (event: {
    name: string;
    year: number;
    month: number | null;
    day: number | null;
    type: string;
    plural: number;
    link: string | null;
  }) => void;
  onCancel: () => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AddEventForm({ onSave, onCancel }: AddEventFormProps) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [plural, setPlural] = useState(0);
  const [error, setError] = useState("");

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const maxDay =
    year && month
      ? daysInMonth(yearNum, monthNum - 1)
      : 31;

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!year || isNaN(yearNum)) {
      setError("Valid year is required");
      return;
    }
    if (yearNum === 0) {
      setError("Year 0 does not exist");
      return;
    }
    if (yearNum >= currentYear()) {
      setError("Year must be in the past");
      return;
    }

    onSave({
      name: name.trim(),
      year: yearNum,
      month: month ? monthNum : null,
      day: month && day ? parseInt(day) : null,
      type: "personal",
      plural,
      link: null,
    });
  };

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Event name *</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. my birthday"
        />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Year *</label>
          <input
            className={styles.input}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 1990"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Month</label>
          <select
            className={styles.input}
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setDay("");
            }}
            disabled={!year}
          >
            <option value="">--</option>
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Day</label>
          <select
            className={styles.input}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={!month}
          >
            <option value="">--</option>
            {Array.from({ length: maxDay }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Grammar</label>
        <div className={styles.radioGroup}>
          <label className={styles.radio}>
            <input
              type="radio"
              checked={plural === 0}
              onChange={() => setPlural(0)}
            />
            Singular (is)
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              checked={plural === 1}
              onChange={() => setPlural(1)}
            />
            Plural (are)
          </label>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.saveBtn} onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}
