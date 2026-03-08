import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.title}>
        #closerintime
      </a>
      <nav className={styles.nav}>
        <a href="/browse" className={styles.navLink}>Browse</a>
      </nav>
    </header>
  );
}
