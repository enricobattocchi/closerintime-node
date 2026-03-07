import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.title}>
        #closerintime
      </a>
    </header>
  );
}
