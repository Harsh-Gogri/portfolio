import Link from "next/link";
import { projects } from "@/data/projects";
import CustomCursor from "./CustomCursor";
import MagneticButton from "./MagneticButton";
import styles from "./WorksSection.module.css";

export default function WorksSection({ showAll = false }) {
  const visibleProjects = showAll ? projects : projects.slice(0, 5);

  return (
    <section className={styles.worksSection}>
      <CustomCursor />
      <div className={styles.container}>
        {!showAll && (
          <div className={styles.headerRow}>
            <span className={styles.headerLeft}>Selected Work</span>
            <span className={styles.headerLine} />
            <Link href="/work" className={styles.headerRight}>View all work →</Link>
          </div>
        )}

        {visibleProjects.map((project, index) => {
          const rowNumber = String(index + 1).padStart(2, "0");
          return (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              className={styles.row}
              data-hover-row="true"
              data-image={project.image}
            >
              <div className={styles.mobileImageWrapper}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className={styles.mobileImage} />
                ) : (
                  <div className={styles.mobilePlaceholder} />
                )}
              </div>
              <div className={styles.leftStack}>
                <span className={styles.company}>{project.company}</span>
                <span className={styles.title}>{project.title}</span>
              </div>
              <div className={styles.rightGroup}>
                {project.tags && project.tags.length > 0 && (
                  <span className={styles.tags}>{project.tags.join(", ")}</span>
                )}
                <span className={styles.number}>{rowNumber}</span>
              </div>
            </Link>
          );
        })}

        {!showAll && (
          <MagneticButton href="/work">View all work</MagneticButton>
        )}
      </div>
    </section>
  );
}
