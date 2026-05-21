import Link from "next/link";
import { projects } from "@/data/projects";
import CustomCursor from "./CustomCursor";
import styles from "./WorksSection.module.css";

export default function WorksSection() {
  const visibleProjects = projects.slice(0, 5);

  return (
    <section className={styles.worksSection}>
      <CustomCursor />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.headerLeft}>Selected Work</span>
          <span className={styles.headerLine} />
          <a href="#" className={styles.headerRight}>View all work →</a>
        </div>

        {visibleProjects.map((project) => (
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
            <span className={styles.company}>{project.company}</span>
            <span className={styles.title}>{project.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

