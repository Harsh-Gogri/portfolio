import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images = [] }) {
  if (!images || images.length === 0) return null;

  const count = images.length;
  let layoutClass = styles.colsThree;
  if (count === 1) {
    layoutClass = styles.colsOne;
  } else if (count === 2) {
    layoutClass = styles.colsTwo;
  }

  return (
    <div className={`${styles.gallery} ${layoutClass}`}>
      {images.map((img, idx) => (
        <figure key={idx} className={styles.item}>
          <div className={styles.imageWrapper}>
            <img src={img.src} alt={img.alt || ""} className={styles.image} />
          </div>
          {img.caption && (
            <figcaption className={styles.caption}>
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}