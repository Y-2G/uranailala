"use client";

import dynamic from "next/dynamic";
import styles from "./styles.module.scss";

// Dynamically import AR component to avoid SSR issues
const ARExperience = dynamic(() => import("./ARExperience"), {
  ssr: false,
  loading: () => (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner} />
        <p>ARを読み込み中...</p>
      </div>
    </div>
  ),
});

export default function ARPage() {
  return (
    <div className={styles.arPage}>
      <ARExperience />
      <div className={styles.uiOverlay}>
        <a href="/" className={styles.backButton}>
          戻る
        </a>
        <div className={styles.instructions}>
          名刺にカメラを向けてください
        </div>
      </div>
    </div>
  );
}
