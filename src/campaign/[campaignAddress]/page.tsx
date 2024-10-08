"use client";

import { useState } from "react";
import { client } from "@/app/client";
import { useParams } from "next/navigation";
import { getContract } from "thirdweb";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import TierCard from "@/app/components/TierCard";

export default function CampaignPage() {
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useActiveAccount();

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
        {owner === account?.address && (
          <div className="flex flex-row">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
        )}
      </div>
      <div className="my-4">
        <p className="text-lg font-semibold">Description</p>
        <p>{campaignDescription}</p>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Deadline</p>
        {!isLoadingDeadline && <p>{deadlineDate.toDateString()}</p>}
      </div>
      {!isLoadingBalance && !isLoadingGoal && (
        <div className="mb-4">
          <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right"
              style={{ width: `${balancePercentage?.toString()}` }}
            >
              <p className="text-white dark:text-white text-xs p-1">
                ${balance?.toString()}
              </p>
            </div>
            <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
              {balancePercentage >= 100
                ? "100%"
                : `${balancePercentage?.toString()}%`}
            </p>
          </div>
        </div>
      )}

      <div>
        <p className="text-lg font-semibold">Tiers:</p>
        <div className="grid grid-cols-3 gap-4">
          {isLoadingTiers ? (
            <p>Loading...</p>
          ) : tiers && tiers.length > 0 ? (
            tiers.map((tier, index) => (
              <TierCard
                key={tier.name}
                tier={tier}
                index={index}
                contract={contract}
              />
            ))
          ) : (
            <p>No tiers found</p>
          )}
        </div>
      </div>
    </div>
  );
}
