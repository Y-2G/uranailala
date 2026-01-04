import { ArrowRight } from "lucide-react";
import styles from "./styles.module.scss";

export function Hero() {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <div className={styles.background}>
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero-pc.jpg" />
          <img src="/hero.jpeg" alt="" className={styles.backgroundImage} />
        </picture>
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.inner}>
          {/* Main Heading */}
          <h1 className={styles.heading}>
            毎日を楽しく過ごすための
            <br />
            小さなエッセンス
          </h1>

          {/* Subheading */}
          <p className={styles.subheading}>
            毎日を楽しく過ごせるように
            <br className={styles.breakLgOnly} />
            占いを通して小さなエッセンスをお渡しします。
            <br className={styles.breakMdHiddenLgInline} />
            迷いを整理し、前を向いて歩むためのサポートをいたします
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaGroup}>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className={styles.ctaPrimary}
            >
              鑑定を依頼する
              <ArrowRight className={styles.icon} size={20} />
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "#pricing")}
              className={styles.ctaSecondary}
            >
              料金を見る
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className={styles.bottomWave}></div>
    </section>
  );
}
