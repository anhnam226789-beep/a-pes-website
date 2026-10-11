import { NextResponse } from "next/server";
import { searchArticlesByTitle } from "@/lib/data/articles";

/** Below this the result set is too broad to be useful — and too costly. */
const MIN_QUERY_LENGTH = 2;

/**
 * Backs the header search modal.
 *
 * An endpoint rather than shipping an article index through the site layout:
 * the index would be added to the payload of *every* page for a feature most
 * visitors never open. This costs one request, only when someone types.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchArticlesByTitle(query);

  return NextResponse.json({ results });
}
