"use client";

import { TIER_FEATURES } from "@/lib/constants";
import { PricingCard } from "./PricingCard";
import { useUserTier } from "@/lib/hooks/use-user-tier";

export function CustomPricingTable() {
  const currentTier = useUserTier();

  const handleUpgrade = (tier: string) => {
    // This will be handled by Clerk's PricingTable or admin upgrade
    // For now, just scroll to top or show upgrade message
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {TIER_FEATURES.map((plan) => (
        <PricingCard
          key={plan.tier}
          plan={plan}
          isCurrentPlan={currentTier === plan.priceId}
          onUpgrade={() => handleUpgrade(plan.priceId)}
        />
      ))}
    </div>
  );
}

