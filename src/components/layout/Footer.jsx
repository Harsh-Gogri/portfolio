import styles from "./Footer.module.css";

const ArrowUpRight = () => (
  <svg
    className={styles.arrowIcon}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2 10L10 2M10 2H4M10 2V8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const links = [
  { label: "Resume", href: "https://drive.google.com/file/d/14ebr_kMmzX6JKkYjU_qsFgegCBndgrbM/view" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harshgogri02/" },
  { label: "Schedule a call", href: "https://cal.com/harshgogri/15min" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top two-column row */}
        <div className={styles.topRow}>
          {/* Left */}
          <div className={styles.left}>
            <h2 className={styles.heading}>
              Crafted with{" "}
              <em className={styles.accent}>care</em>
            </h2>
            <div className={styles.contact}>
              <span className={styles.contactLabel}>Get in touch</span>
              <a
                href="mailto:gogriharsh1@gmail.com"
                className={styles.email}
              >
                gogriharsh1@gmail.com
                <ArrowUpRight />
              </a>
            </div>
          </div>

          {/* Right */}
          <nav className={styles.right} aria-label="Footer navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.navLink}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.label}
                <ArrowUpRight />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Watermark bottom bar */}
      <div className={styles.watermarkBar} aria-hidden="true">
        <span className={styles.watermarkText}>Harsh Gogri</span>
      </div>
    </footer>
  );
}
