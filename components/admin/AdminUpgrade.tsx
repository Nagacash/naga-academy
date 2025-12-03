"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { Tier } from "@/lib/constants";
import { TIER_FEATURES, getTierColorClasses } from "@/lib/constants";

interface AdminUpgradeProps {
  currentTier: Tier;
}

export function AdminUpgrade({ currentTier }: AdminUpgradeProps) {
  const { user } = useUser();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async (tier: Tier) => {
    if (tier === currentTier) return;

    setLoading(true);
    setSuccess(false);
    setSelectedTier(tier);

    try {
      const response = await fetch("/api/admin/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade");
      }

      setSuccess(true);
      
      // Force Clerk to reload user data to get updated metadata
      if (user) {
        await user.reload();
      }
      
      // Reload page to update tier everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error upgrading:", error);
      alert("Failed to upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-violet-500/10 border border-violet-500/20 p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-400 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-violet-300 mb-2">
              Admin Upgrade (No Payment Required)
            </h3>
            <p className="text-sm text-zinc-400">
              As an admin, you can upgrade your tier instantly without payment.
              This is for testing and development purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TIER_FEATURES.map((plan) => {
          const colorClasses = getTierColorClasses(plan.color);
          const isCurrentTier = currentTier === plan.priceId;
          const isUpgrading = selectedTier === plan.priceId && loading;
          
          // Get button color based on tier
          const buttonColorClass = 
            plan.tier === "Free" ? "bg-emerald-500 hover:bg-emerald-600" :
            plan.tier === "Pro" ? "bg-violet-500 hover:bg-violet-600" :
            "bg-cyan-500 hover:bg-cyan-600";

          return (
            <div
              key={plan.tier}
              className={`relative rounded-xl border p-6 transition-all ${
                isCurrentTier
                  ? `${colorClasses.border} bg-zinc-900/50 ring-2 ring-offset-2 ring-offset-zinc-900 ${colorClasses.text.replace('text-', 'ring-')}`
                  : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500 text-white">
                    Current
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${colorClasses.text}`}>
                  {plan.tier}
                </h3>
                <div className="text-3xl font-black mb-1">
                  <span className={colorClasses.text}>
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-zinc-500 text-lg ml-1">/month</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">per month</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${colorClasses.text}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.priceId as Tier)}
                disabled={isCurrentTier || loading}
                className={`w-full text-white ${buttonColorClass} ${
                  isCurrentTier ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upgrading...
                  </>
                ) : success && selectedTier === plan.priceId ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Upgraded!
                  </>
                ) : isCurrentTier ? (
                  "Current Plan"
                ) : (
                  `Upgrade to ${plan.tier}`
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

