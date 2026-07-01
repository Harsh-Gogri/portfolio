import styles from "./CalloutBox.module.css";
import SuccessIcon from "@/components/icons/SuccessIcon";
import WarnIcon from "@/components/icons/WarnIcon";
import InfoIcon from "@/components/icons/InfoIcon";

const ICONS = {
  insight: SuccessIcon,
  problem: WarnIcon,
  note: InfoIcon,
};

export default function CalloutBox({ type = "note", title, children }) {
  const allowedTypes = ["insight", "problem", "note"];
  const boxType = allowedTypes.includes(type) ? type : "note";
  const Icon = ICONS[boxType];

  return (
    <div className={`${styles.callout} ${styles[boxType]}`}>
      <Icon className={styles.icon} />
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}