import styles from "./ProjectPage.module.css";
import "@/styles/casestudy.css";

export default function ProjectPage({ project, children }) {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.left}>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
        <div className={styles.right}>
          <span className={styles.company}>{project.company}</span>
        </div>
      </header>

      <div className={styles.heroWrapper}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className={styles.heroImage}
          />
        ) : (
          <div className={styles.heroPlaceholder} />
        )}
      </div>

      <div className={`${styles.content} caseStudy`}>
        {children}
      </div>

      {(project.contributors || project.disclaimer) && (
        <footer className={styles.footer}>
          {project.contributors && <p>Contributors: {project.contributors}</p>}
          {project.disclaimer && <p>Disclaimer: {project.disclaimer}</p>}
        </footer>
      )}
    </article>
  );
}
