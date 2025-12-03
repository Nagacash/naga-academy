"use client";

import { CheckCircle2, Crown, Rocket, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTierColorClasses, type TIER_FEATURES } from "@/lib/constants";
import Link from "next/link";

interface PricingCardProps {
  plan: (typeof TIER_FEATURES)[number];
  isCurrentPlan?: boolean;
  onUpgrade?: () => void;
}

const tierIcons = {
  Free: Rocket,
  Pro: Crown,
  Ultra: Trophy,
};

export function PricingCard({
  plan,
  isCurrentPlan = false,
  onUpgrade,
}: PricingCardProps) {
  const colorClasses = getTierColorClasses(plan.color);
  const Icon = tierIcons[plan.tier as keyof typeof tierIcons] || Rocket;
  const isPopular = plan.tier === "Pro";

  return (
    <div
      className={`relative rounded-xl border p-6 md:p-8 transition-all ${
        isCurrentPlan
          ? `${colorClasses.border} ring-2 ring-offset-2 ring-offset-zinc-900 ${colorClasses.text.replace('text-', 'ring-')}`
          : isPopular
            ? "border-violet-500/50 bg-zinc-900/50 hover:border-violet-500/70"
            : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
      }`}
    >
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-xs font-bold bg-violet-500 text-white">
            Most Popular
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-xs font-bold bg-violet-500 text-white">
            Current Plan
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-800 mb-4">
          <Icon className={`w-6 h-6 ${colorClasses.text}`} />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${colorClasses.text}`}>
          {plan.tier}
        </h3>
        <div className="mb-2">
          <span className={`text-4xl font-black ${colorClasses.text}`}>
            ${plan.price}
          </span>
          {plan.price > 0 && (
            <span className="text-zinc-500 text-lg ml-1">/month</span>
          )}
        </div>
        {plan.price === 0 && (
          <p className="text-sm text-zinc-500">Forever free</p>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckCircle2
              className={`w-5 h-5 mt-0.5 shrink-0 ${colorClasses.text}`}
            />
            <span className="text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <Button
          disabled
          className="w-full bg-zinc-800 text-zinc-400 cursor-not-allowed"
        >
          Current Plan
        </Button>
      ) : (
        <Button
          onClick={onUpgrade}
          className={`w-full ${
            isPopular
              ? "bg-violet-600 hover:bg-violet-500 text-white"
              : `bg-zinc-800 hover:bg-zinc-700 text-white`
          }`}
        >
          {plan.price === 0 ? "Get Started" : `Upgrade to ${plan.tier}`}
        </Button>
      )}
    </div>
  );
}

