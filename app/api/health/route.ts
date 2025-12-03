import { NextResponse } from "next/server";

/**
 * Health check endpoint to verify environment variables and services
 */
export async function GET() {
  const checks = {
    sanity: {
      projectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      writeToken: !!process.env.SANITY_API_WRITE_TOKEN,
    },
    clerk: {
      publishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: !!process.env.CLERK_SECRET_KEY,
    },
    openai: {
      apiKey: !!process.env.OPENAI_API_KEY,
    },
    mux: {
      tokenId: !!process.env.MUX_TOKEN_ID,
      tokenSecret: !!process.env.MUX_TOKEN_SECRET,
      signingKeyId: !!process.env.MUX_SIGNING_KEY_ID,
      signingKey: !!process.env.MUX_SIGNING_KEY,
    },
  };

  const allConfigured = Object.values(checks).every((service) =>
    Object.values(service).every((value) => value === true)
  );

  return NextResponse.json({
    status: allConfigured ? "healthy" : "partial",
    checks,
    message: allConfigured
      ? "All services configured"
      : "Some services are missing configuration",
  });
}

