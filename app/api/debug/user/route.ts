import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-access";

/**
 * Debug endpoint to check current user email and admin status
 * Useful for troubleshooting admin access issues
 * 
 * Access at: http://localhost:3000/api/debug/user
 */
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: "Not signed in",
        admin: false,
      });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    const admin = await isAdmin();

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      email: userEmail,
      emailLowercase: userEmail?.toLowerCase(),
      admin: admin,
      message: admin
        ? "You have admin access"
        : `Email "${userEmail}" is not in the admin list. Add it to ADMIN_EMAILS in .env.local or update lib/admin-access.ts`,
      adminEmails: process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
        : ["sonic13.ch@googlemail.com"],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


