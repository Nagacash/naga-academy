import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { tutorAgent } from "@/lib/ai/tutor-agent";
import { auth } from "@clerk/nextjs/server";
import { getUserTier } from "@/lib/course-access";

export async function POST(request: Request) {
  // Verify user is authenticated
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if user has Ultra tier access
  // getUserTier() handles admins, metadata, and Clerk plans
  const userTier = await getUserTier();
  if (userTier !== "ultra") {
    return new Response("Ultra membership required", { status: 403 });
  }

  const { messages }: { messages: UIMessage[] } = await request.json();

  return createAgentUIStreamResponse({
    agent: tutorAgent,
    messages,
  });
}
