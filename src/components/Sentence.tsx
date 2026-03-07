import styles from "@/styles/Sentence.module.css";

interface SentenceProps {
  text: string;
  href: string;
}

export default function Sentence({ text, href }: SentenceProps) {
  if (!text) return null;

  return (
    <div className={styles.container}>
      <a href={href} className={styles.sentence}>
        {text}
      </a>
    </div>
  );
}
