"use client";

import { client } from "@/app/client";
import { useParams } from "next/navigation";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";

export default function CampaignPage() {
  const { campaignAddress } = useParams();
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress as string,
  });

  const { data: campaignName, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription, isLoading: isLoadingDescription } =
    useReadContract({
      contract: contract,
      method: "function description() view returns (string)",
      params: [],
    });

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const deadlineDate = new Date(
    parseInt(deadline?.toString() as string) * 1000
  );
  const deadlineDatePassed = deadlineDate < new Date();

  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract: contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: status } = useReadContract({
    contract,
    method: "function status() view returns (uint8)",
    params: [],
  });

  const totalBalance = balance?.toString();
  const goalBalance = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(goalBalance as string)) * 100;

  if (balancePercentage > 100) {
    balancePercentage = 100;
  }

  return (
    <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center">
        {!isLoadingName && (
          <p className="text-4xl font-semi-bold">{campaignName}</p>
        )}
      </div>
    </div>
  );
}
