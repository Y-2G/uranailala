import { Instagram, Calendar, ExternalLink } from 'lucide-react';
import styles from "./styles.module.scss";

export function Updates() {
  // Mock Instagram posts
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1760164142066-1ac379c057f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJvdCUyMGNhcmRzJTIwZ2VudGxlfGVufDF8fHx8MTc2NzUwODE2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      caption: '1月の鑑定スケジュールをアップしました✨',
      date: '2026-01-03',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1737127999122-4204ee4ed86d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG5hdHVyZSUyMHNvZnR8ZW58MXx8fHwxNzY3NTA4MTYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: '新年のご挨拶と2026年の運勢について',
      date: '2026-01-01',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1761634731476-abb2df18357d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjBoZWFsaW5nJTIwaGFuZHMlMjBsaWdodHxlbnwxfHx8fDE3Njc1MDgxNjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: '冬至のフラワーエッセンス特集🌸',
      date: '2025-12-21',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1760164142066-1ac379c057f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJvdCUyMGNhcmRzJTIwZ2VudGxlfGVufDF8fHx8MTc2NzUwODE2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      caption: '九星気学で見る12月の吉方位',
      date: '2025-12-15',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1737127999122-4204ee4ed86d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG5hdHVyZSUyMHNvZnR8ZW58MXx8fHwxNzY3NTA4MTYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'インナーチャイルドカードのご紹介',
      date: '2025-12-10',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1761634731476-abb2df18357d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjBoZWFsaW5nJTIwaGFuZHMlMjBsaWdodHxlbnwxfHx8fDE3Njc1MDgxNjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: '年末年始の営業日程のお知らせ',
      date: '2025-12-05',
    },
  ];

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
              href="https://www.instagram.com/rar9302/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updatesCardDesktop}
            >
              <img
                src={post.image}
                alt={post.caption}
                className={styles.updatesCardImage}
              />
              <div className={styles.updatesCardOverlay}>
                <div className={styles.updatesCardMeta}>
                  <p className={styles.updatesCaption}>{post.caption}</p>
                  <p className={styles.updatesDate}>{post.date}</p>
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
              href="https://www.instagram.com/rar9302/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updatesCardTablet}
            >
              <img
                src={post.image}
                alt={post.caption}
                className={styles.updatesCardImage}
              />
              <div className={styles.updatesCardOverlay}>
                <div className={styles.updatesCardMeta}>
                  <p className={styles.updatesCaption}>{post.caption}</p>
                  <p className={styles.updatesDate}>{post.date}</p>
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
                href="https://www.instagram.com/rar9302/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.updatesMobileCard}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className={styles.updatesMobileImage}
                />
                <div className={styles.updatesMobileOverlay}>
                  <p className={styles.updatesMobileCaption}>{post.caption}</p>
                  <p className={styles.updatesMobileDate}>{post.date}</p>
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
