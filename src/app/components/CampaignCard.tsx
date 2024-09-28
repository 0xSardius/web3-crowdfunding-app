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

  const { data: campaignName, isLoading } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  return (
    <div>
      <p>Campaign</p>
    </div>
  );
}
