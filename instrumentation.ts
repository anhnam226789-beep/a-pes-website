/**
 * Runs once per server instance, before the first request is handled.
 *
 * Opening a MongoDB connection means a TCP connect, a TLS handshake and an
 * auth exchange with Atlas — a few hundred milliseconds that the first visitor
 * of every cold serverless instance used to pay for inside their page render.
 * Starting it here moves that cost into the boot phase.
 *
 * Deliberately not awaited: the server must not refuse to come up because the
 * database is briefly unreachable. `connectToDatabase` caches the in-flight
 * promise, so a request that arrives mid-handshake joins it instead of opening
 * a second connection, and a failure clears the cache so the next request
 * retries normally.
 */
export async function register() {
  // `register` runs in every runtime; mongoose is Node-only.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { connectToDatabase } = await import("@/lib/db/connect");

  void connectToDatabase().catch((error: unknown) => {
    console.error("[instrumentation] MongoDB warm-up failed:", error);
  });
}
