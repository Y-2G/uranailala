"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { Pricing } from "@/components/Pricing";
import { Updates } from "@/components/Updates";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import styles from "./styles.module.scss";

export default function Home() {
  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#contact');
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main>
        <Hero />
        <Menu />
        <Pricing />
        <Updates />
        <Contact />
      </main>
      <Footer />

      {/* Mobile Floating CTA - Always fixed at bottom right */}
      <a
        href="#contact"
        onClick={scrollToContact}
        className={styles.floatingCta}
      >
        鑑定を依頼する
      </a>
    </div>
  );
}
