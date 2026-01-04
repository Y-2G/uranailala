import { Check, Info } from 'lucide-react';
import styles from "./styles.module.scss";

export function Pricing() {
  const plans = [
    {
      name: 'ライト',
      duration: '30分',
      price: '¥5,000',
      description: 'シンプルなお悩み、ひとつのテーマに絞りたい方に',
      features: [
        '占術1つを選択',
        '基本的な鑑定',
        'アドバイスシート',
      ],
      recommended: false,
    },
    {
      name: 'スタンダード',
      duration: '60分',
      price: '¥10,000',
      description: '複数の視点からじっくり相談したい方に',
      features: [
        '占術2〜3つを組み合わせ',
        '詳しい鑑定とアドバイス',
        'アドバイスシート',
        'アフターフォロー（1週間）',
      ],
      recommended: true,
    },
    {
      name: 'じっくり',
      duration: '90分',
      price: '¥15,000',
      description: '人生の転機、複数の悩みを総合的に見たい方に',
      features: [
        '複数の占術を自由に組み合わせ',
        '深い鑑定と総合アドバイス',
        '詳細なアドバイスシート',
        'アフターフォロー（2週間）',
        'フラワーエッセンス提案',
      ],
      recommended: false,
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
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.pricingContainer}>
        {/* Section Title */}
        <div className={styles.pricingHeader}>
          <h2 className={styles.pricingTitle}>料金</h2>
          <p className={styles.pricingDescription}>
            ご予算やお時間に合わせてお選びいただけます。
            <br className={styles.pricingBreakMdOnly} />
            初めての方はスタンダードプランがおすすめです。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className={styles.pricingGrid}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.pricingCard} ${
                plan.recommended
                  ? styles.pricingCardRecommended
                  : styles.pricingCardStandard
              }`}
            >
              {plan.recommended && (
                <div className={styles.pricingBadge}>
                  おすすめ
                </div>
              )}
              
              <div className={styles.pricingCardHeader}>
                <h3 className={styles.pricingPlanName}>
                  {plan.name}
                </h3>
                <div className={styles.pricingPriceWrap}>
                  <span className={styles.pricingPrice}>{plan.price}</span>
                </div>
                <div className={styles.pricingDuration}>
                  {plan.duration}
                </div>
              </div>

              <p className={styles.pricingDescriptionText}>
                {plan.description}
              </p>

              <ul className={styles.pricingFeatures}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.pricingFeature}>
                    <Check className={styles.pricingFeatureIcon} size={18} />
                    <span className={styles.pricingFeatureText}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className={`${styles.pricingCta} ${
                  plan.recommended
                    ? styles.pricingCtaRecommended
                    : styles.pricingCtaStandard
                }`}
              >
                このプランで予約
              </a>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className={styles.pricingNotes}>
          <div className={styles.pricingNoteAlert}>
            <div className={styles.pricingNoteAlertRow}>
              <Info className={styles.pricingNoteAlertIcon} size={18} />
              <div>
                <h4 className={styles.pricingNoteAlertTitle}>
                  追加料金について
                </h4>
                <ul className={styles.pricingNoteAlertList}>
                  <li>• 出張鑑定の場合：交通費を別途ご負担いただきます（実費）</li>
                  <li>• 延長をご希望の場合：15分ごとに¥2,000</li>
                  <li>• フラワーエッセンスボトル：¥3,000〜（ご希望の方のみ）</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.pricingNoteNeutral}>
            <h4 className={styles.pricingNoteNeutralTitle}>
              お支払い方法
            </h4>
            <p className={styles.pricingNoteNeutralText}>
              現金、銀行振込、各種クレジットカード、PayPay、交通系ICカード対応
            </p>
          </div>

          <div className={styles.pricingNoteNeutral}>
            <h4 className={styles.pricingNoteNeutralTitle}>
              キャンセルポリシー
            </h4>
            <p className={styles.pricingNoteNeutralTextLarge}>
              前日までのキャンセル：無料<br />
              当日キャンセル：料金の50%<br />
              無断キャンセル：料金の100%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
