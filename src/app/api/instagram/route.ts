import { NextResponse } from "next/server";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type InstagramResponse = {
  data?: InstagramMedia[];
  error?: { message?: string };
};

export const revalidate = 300;

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const limit = process.env.INSTAGRAM_POST_LIMIT ?? "6";

  if (!accessToken || !userId) {
    return NextResponse.json(
      { error: "Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID." },
      { status: 500 }
    );
  }

  const url = new URL(`https://graph.instagram.com/${userId}/media`);
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
  );
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("limit", limit);

  try {
    const response = await fetch(url.toString(), { next: { revalidate } });
    const payload = (await response.json()) as InstagramResponse;

    if (!response.ok) {
      return NextResponse.json(
        { error: payload.error?.message ?? "Failed to fetch Instagram posts." },
        { status: response.status }
      );
    }

    const posts = (payload.data ?? [])
      .map((item) => {
        const image =
          item.media_type === "VIDEO"
            ? item.thumbnail_url
            : item.media_url;

        return {
          id: item.id,
          caption: item.caption ?? "",
          image: image ?? "",
          permalink: item.permalink ?? "",
          timestamp: item.timestamp ?? "",
        };
      })
      .filter((item) => item.image && item.permalink);

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Instagram posts." },
      { status: 500 }
    );
  }
}
