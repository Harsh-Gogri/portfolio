import styles from "./CalloutBox.module.css";

export default function CalloutBox({ type = "note", children }) {
  const allowedTypes = ["insight", "problem", "note"];
  const boxType = allowedTypes.includes(type) ? type : "note";

  return (
    <div className={`${styles.callout} ${styles[boxType]}`}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
