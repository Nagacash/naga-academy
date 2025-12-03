import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-access";
import type { Tier } from "@/lib/constants";

/**
 * API route for admins to upgrade their tier without payment.
 * Sets the tier in Clerk user metadata.
 */
export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get requested tier from body
    const { tier } = await req.json();
    if (!tier || !["free", "pro", "ultra"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier. Must be 'free', 'pro', or 'ultra'" },
        { status: 400 }
      );
    }

    // Update user metadata with tier
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        tier: tier as Tier,
        adminUpgrade: true, // Flag to indicate this was set by admin
      },
    });

    return NextResponse.json({
      success: true,
      tier,
      message: `Successfully upgraded to ${tier} tier`,
    });
  } catch (error) {
    console.error("Error upgrading tier:", error);
    return NextResponse.json(
      { error: "Failed to upgrade tier" },
      { status: 500 }
    );
  }
}

