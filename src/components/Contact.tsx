import { useState } from 'react';
import { Send, ChevronDown, CheckCircle } from 'lucide-react';
import styles from "./styles.module.scss";

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    replyMethod: 'email',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: '当日予約はできますか？',
      answer: '空きがあれば当日予約も可能です。まずはお問い合わせフォームまたはInstagramのDMでご連絡ください。',
    },
    {
      question: '鑑定時に何か準備するものはありますか？',
      answer: '特にご準備いただくものはございません。お悩みやお聞きになりたいことを事前に整理しておくと、より充実した鑑定になります。',
    },
    {
      question: '出張鑑定の対応エリアは？',
      answer: '基本的には近隣エリアを中心に対応しております。遠方の場合はご相談ください。交通費は実費でのご負担をお願いしております。',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    
    // Reset form after showing success message
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        replyMethod: 'email',
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        {/* Section Title */}
        <div className={styles.contactHeader}>
          <h2 className={styles.contactTitle}>お問い合わせ</h2>
          <p className={styles.contactDescription}>
            鑑定のご依頼やご質問など、お気軽にお問い合わせください。
            <br className={styles.contactBreakMdOnly} />
            通常1〜2営業日以内にご返信いたします。
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Contact Form */}
          <div className={styles.contactFormColumn}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                {/* Name */}
                <div>
                  <label htmlFor="name" className={styles.contactFieldLabel}>
                    お名前 <span className={styles.contactRequired}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.contactInput}
                    placeholder="山田 太郎"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={styles.contactFieldLabel}>
                    メールアドレス <span className={styles.contactRequired}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.contactInput}
                    placeholder="example@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={styles.contactFieldLabel}>
                    電話番号{" "}
                    <span className={styles.contactOptional}>(任意)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.contactInput}
                    placeholder="090-1234-5678"
                  />
                </div>

                {/* Reply Method */}
                <div>
                  <label htmlFor="replyMethod" className={styles.contactFieldLabel}>
                    ご希望の返信方法
                  </label>
                  <select
                    id="replyMethod"
                    name="replyMethod"
                    value={formData.replyMethod}
                    onChange={handleChange}
                    className={styles.contactInput}
                  >
                    <option value="email">メール</option>
                    <option value="phone">電話</option>
                    <option value="either">どちらでも可</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={styles.contactFieldLabel}>
                    お問い合わせ内容{" "}
                    <span className={styles.contactRequired}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`${styles.contactInput} ${styles.contactTextarea}`}
                    placeholder="ご希望の鑑定プラン、日時、ご相談内容などをお書きください。"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.contactSubmit}
                >
                  <Send size={20} />
                  送信する
                </button>

                <p className={styles.contactNote}>
                  お送りいただいた情報は、お問い合わせ対応のみに使用いたします。
                </p>
              </form>
            ) : (
              <div className={styles.contactSuccess}>
                <CheckCircle className={styles.contactSuccessIcon} size={64} />
                <h3 className={styles.contactSuccessTitle}>
                  送信完了しました
                </h3>
                <p className={styles.contactSuccessText}>
                  お問い合わせありがとうございます。<br />
                  1〜2営業日以内にご返信いたしますので、しばらくお待ちください。
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className={styles.contactSuccessButton}
                >
                  別のお問い合わせをする
                </button>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className={styles.contactFaqColumn}>
            <h3 className={styles.contactFaqTitle}>
              よくあるご質問
            </h3>
            <div className={styles.contactFaqList}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={styles.contactFaqItem}
                >
                   <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className={styles.contactFaqButton}
                  >
                    <span className={styles.contactFaqQuestion}>{faq.question}</span>
                    <ChevronDown
                      className={`${styles.contactFaqIcon} ${
                        expandedFaq === index ? styles.contactFaqIconExpanded : ""
                      }`}
                      size={20}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className={styles.contactFaqAnswerWrap}>
                      <p className={styles.contactFaqAnswer}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Contact Info */}
            <div className={styles.contactAside}>
              <h4 className={styles.contactAsideTitle}>
                お急ぎの方へ
              </h4>
              <p className={styles.contactAsideText}>
                InstagramのDMでもお問い合わせを受け付けております。当日のご予約など、お急ぎの場合はこちらが便利です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
