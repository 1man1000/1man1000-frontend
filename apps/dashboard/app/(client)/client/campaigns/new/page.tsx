"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerCreate,
  useCampaignsControllerFindOne,
  getCampaignsControllerGetClientCampaignsQueryKey,
  CreateCampaignDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import { type CampaignFormData } from "@/lib/schemas";
import { LoadingState } from "@/components/ui/loading-state";
import axios from "axios";

function CreateClientCampaignContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent");
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const { data: parentCampaign, isLoading: isLoadingParent } =
    useCampaignsControllerFindOne(parentId || "", {
      query: { enabled: !!parentId },
    });

  const createMutation = useCampaignsControllerCreate({
    mutation: {
      onSuccess: async (response, variables) => {
        // If there's a file, upload it after campaign creation
        const file = (variables as any).file;
        if (file && response.id) {
          setIsUploadingAsset(true);
          try {
            const formData = new FormData();
            formData.append("asset", file);

            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            await axios.post(
              `${apiUrl}/api/campaigns/${response.id}/upload-asset`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (error) {
            console.error("Error uploading asset:", error);
          } finally {
            setIsUploadingAsset(false);
          }
        }

        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerGetClientCampaignsQueryKey(),
        });
        router.push("/client/campaigns");
      },
      onError: (error) => {
        console.error("Error creating campaign:", error);
      },
    },
  });

  const onSubmit = (data: CampaignFormData, file?: File) => {
    // Create campaign with JSON data only
    const campaignData: CreateCampaignDto = {
      ...data,
      parentCampaignId: parentId || undefined,
    } as CreateCampaignDto;

    // Store file reference for upload after creation
    createMutation.mutate({ data: campaignData, file } as any);
  };

  const parent =
    parentCampaign && "brandName" in parentCampaign
      ? {
          id: parentCampaign.id,
          title: parentCampaign.title,
          brandName: parentCampaign.brandName,
          description: parentCampaign.description,
          industry: parentCampaign.industry,
          targetAudience: parentCampaign.targetAudience,
          clientId: parentCampaign.client?.id,
          adCreatives: parentCampaign.adCreatives,
          campaignAsset: parentCampaign.campaignAsset,
          paymentType: parentCampaign.paymentType as
            | "per_view"
            | "per_views"
            | undefined,
          paymentTiers: parentCampaign.paymentTiers?.map((tier) => ({
            lowerLimit: tier.lowerLimit,
            upperLimit: tier.upperLimit ?? null,
            amount: tier.amount,
          })),
          budget: parentCampaign.budget,
          targetViewRange: parentCampaign.targetViewRange,
          startDate: parentCampaign.startDate,
          endDate: parentCampaign.endDate,
        }
      : null;

  if (parentId && isLoadingParent) {
    return <LoadingState text="Loading..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={
              parent ? `/client/campaigns/${parentId}` : "/client/campaigns"
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {parent ? "Create Sub-Campaign" : "Create New Campaign"}
          </h1>
          <p className="text-muted-foreground">
            {parent
              ? `Create a sub-campaign under "${parent.title || parent.brandName}"`
              : "Launch a new marketing campaign to reach your audience"}
          </p>
        </div>
      </div>

      <CampaignForm
        submitLabel={parent ? "Create Sub-Campaign" : "Create Campaign"}
        cancelHref={
          parent ? `/client/campaigns/${parentId}` : "/client/campaigns"
        }
        isSubmitting={createMutation.isPending || isUploadingAsset}
        onSubmit={onSubmit}
        isError={createMutation.isError}
        errorText="Failed to create campaign. Please check your details and try again."
        showBudgetEstimate
        containerClassName="space-y-6"
        parentCampaign={parent}
      />
    </div>
  );
}

export default function CreateClientCampaignPage() {
  return (
    <Suspense>
      <CreateClientCampaignContent />
    </Suspense>
  );
}
