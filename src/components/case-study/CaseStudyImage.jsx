import styles from "./CaseStudyImage.module.css";

export default function CaseStudyImage({ src, alt, caption }) {
  return (
    <figure className={styles.figure}>
      <img src={src} alt={alt} className={styles.image} />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}