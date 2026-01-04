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

  const subject = "お問い合わせを受け付けました";
  const text = [
    `お名前: ${body.name}`,
    `メールアドレス: ${body.email}`,
    `電話番号: ${body.phone || "未入力"}`,
    `ご希望プラン: ${body.plan || "鑑定時に相談"}`,
    `返信方法: ${body.replyMethod}`,
    "",
    "お問い合わせ内容:",
    body.message,
  ].join("\n");

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: body.email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
