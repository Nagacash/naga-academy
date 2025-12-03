import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-access";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { userId } = await auth();
  const params = await searchParams;
  
  // If already signed in, redirect based on admin status
  if (userId) {
    const admin = await isAdmin();
    if (admin) {
      redirect("/admin");
    }
    // Redirect to the requested URL or dashboard
    redirect(params.redirect_url || "/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800",
          },
        }}
        routing="path"
        path="/sign-in"
        // Redirect to check admin status after sign-in
        afterSignInUrl="/auth/redirect"
        afterSignUpUrl="/auth/redirect"
        afterSignOutUrl="/"
        forceRedirectUrl="/auth/redirect"
      />
    </div>
  );
}

