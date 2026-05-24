import styles from "./StatsSection.module.css";

const stats = [
  { number: "20+", label: "Successful Projects" },
  { number: "6", label: "Happy Clients" },
  { number: "1.6", label: "Years of Experience" },
  { number: "0", label: "Letters from Hogwarts" },
];

export default function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.box}>
            <span className={styles.number}>{stat.number}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
