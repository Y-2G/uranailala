import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  plan?: string;
  message: string;
  replyMethod: "email" | "phone" | "either";
};

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return NextResponse.json(
      { error: "Missing email configuration." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as ContactPayload;

  if (!body?.name || !body?.email || !body?.message || !body?.replyMethod) {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const resend = new Resend(resendApiKey);

  // 運営者向けメール
  const adminSubject = "【お問い合わせ】新規お問い合わせがありました";
  const adminText = [
    `お名前: ${body.name}`,
    `メールアドレス: ${body.email}`,
    `電話番号: ${body.phone || "未入力"}`,
    `ご希望プラン: ${body.plan || "鑑定時に相談"}`,
    `返信方法: ${body.replyMethod}`,
    "",
    "お問い合わせ内容:",
    body.message,
  ].join("\n");

  // お客様向け自動返信メール
  const autoReplySubject = "【うらないLaLa】お問い合わせありがとうございます";
  const autoReplyText = [
    `${body.name} 様`,
    "",
    "この度はお問い合わせいただき、誠にありがとうございます。",
    "以下の内容でお問い合わせを受け付けいたしました。",
    "",
    "─────────────────────────",
    `お名前: ${body.name}`,
    `メールアドレス: ${body.email}`,
    `電話番号: ${body.phone || "未入力"}`,
    `ご希望プラン: ${body.plan || "鑑定時に相談"}`,
    `ご希望の返信方法: ${body.replyMethod === "email" ? "メール" : body.replyMethod === "phone" ? "電話" : "どちらでも可"}`,
    "",
    "お問い合わせ内容:",
    body.message,
    "─────────────────────────",
    "",
    "内容を確認次第、担当者よりご連絡させていただきます。",
    "今しばらくお待ちくださいませ。",
    "",
    "※このメールは自動送信されています。",
    "※本メールにお心当たりがない場合は、お手数ですが破棄してください。",
    "",
    "──────────────────",
    "うらないLaLa",
  ].join("\n");

  try {
    // 運営者向けメール送信
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: body.email,
      subject: adminSubject,
      text: adminText,
    });

    // お客様向け自動返信メール送信
    await resend.emails.send({
      from: fromEmail,
      to: body.email,
      subject: autoReplySubject,
      text: autoReplyText,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
