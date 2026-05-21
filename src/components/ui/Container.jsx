import styles from "./Container.module.css";

export default function Container({ className = "", children }) {
  const containerClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return <div className={containerClassName}>{children}</div>;
}
