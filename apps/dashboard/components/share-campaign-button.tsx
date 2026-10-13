"use client";

import { ShareButton } from "@/components/share-button";

interface ShareCampaignButtonProps {
  campaignId: string;
  campaignTitle: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function ShareCampaignButton({
  campaignId,
  campaignTitle,
  variant,
  size,
  className,
  label,
  disabled,
}: ShareCampaignButtonProps) {
  return (
    <ShareButton
      sharePath={`/influencer/campaigns/available/${campaignId}`}
      message={`Check out the "${campaignTitle}" campaign on 1man1000! Join as an influencer and get paid for your views: `}
      variant={variant}
      size={size}
      className={className}
      label={label}
      disabled={disabled}
    />
  );
}
