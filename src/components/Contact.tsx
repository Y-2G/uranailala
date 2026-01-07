import { useEffect, useState } from 'react';
import { Send, ChevronDown, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from "./styles.module.scss";

const contactSchema = yup.object({
  name: yup.string().trim().required('お名前を入力してください。'),
  email: yup
    .string()
    .trim()
    .email('メールアドレスの形式が正しくありません。')
    .required('メールアドレスを入力してください。'),
  phone: yup
    .string()
    .trim()
    .defined()
    .when('replyMethod', {
      is: (value: 'email' | 'phone' | 'either') => value === 'phone',
      then: (schema) => schema.required('電話番号を入力してください。'),
      otherwise: (schema) => schema.notRequired(),
    }),
  plan: yup.string().trim().defined(),
  message: yup.string().trim().required('お問い合わせ内容を入力してください。'),
  replyMethod: yup
    .mixed<'email' | 'phone' | 'either'>()
    .oneOf(['email', 'phone', 'either'])
    .required(),
});

type ContactFormValues = yup.InferType<typeof contactSchema>;

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      plan: '',
      message: '',
      replyMethod: 'email',
    },
    resolver: yupResolver(contactSchema),
    mode: 'onSubmit',
  });

  const replyMethod = watch('replyMethod');

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
      answer: '基本的には静岡県を中心に対応しております。遠方の場合はご相談ください。交通費は実費でのご負担をお願いしております。',
    },
  ];

  const handleSubmitForm = async (data: ContactFormValues) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return;
    }

    setIsSubmitted(true);
    reset();
  };

  useEffect(() => {
    const handlePlanSelect = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) {
        return;
      }
      setValue('plan', detail, { shouldDirty: true, shouldTouch: true });
    };

    window.addEventListener("select-plan", handlePlanSelect as EventListener);
    return () => {
      window.removeEventListener("select-plan", handlePlanSelect as EventListener);
    };
  }, []);

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
              <form onSubmit={handleSubmit(handleSubmitForm)} className={styles.contactForm}>
                {/* Name */}
                <div>
                  <label htmlFor="name" className={styles.contactFieldLabel}>
                    お名前 <span className={styles.contactRequired}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className={styles.contactInput}
                    placeholder="山田 太郎"
                    aria-invalid={Boolean(errors.name)}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className={styles.contactError}>{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={styles.contactFieldLabel}>
                    メールアドレス{" "}
                    <span className={styles.contactRequired}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className={styles.contactInput}
                    placeholder="example@email.com"
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className={styles.contactError}>{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={styles.contactFieldLabel}>
                    電話番号{" "}
                    {replyMethod === 'phone' ? (
                      <span className={styles.contactRequired}>*</span>
                    ) : (
                      <span className={styles.contactOptional}>(任意)</span>
                    )}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required={replyMethod === 'phone'}
                    className={styles.contactInput}
                    placeholder="090-1234-5678"
                    aria-invalid={Boolean(errors.phone)}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className={styles.contactError}>{errors.phone.message}</p>
                  )}
                </div>

                {/* Plan */}
                <div>
                  <label htmlFor="plan" className={styles.contactFieldLabel}>
                    ご希望プラン{" "}
                    <span className={styles.contactOptional}>(任意)</span>
                  </label>
                  <select
                    id="plan"
                    className={`${styles.contactInput} ${styles.contactSelect}`}
                    {...register('plan')}
                  >
                    <option value="">鑑定時に相談</option>
                    <option value="ライト">ライト（30分）</option>
                    <option value="スタンダード">スタンダード（60分）</option>
                    <option value="じっくり">じっくり（90分）</option>
                  </select>
                </div>

                {/* Reply Method */}
                <div>
                  <label htmlFor="replyMethod" className={styles.contactFieldLabel}>
                    ご希望の返信方法
                  </label>
                  <select
                    id="replyMethod"
                    className={`${styles.contactInput} ${styles.contactSelect}`}
                    {...register('replyMethod')}
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
                    required
                    rows={6}
                    className={`${styles.contactInput} ${styles.contactTextarea}`}
                    placeholder="ご希望の鑑定プラン、日時、ご相談内容などをお書きください。"
                    aria-invalid={Boolean(errors.message)}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className={styles.contactError}>{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.contactSubmit}
                >
                  <Send size={20} />
                  送信する
                </button>

                <ul className={styles.contactNoteList}>
                  <li>お送りいただいた情報は、お問い合わせ対応のみに使用いたします。</li>
                  <li>フォームにご入力いただいたメールアドレスへ担当者よりご連絡いたします。</li>
                  <li>3日以内に返信がない場合は、お手数ですが再度フォームからお問い合わせください。</li>
                </ul>
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
