import Link from "next/link";
import styles from "./IdeasSection.module.css";

const ArrowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.8926 33.5758C21.8926 29.1349 24.3784 25.1426 28.2366 22.1818H2.30291C1.09793 22.1818 0.121094 21.205 0.121094 20C0.121094 18.795 1.09793 17.8182 2.30291 17.8182H28.2366C24.3784 14.8574 21.8926 10.8651 21.8926 6.42425C21.8926 5.21926 22.8695 4.24243 24.0745 4.24243C25.2794 4.24244 26.2563 5.21927 26.2563 6.42425C26.2563 10.8722 30.6454 15.8518 38.2616 17.8925C39.2154 18.1481 39.8787 19.0125 39.8787 20C39.8787 20.9875 39.2154 21.8519 38.2616 22.1075C30.6454 24.1482 26.2563 29.1278 26.2563 33.5758C26.2563 34.7807 25.2794 35.7576 24.0745 35.7576C22.8695 35.7576 21.8926 34.7808 21.8926 33.5758Z" fill="currentColor" />
  </svg>
);

const ideas = [
  {
    id: "01",
    title: "Compliance Lens",
    description: "Compliance tool designed to evaluate agent scripts against regulations",
    url: "https://compliancelens.vercel.app/",
    image: "/images/assets/prototypes/compliance_lens.jpeg",
  },
  {
    id: "02",
    title: "People's Museum",
    description: "People's Museum is a digital museum for preserving meaningful personal objects and the stories behind them.",
    url: "https://peoples-museum.figma.site/",
    image: "/images/assets/prototypes/peoples_museum.jpeg",
  },
  {
    id: "03",
    title: "Silence Chamber",
    description: "You wake up in an invisible maze where the only way to see is to speak.",
    url: "https://silence-chamber.figma.site/",
    image: "/images/assets/prototypes/silence_chamber.png",
  }
];

export default function IdeasSection() {
  return (
    <section className={styles.ideasSection}>
      <div className={styles.container}>

        <div className={styles.ideasHeader}>
          <h2 className={styles.ideasHeaderTitle}>Ideas to Execution</h2>
          <Link
            href="https://github.com/Harsh-Gogri"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ideasGithubLink}
          >
            Github
          </Link>
        </div>

        <div className={styles.cardsGrid}>
          {ideas.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ideaCard}
            >
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url('${item.image}')` }}
              />

              <div className={styles.overlayArrow}>
                <ArrowIcon className={styles.arrowIcon} />
              </div>

              <div className={styles.overlayBottom}>
                <div className={styles.overlayContent}>
                  <h3 className={styles.ideaTitle}>{item.title}</h3>
                  <p className={styles.ideaDescription}>{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}