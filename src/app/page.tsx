"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { Pricing } from "@/components/Pricing";
import { Updates } from "@/components/Updates";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import styles from "./styles.module.scss";

export default function Home() {
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past hero section, hide at contact section
      const heroHeight = window.innerHeight;
      const contactSection = document.querySelector('#contact');
      const pastHero = window.scrollY > heroHeight * 0.8;
      
      let beforeContact = true;
      if (contactSection) {
        const contactTop = contactSection.getBoundingClientRect().top + window.scrollY;
        beforeContact = window.scrollY < contactTop - window.innerHeight * 0.5;
      }
      
      setShowFloatingCta(pastHero && beforeContact);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Mobile Floating CTA - Shows after hero section */}
      <a
        href="#contact"
        onClick={scrollToContact}
        className={`${styles.floatingCta} ${showFloatingCta ? styles.visible : ""}`}
      >
        鑑定を依頼する
      </a>
    </div>
  );
}
