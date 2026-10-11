import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { ArticleModel } from "@/lib/db/models/article";

/**
 * Increments an article's view counter.
 *
 * Counting during the page render was the alternative and it is worse on
 * every axis: it would force the detail page to render dynamically, and
 * Next.js prefetches a link on hover — so hovering a card would count as a
 * read. Firing this from the browser after mount keeps the page prerendered
 * and only counts real visits.
 *
 * The response is intentionally tiny; the visible count comes from the
 * prerendered page and catches up on the next revalidation.
 */
export async function POST(_request: Request, context: RouteContext<"/api/articles/[id]/view">) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await connectToDatabase();
  await ArticleModel.updateOne({ _id: id }, { $inc: { views: 1 } });

  return NextResponse.json({ ok: true });
}
