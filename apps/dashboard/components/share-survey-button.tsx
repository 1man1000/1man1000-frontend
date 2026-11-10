"use client";

import { ShareButton } from "@/components/share-button";

interface ShareSurveyButtonProps {
  surveyId: string;
  surveyTitle: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function ShareSurveyButton({
  surveyId,
  surveyTitle,
  variant,
  size,
  className,
  label,
  disabled,
}: ShareSurveyButtonProps) {
  return (
    <ShareButton
      sharePath={`/influencer/surveys/${surveyId}/take`}
      message={`Check out the "${surveyTitle}" survey on 1man1000! Join as an influencer and get paid for your opinions: `}
      variant={variant}
      size={size}
      className={className}
      label={label}
      disabled={disabled}
    />
  );
}
