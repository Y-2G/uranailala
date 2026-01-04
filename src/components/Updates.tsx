import { useEffect, useState } from "react";
import { Instagram, Calendar, ExternalLink } from "lucide-react";
import styles from "./styles.module.scss";

type InstagramPost = {
  id: string;
  image: string;
  caption: string;
  timestamp: string;
  permalink: string;
};

export function Updates() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    let isActive = true;

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/instagram");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!isActive) {
          return;
        }
        setInstagramPosts(data.posts ?? []);
      } catch (error) {
        // Fail silently; the section will simply show no posts.
      }
    };

    fetchPosts();

    return () => {
      isActive = false;
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section id="updates" className={styles.updatesSection}>
      <div className={styles.updatesContainer}>
        {/* Section Title */}
        <div className={styles.updatesHeader}>
          <h2 className={styles.updatesTitle}>お知らせ</h2>
          <p className={styles.updatesDescription}>
            最新の鑑定日程やお知らせは、Instagramで随時更新しています。
          </p>
          
          {/* Instagram CTA */}
          <div className={styles.updatesCtaGroup}>
            <a
              href="https://www.instagram.com/rar9302/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updatesCtaInstagram}
            >
              <Instagram size={20} />
              Instagramをフォロー
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className={styles.updatesCtaCalendar}
            >
              <Calendar size={20} />
              鑑定を依頼する
            </a>
          </div>
        </div>

        {/* Instagram Posts Grid - Desktop */}
        <div className={styles.updatesGridDesktop}>
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updatesCardDesktop}
            >
              <img
                src={post.image}
                alt={post.caption || "Instagramの投稿"}
                className={styles.updatesCardImage}
              />
              <div className={styles.updatesCardOverlay}>
                <div className={styles.updatesCardMeta}>
                  <p className={styles.updatesCaption}>{post.caption}</p>
                  <p className={styles.updatesDate}>
                    {post.timestamp ? formatDate(post.timestamp) : ""}
                  </p>
                </div>
                <div className={styles.updatesCardExternal}>
                  <ExternalLink className={styles.updatesExternalIcon} size={20} />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Instagram Posts Grid - Tablet */}
        <div className={styles.updatesGridTablet}>
          {instagramPosts.slice(0, 4).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updatesCardTablet}
            >
              <img
                src={post.image}
                alt={post.caption || "Instagramの投稿"}
                className={styles.updatesCardImage}
              />
              <div className={styles.updatesCardOverlay}>
                <div className={styles.updatesCardMeta}>
                  <p className={styles.updatesCaption}>{post.caption}</p>
                  <p className={styles.updatesDate}>
                    {post.timestamp ? formatDate(post.timestamp) : ""}
                  </p>
                </div>
                <div className={styles.updatesCardExternal}>
                  <ExternalLink className={styles.updatesExternalIcon} size={18} />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Instagram Posts - Mobile Horizontal Scroll */}
        <div className={styles.updatesMobileScroll}>
          <div className={styles.updatesMobileTrack} style={{ width: 'max-content' }}>
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.updatesMobileCard}
              >
                <img
                  src={post.image}
                  alt={post.caption || "Instagramの投稿"}
                  className={styles.updatesMobileImage}
                />
                <div className={styles.updatesMobileOverlay}>
                  <p className={styles.updatesMobileCaption}>{post.caption}</p>
                  <p className={styles.updatesMobileDate}>
                    {post.timestamp ? formatDate(post.timestamp) : ""}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* View More on Instagram */}
        <div className={styles.updatesViewMore}>
          <a
            href="https://www.instagram.com/rar9302/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.updatesViewMoreLink}
          >
            Instagramで全ての投稿を見る
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
