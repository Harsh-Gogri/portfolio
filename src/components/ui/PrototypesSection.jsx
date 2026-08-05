import Link from "next/link";
import { prototypes } from "@/data/prototypes";
import styles from "./PrototypesSection.module.css";

export default function PrototypesSection() {
  return (
    <section className={styles.prototypesSection} id="prototypes">
      <div className={styles.container}>
        {prototypes.map((item) => (
          <div
            key={item.id}
            className={`${styles.prototypeBlock} ${item.isMirrored ? styles.mirrored : ""}`}
          >
            {/* Cell 1: Prototype Image */}
            <div className={`${styles.cell} ${styles.cellImage}`}>
              <img src={item.image} alt={item.title} className={styles.image} />
            </div>

            {/* Cell 2: Title & Subtitle/Date (aligned bottom) */}
            <div className={`${styles.cell} ${styles.cellTitle}`}>
              <h3 className={styles.title}>{item.title}</h3>
              <span className={styles.subtitle}>{item.subtitle}</span>
            </div>

            {/* Cell 3: Meta info (top: label + name, bottom: smalltext) */}
            <div className={`${styles.cell} ${styles.cellMeta}`}>
              <div className={styles.metaTop}>
                <span className={styles.roleLabel}>{item.roleLabel}</span>
                <span className={styles.roleName}>{item.roleName}</span>
              </div>
              <span className={styles.smallText}>{item.smallText}</span>
            </div>

            {/* Cell 4: Single-line text link 1 (aligned under image column in block 1) */}
            <div className={`${styles.cell} ${styles.cellLink1}`}>
              <Link
                href={item.prevLinkUrl}
                className={styles.textLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.prevLinkText}
              </Link>
            </div>

            {/* Cell 5: Description paragraph text */}
            <div className={`${styles.cell} ${styles.cellDesc}`}>
              <p className={styles.description}>{item.description}</p>
            </div>

            {/* Cell 6: Single-line text link 2 */}
            <div className={`${styles.cell} ${styles.cellLink2}`}>
              <Link
                href={item.nextLinkUrl}
                className={styles.textLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.nextLinkText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
