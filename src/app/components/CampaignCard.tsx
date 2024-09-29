import { getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
  campaignAddress: string;
};

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress,
  });

  const { data: campaignName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

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

  const totalBalance = balance?.toString();
  const goalBalance = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(goalBalance as string)) * 100;

  if (balancePercentage > 100) {
    balancePercentage = 100;
  }

  return (
    // card stylying for campaign card, could easily be a MagicUI or ShadcnUI component
    <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slated-200 rounded-lg shadow">
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
    </div>
  );
}
