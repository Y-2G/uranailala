import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import styles from "./styles.module.scss";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "メニュー", href: "#menu" },
    { label: "料金", href: "#pricing" },
    { label: "お知らせ", href: "#updates" },
    { label: "お問い合わせ", href: "#contact" },
  ];

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`${styles.header} ${
        isScrolled ? styles.headerScrolled : styles.headerTransparent
      }`}
    >
      <div className={styles.headerContainer}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <a href="#" className={styles.headerLogo}>
            <div className={styles.headerLogoText}>
              <span className={styles.headerLogoPrimary}>
                ヒント出しヒーラー
              </span>
              <span className={styles.headerLogoAccent}>らら</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className={styles.headerNavDesktop}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={styles.headerNavLinkDesktop}
              >
                {item.label}
              </a>
            ))}
            {/* CTA Button - Desktop */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className={styles.headerCtaDesktop}
            >
              鑑定を依頼する
            </a>
          </nav>

          {/* Tablet Navigation */}
          <nav className={styles.headerNavTablet}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={styles.headerNavLinkTablet}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className={styles.headerCtaTablet}
            >
              鑑定を依頼
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.headerMobileButton}
            aria-label="メニュー"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.headerMobileMenu}>
          <nav className={styles.headerMobileNav}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={styles.headerMobileLink}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className={styles.headerMobileCta}
            >
              鑑定を依頼する
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
