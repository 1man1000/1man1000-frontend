"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, GitBranch } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";

export type CampaignOption = {
  id: string;
  title?: unknown;
  brandName?: string | null;
  parentCampaignId?: string | null;
};

function campaignLabel(campaign: CampaignOption): string {
  const title =
    typeof campaign.title === "string" && campaign.title
      ? campaign.title
      : undefined;
  return title || campaign.brandName || "Campaign";
}

export type CampaignComboboxProps = {
  campaigns: CampaignOption[];
  value?: string;
  onChange: (campaignId: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** When provided, an "all campaigns" item is shown that selects "" */
  allLabel?: string;
  /** Set when rendered inside a modal Dialog so the popover stays interactive */
  modal?: boolean;
  className?: string;
};

export function CampaignCombobox({
  campaigns,
  value,
  onChange,
  placeholder = "Select a campaign",
  invalid,
  disabled,
  allLabel,
  modal,
  className,
}: CampaignComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = campaigns.find((c) => c.id === value);
  const isAllSelected = allLabel !== undefined && !value;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between rounded-md font-normal shadow-sm",
            invalid && "border-destructive",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selected
              ? campaignLabel(selected)
              : isAllSelected
                ? allLabel
                : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search campaigns..." />
          <CommandList>
            <CommandEmpty>No campaign found.</CommandEmpty>
            <CommandGroup>
              {allLabel !== undefined && (
                <CommandItem
                  value={allLabel}
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      isAllSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {allLabel}
                </CommandItem>
              )}
              {campaigns.map((campaign) => {
                const isSub = !!campaign.parentCampaignId;
                return (
                  <CommandItem
                    key={campaign.id}
                    value={`${campaignLabel(campaign)} ${campaign.brandName ?? ""}`}
                    onSelect={() => {
                      onChange(campaign.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === campaign.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex min-w-0 items-center gap-1.5">
                      {isSub && (
                        <GitBranch className="h-3 w-3 shrink-0 text-muted-foreground" />
                      )}
                      <div className="truncate">
                        {campaignLabel(campaign)}
                      </div>
                      {isSub && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          sub-campaign
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
