"use client";

import { client } from "@/app/client";
import CampaignCard from "@/app/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { useState } from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useReadContract, useActiveAccount } from "thirdweb/react";

export default function DashboardPage() {
  const account = useActiveAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const { data, isLoading } = useReadContract({
    contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center mb-8">
          <p className="text-4xl font-semibold">Dashboard</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Create Campaign
          </button>
        </div>
        <p className="text-2xl font-semibold mb-4">My Campaigns:</p>
        <div className="grid grid-cols-3 gap-4">
          {!isLoading &&
            data &&
            (data && data.length > 0 ? (
              data.map((campaign, index) => (
                <CampaignCard
                  key={index}
                  campaignAddress={campaign.campaignAddress}
                />
              ))
            ) : (
              <p className="text-lg text-gray-500">No campaigns found</p>
            ))}
        </div>
      </div>
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
};

const CreateCampaignModal = ({ setIsModalOpen }: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(1);
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);

  const handleDeployContract = async () => {
    setIsDeployingContract(true);
    try {
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: baseSepolia,
        account: account!,
        contractId: "Crowdfunding",
        contractParams: [
          campaignName,
          campaignDescription,
          campaignGoal,
          campaignDeadline,
        ],
        publisher: "",
        version: "1.0.7",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
    }
  };

  const handleCampaignGoal = (value: number) => {
    if (value < 1) {
      setCampaignGoal(1);
    } else {
      setCampaignGoal(value);
    }
  };
  const handleCampaignLength = (value: number) => {
    if (value < 1) {
      setCampaignDeadline(1);
    } else {
      setCampaignDeadline(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="text-2xl font-semibold mb-4">Create Campaign</p>
        <button
          className="text-sm px-4 py-2 bg-slate 600 text-white rounded-md"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </div>
      <div className="flex flex-col">
        <label>Campaign Name</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Campaign Name"
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        />
        <label>Campaign Description</label>
        <textarea
          value={campaignDescription}
          onChange={(e) => setCampaignDescription(e.target.value)}
          placeholder="Campaign Description"
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        ></textarea>
        <label>Campaign Goal</label>
        <input
          type="number"
          value={campaignGoal}
          onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
          placeholder="Campaign Goal"
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        />
        <label>`Campaign Length (Days)`</label>
        <div className="flex space-x-4">
          <input
            type="number"
            value={campaignDeadline}
            onChange={(e) => handleCampaignLength(parseInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleDeployContract}
          >
            {isDeployingContract ? "Create Campaign..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};
