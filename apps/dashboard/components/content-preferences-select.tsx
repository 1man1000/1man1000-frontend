"use client";

import { Label } from "@workspace/ui/components/label";

export const CONTENT_PREFERENCES: { value: string; label: string }[] = [
  { value: "sports_gaming", label: "Sports & Gaming" },
  { value: "music_entertainment", label: "Music & Entertainment" },
  { value: "food_lifestyle", label: "Food & Lifestyle" },
  { value: "technology_digital", label: "Technology & Digital" },
  { value: "education", label: "Education" },
  { value: "travel_tourism", label: "Travel & Tourism" },
  { value: "social_community", label: "Social & Community" },
];

interface ContentPreferencesSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

/**
 * Multi-select for the types of content an influencer is willing to
 * participate in. Values match the backend ContentPreference enum.
 */
export function ContentPreferencesSelect({
  value,
  onChange,
  disabled,
}: ContentPreferencesSelectProps) {
  const toggle = (preference: string) => {
    onChange(
      value.includes(preference)
        ? value.filter((v) => v !== preference)
        : [...value, preference],
    );
  };

  return (
    <div className="space-y-2">
      <Label>
        Content Preferences <span className="text-destructive">*</span>
      </Label>
      <p className="text-xs text-muted-foreground">
        Select the types of content you are willing to create or participate in
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CONTENT_PREFERENCES.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => toggle(option.value)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
                selected
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
