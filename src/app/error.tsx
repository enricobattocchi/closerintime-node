"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Something went wrong</h2>
      <p style={{ color: "var(--color-text-light)", marginBottom: "1.5rem" }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1.5rem",
          backgroundColor: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Try again
      </button>
    </div>
  );
}
