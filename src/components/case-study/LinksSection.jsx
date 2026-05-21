import styles from "./LinksSection.module.css";

export default function LinksSection({ links = [] }) {
  return (
    <div className={styles.wrapper}>
      {links.map((link, index) => (
        <span key={link.href}>
          <a href={link.href} className={styles.link} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
          {index < links.length - 1 && (
            <span className={styles.separator}> | </span>
          )}
        </span>
      ))}
    </div>
  );
}
