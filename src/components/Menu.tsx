import { useState } from "react";
import styles from "./styles.module.scss";

export function Menu() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const menuItems = [
    {
      name: '手相術',
      icon: '🖐️',
      description: '手のひらに刻まれた線から、性格や運命の傾向を読み解きます',
      duration: '30分〜',
      tags: ['恋愛運', '仕事運', '健康運'],
    },
    {
      name: '人相術',
      icon: '👤',
      description: '顔の特徴から本質的な性格や今後の運勢を鑑定します',
      duration: '30分〜',
      tags: ['性格診断', '人間関係', '適職'],
    },
    {
      name: '九星気学',
      icon: '🧭',
      description: '生年月日から本命星を導き出し、吉方位や運気の流れを見ます',
      duration: '40分〜',
      tags: ['引越し', '旅行', '転職'],
    },
    {
      name: 'インナーチャイルドカード',
      icon: '🃏',
      description: '内なる子どもの声を聴き、心の奥底にある本当の気持ちを探ります',
      duration: '50分〜',
      tags: ['心のケア', '自己理解', '癒し'],
    },
    {
      name: 'フラワーエッセンス',
      icon: '🌸',
      description: '花のエネルギーで心のバランスを整え、前向きな状態へ導きます',
      duration: '40分〜',
      tags: ['ストレス', '感情調整', 'ヒーリング'],
    },
    {
      name: '推命術',
      icon: '🧭',
      description: '陰陽五行のバランスから、その人の人生のシナリオを推察する占いです',
      duration: '40分〜',
      tags: ['運勢', '人生の流れ', '自己理解'],
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
    <section id="menu" className={styles.menuSection}>
      <div className={styles.menuContainer}>
        {/* Section Title */}
        <div className={styles.menuHeader}>
          <h2 className={styles.menuTitle}>メニュー</h2>
          <p className={styles.menuDescription}>
            お悩みや知りたい内容に合わせて、最適な占術をご提案いたします。
            <br className={styles.menuBreakMdOnly} />
            組み合わせての鑑定も可能です。
            <button
              type="button"
              className={styles.menuGuideLinkInline}
              onClick={() => setIsGuideOpen(true)}
            >
              迷ったら？占術の選び方
            </button>
          </p>
        </div>

        {/* Menu Cards */}
        <div className={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={styles.menuCard}
            >
              <div className={styles.menuCardIcon}>{item.icon}</div>
              <h3 className={styles.menuCardTitle}>
                {item.name}
              </h3>
              <p className={styles.menuCardDescription}>
                {item.description}
              </p>
              <div className={styles.menuCardMeta}>
                目安時間：{item.duration}
              </div>
              <div className={styles.menuTagList}>
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={styles.menuTag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.menuGuideCtaWrap}>
          <a
            href="#pricing"
            onClick={(e) => scrollToSection(e, "#pricing")}
            className={styles.menuGuideCta}
          >
            料金プランを見る
          </a>
        </div>
      </div>

      {isGuideOpen && (
        <div
          className={styles.menuGuideModalBackdrop}
          onClick={() => setIsGuideOpen(false)}
        >
          <div
            className={styles.menuGuideModal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.menuGuideModalHeader}>
              <h4 className={styles.menuGuideModalTitle}>迷ったら？占術の選び方</h4>
              <button
                type="button"
                className={styles.menuGuideModalClose}
                onClick={() => setIsGuideOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className={styles.menuGuideGrid}>
              <div className={styles.menuGuideItem}>
                <div className={styles.menuGuideItemTitle}>
                  💕 恋愛・結婚について
                </div>
                <p className={styles.menuGuideItemText}>
                  → 手相術、人相術、インナーチャイルドカード
                </p>
              </div>
              <div className={styles.menuGuideItem}>
                <div className={styles.menuGuideItemTitle}>
                  💼 仕事・キャリアについて
                </div>
                <p className={styles.menuGuideItemText}>
                  → 人相術、九星気学
                </p>
              </div>
              <div className={styles.menuGuideItem}>
                <div className={styles.menuGuideItemTitle}>
                  🏠 引越し・旅行・方位
                </div>
                <p className={styles.menuGuideItemText}>
                  → 九星気学
                </p>
              </div>
              <div className={styles.menuGuideItem}>
                <div className={styles.menuGuideItemTitle}>
                  🌱 心のケア・癒し
                </div>
                <p className={styles.menuGuideItemText}>
                  → インナーチャイルドカード、フラワーエッセンス
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
