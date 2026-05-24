import WorksSection from "@/components/ui/WorksSection";
import styles from "./page.module.css";

export const metadata = {
  title: "All Work — Harsh Gogri",
  description: "Browse all projects and case studies by Harsh Gogri.",
};

export default function WorkPage() {
  return (
    <main>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Work</h1>
      </div>
      <WorksSection showAll />
    </main>
  );
}
