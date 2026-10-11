/**
 * Seeds the CMS collections and the first admin account.
 *
 * Run with: `npm run db:seed`
 *
 * Idempotent — every write is an upsert keyed on a natural unique field, so
 * re-running realigns the rows instead of duplicating them. It never deletes,
 * so content added from the admin survives a re-run.
 */
import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db/connect";
import { ArticleModel } from "../lib/db/models/article";
import { CategoryModel } from "../lib/db/models/category";
import { UdidStepModel } from "../lib/db/models/udid-step";
import { UserModel } from "../lib/db/models/user";
import { hashPassword } from "../lib/auth/password";
import { sanitizeArticleContent } from "../lib/articles/sanitize";
import { POLICY_CATEGORY } from "../lib/policy-pages";
import { CATEGORY_SEED, UDID_STEP_SEED } from "./seed-data";
import { ARTICLE_SEED, REFERENCE_ARTICLE_BODY } from "./article-seed-data";
import { POLICY_COVER_IMAGE, POLICY_SEED } from "./policy-seed-data";

const DEFAULT_ADMIN_EMAIL = "Namsoobin333@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
      return;
    } catch {
      // Try the next candidate; a missing file is not an error here because
      // the variables may already come from the shell or the host platform.
    }
  }
}

async function seedCategories(): Promise<void> {
  for (const category of CATEGORY_SEED) {
    await CategoryModel.updateOne(
      { name: category.name },
      { $set: { ...category, isActive: true } },
      { upsert: true },
    );
  }
  console.log(`✓ categories: ${CATEGORY_SEED.length} rows upserted`);
}

async function seedUdidSteps(): Promise<void> {
  for (const step of UDID_STEP_SEED) {
    await UdidStepModel.updateOne(
      { order: step.order },
      { $set: step },
      { upsert: true },
    );
  }
  console.log(`✓ udid_steps: ${UDID_STEP_SEED.length} rows upserted`);
}

/** `dd/MM/yyyy` from the old mock data → a `Date` at midday Vietnam time. */
function parseSeedDate(value: string): Date {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
}

async function seedArticles(): Promise<void> {
  const categories = await CategoryModel.find().select("_id name").lean();
  const categoryIdByName = new Map(
    categories.map((category) => [category.name, category._id]),
  );

  let upserted = 0;
  const skipped: string[] = [];

  for (const article of ARTICLE_SEED) {
    const categoryId = categoryIdByName.get(article.categoryName);
    if (!categoryId) {
      skipped.push(`${article.slug} (danh mục "${article.categoryName}")`);
      continue;
    }

    await ArticleModel.updateOne(
      { slug: article.slug },
      {
        $set: {
          title: article.title,
          excerpt: article.excerpt,
          coverImage: article.coverImage,
          category: categoryId,
          publishedAt: parseSeedDate(article.date),
        },
        // Only applied on insert, so re-running never overwrites a body,
        // a view count or a featured flag that has since been edited.
        $setOnInsert: {
          // Same pipeline the CMS uses, so seeded bodies carry the table
          // scroll wrapper and the same allow-list guarantees.
          content: sanitizeArticleContent(REFERENCE_ARTICLE_BODY),
          isFeatured: true,
          views: article.views,
          links: [],
        },
      },
      { upsert: true },
    );
    upserted += 1;
  }

  console.log(`✓ articles: ${upserted} rows upserted`);
  if (skipped.length > 0) {
    console.warn(`  ! skipped ${skipped.length}: ${skipped.join(", ")}`);
  }
  console.log(
    "  note: liên kết tải xuống để trống — thêm URL thật trong /admin/articles.",
  );
}

/**
 * The four policy pages linked from the footer.
 *
 * Stored as ordinary articles so they are editable in the same CMS screen,
 * but flagged `isHidden` so they stay out of every public listing. Their
 * category is created inactive, which keeps it off the filter bar too.
 */
async function seedPolicyPages(): Promise<void> {
  await CategoryModel.updateOne(
    { name: POLICY_CATEGORY.name },
    {
      $set: { label: POLICY_CATEGORY.label, slug: POLICY_CATEGORY.slug },
      $setOnInsert: { order: CATEGORY_SEED.length + 1, isActive: false },
    },
    { upsert: true },
  );

  const category = await CategoryModel.findOne({ name: POLICY_CATEGORY.name })
    .select("_id")
    .lean();
  if (!category) throw new Error("Policy category was not created");

  for (const policy of POLICY_SEED) {
    await ArticleModel.updateOne(
      { slug: policy.slug },
      {
        $set: { category: category._id, isHidden: true },
        // Title, excerpt and body are only written on insert so a re-run
        // never overwrites text that has since been finalised in the CMS.
        $setOnInsert: {
          title: policy.title,
          excerpt: policy.excerpt,
          content: sanitizeArticleContent(policy.content),
          coverImage: POLICY_COVER_IMAGE,
          isFeatured: false,
          views: 0,
          links: [],
          publishedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }

  console.log(
    `✓ policy pages: ${POLICY_SEED.length} rows upserted (ẩn khỏi danh sách)`,
  );
  console.log("  note: nội dung là BẢN NHÁP, cần rà soát trước khi công bố.");
}

async function seedAdminUser(): Promise<void> {
  const email = (process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL)
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

  const existing = await UserModel.findOne({ email }).lean();
  if (existing) {
    console.log(`• users: "${email}" already exists, password left untouched`);
    return;
  }

  await UserModel.create({
    email,
    name: process.env.SEED_ADMIN_NAME ?? "Admin",
    passwordHash: await hashPassword(password),
    role: "admin",
  });

  console.log(`✓ users: created "${email}"`);
  console.log(`  password: ${password}`);
  console.log("  ^ change it after the first login.");
}

async function main(): Promise<void> {
  loadEnv();

  await connectToDatabase();
  console.log(`connected to "${mongoose.connection.name}"`);

  // Categories first: articles reference them by id.
  // await seedCategories();
  // await seedUdidSteps();
  // await seedArticles();
  // await seedPolicyPages();
  await seedAdminUser();

  await mongoose.disconnect();
  console.log("done.");
}

main().catch((error: unknown) => {
  console.error("seed failed:", error);
  process.exit(1);
});
