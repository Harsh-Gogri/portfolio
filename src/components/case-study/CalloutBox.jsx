import styles from "./CalloutBox.module.css";

const ICONS = {
  insight: "/images/assets/icons/success.svg",
  problem: "/images/assets/icons/warn.svg",
  note: "/images/assets/icons/info.svg",
};

export default function CalloutBox({ type = "note", title, children }) {
  const allowedTypes = ["insight", "problem", "note"];
  const boxType = allowedTypes.includes(type) ? type : "note";

  return (
    <div className={`${styles.callout} ${styles[boxType]}`}>
      <img
        src={ICONS[boxType]}
        alt=""
        className={styles.icon}
        aria-hidden="true"
      />
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}