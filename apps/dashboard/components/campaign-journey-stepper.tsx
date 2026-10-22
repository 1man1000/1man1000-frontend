"use client";

import {
  UserCheck,
  Share2,
  Upload,
  SearchCheck,
  BadgeCheck,
  Check,
  XCircle,
} from "lucide-react";

interface CampaignJourneyStepperProps {
  /**
   * Approval status of the influencer's latest submission on this campaign.
   * `undefined`/`null` means they haven't submitted yet.
   */
  submissionStatus?: string | null;
}

type StepState = "done" | "current" | "upcoming" | "rejected";

/**
 * Order-tracking-style progress tracker for the influencer campaign journey:
 * Joined → Post Content → Submit Screenshot → Under Review → Approved.
 */
export function CampaignJourneyStepper({
  submissionStatus,
}: CampaignJourneyStepperProps) {
  const status = submissionStatus ?? null;
  const isRejected = status === "rejected" || status === "reversed";

  const steps = [
    { key: "joined", label: "Joined", icon: UserCheck },
    { key: "post", label: "Post Content", icon: Share2 },
    { key: "submit", label: "Submit Screenshot", icon: Upload },
    { key: "review", label: "Under Review", icon: SearchCheck },
    {
      key: "result",
      label: isRejected ? "Rejected" : "Approved & Paid",
      icon: isRejected ? XCircle : BadgeCheck,
    },
  ];

  // Index of the step the influencer is currently on (all earlier = done)
  const currentIndex = !status ? 1 : status === "pending" ? 3 : 4;

  const stateFor = (index: number): StepState => {
    if (isRejected && index === steps.length - 1) return "rejected";
    if (index < currentIndex) return "done";
    if (index === currentIndex) return status === "approved" ? "done" : "current";
    return "upcoming";
  };

  const circleClass = (state: StepState) => {
    switch (state) {
      case "done":
        return "bg-emerald-500 text-white";
      case "current":
        return "bg-amber-500 text-white ring-4 ring-amber-500/20";
      case "rejected":
        return "bg-destructive text-white ring-4 ring-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex" role="list">
      {steps.map((step, i) => {
        const state = stateFor(i);
        const Icon = step.icon;
        const lineDone = currentIndex >= i;
        return (
          <div
            key={step.key}
            role="listitem"
            aria-current={state === "current" ? "step" : undefined}
            className="flex-1 flex flex-col items-center gap-1.5"
          >
            <div className="flex items-center w-full">
              <div
                className={`h-0.5 flex-1 ${
                  i === 0
                    ? "bg-transparent"
                    : lineDone
                      ? "bg-emerald-500"
                      : "bg-border"
                }`}
              />
              <div
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 ${circleClass(state)}`}
              >
                {state === "done" ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              <div
                className={`h-0.5 flex-1 ${
                  i === steps.length - 1
                    ? "bg-transparent"
                    : currentIndex > i
                      ? "bg-emerald-500"
                      : "bg-border"
                }`}
              />
            </div>
            <span
              className={`text-[10px] sm:text-xs text-center leading-tight ${
                state === "current" || state === "rejected"
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
