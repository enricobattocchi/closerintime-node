import styles from "./offline.module.css";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>You're offline</h1>
      <p className={styles.text}>
        This page hasn't been cached yet. Connect to the internet and try again,
        or go back to a page you've visited before.
      </p>
      <a href="/" className={styles.link}>
        Go to homepage
      </a>
    </div>
  );
}
