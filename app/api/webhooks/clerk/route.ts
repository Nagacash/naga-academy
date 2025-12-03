import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";

/**
 * Clerk webhook handler for subscription and user events.
 *
 * This endpoint handles:
 * - user.created - New user signups
 * - user.updated - User profile updates
 * - subscription.created - New subscription purchases
 * - subscription.updated - Subscription changes (upgrade/downgrade/cancellation)
 *
 * Configure this webhook in Clerk Dashboard → Webhooks
 * Endpoint URL: https://your-domain.com/api/webhooks/clerk
 *
 * Note: Install svix package: pnpm add svix
 */
export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to your .env.local");
  }

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    console.log("New user created:", {
      id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
    });
    // You can add custom logic here, e.g., create user record in database
  }

  if (eventType === "user.updated") {
    const { id, email_addresses } = evt.data;
    console.log("User updated:", {
      id,
      email: email_addresses[0]?.email_address,
    });
    // Handle user profile updates
  }

  if (eventType === "subscription.created") {
    const { data } = evt;
    console.log("Subscription created:", data);
    // Handle new subscription
    // The subscription plan information is in data.subscription
    // You can update user metadata or database records here
  }

  if (eventType === "subscription.updated") {
    const { data } = evt;
    console.log("Subscription updated:", data);
    // Handle subscription changes (upgrade/downgrade/cancellation)
    // Update user tier access based on subscription plan
  }

  return new Response("Webhook received", { status: 200 });
}

