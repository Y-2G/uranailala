import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "ヒント出しヒーラーらら",
  description: "Spiritual healing website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
