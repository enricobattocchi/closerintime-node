"use client";

import { useState, useEffect, useCallback } from "react";
import type { Submission } from "@/lib/types";
import styles from "@/styles/Admin.module.css";

const EVENT_TYPES = [
  "art", "book", "building", "computer", "film",
  "history", "music", "pop culture", "science", "sport",
];

interface SubmissionWithKey extends Submission {
  key: string;
}

export default function SubmissionReview() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionWithKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [edits, setEdits] = useState<Record<string, Partial<SubmissionWithKey>>>({});

  const getEdited = (sub: SubmissionWithKey) => ({
    ...sub,
    ...edits[sub.key],
  });

  const setField = (key: string, field: string, value: string | number | null) => {
    setEdits((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const fetchSubmissions = useCallback(async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setAuthenticated(false);
        setError("Invalid token");
        sessionStorage.removeItem("adminToken");
        return;
      }
      const data = await res.json();
      setSubmissions(data);
    } catch {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("adminToken");
    if (saved) {
      setToken(saved);
      setAuthenticated(true);
      fetchSubmissions(saved);
    }
  }, [fetchSubmissions]);

  const handleLogin = () => {
    if (!token.trim()) return;
    sessionStorage.setItem("adminToken", token);
    setAuthenticated(true);
    fetchSubmissions(token);
  };

  const handleAction = async (key: string, action: "approve" | "reject") => {
    const overrides = edits[key] || {};
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key, action, ...overrides }),
    });

    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.key === key ? { ...s, status: action === "approve" ? "approved" : "rejected" } : s
        )
      );
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin</h1>
        <div className={styles.loginForm}>
          <input
            className={styles.input}
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const processed = submissions.filter((s) => s.status !== "pending");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Submissions</h1>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {pending.length === 0 && !loading && <p className={styles.empty}>No pending submissions.</p>}

      {pending.map((sub) => {
        const edited = getEdited(sub);
        return (
          <div key={sub.key} className={styles.card}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Name</label>
              <input
                className={styles.fieldInput}
                value={edited.name}
                onChange={(e) => setField(sub.key, "name", e.target.value)}
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Year</label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  value={edited.year}
                  onChange={(e) => setField(sub.key, "year", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Month</label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min="0"
                  max="12"
                  value={edited.month ?? ""}
                  onChange={(e) => setField(sub.key, "month", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="--"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Day</label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min="0"
                  max="31"
                  value={edited.day ?? ""}
                  onChange={(e) => setField(sub.key, "day", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="--"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Type</label>
                <select
                  className={styles.fieldInput}
                  value={edited.type}
                  onChange={(e) => setField(sub.key, "type", e.target.value)}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Plural</label>
                <select
                  className={styles.fieldInput}
                  value={edited.plural}
                  onChange={(e) => setField(sub.key, "plural", parseInt(e.target.value))}
                >
                  <option value={0}>no (is)</option>
                  <option value={1}>yes (are)</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Link</label>
              <input
                className={styles.fieldInput}
                value={edited.link}
                onChange={(e) => setField(sub.key, "link", e.target.value)}
              />
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.approveBtn}
                onClick={() => handleAction(sub.key, "approve")}
              >
                Approve
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => handleAction(sub.key, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}

      {processed.length > 0 && (
        <>
          <h2 className={styles.subtitle}>Processed</h2>
          {processed.map((sub) => (
            <div key={sub.key} className={`${styles.card} ${styles.processed}`}>
              <div className={styles.cardHeader}>
                <strong>{sub.name}</strong>
                <span className={sub.status === "approved" ? styles.approved : styles.rejected}>
                  {sub.status}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
