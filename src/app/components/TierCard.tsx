import { ThirdwebContract } from "thirdweb/contract";
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export default function TierCard({
  tier,
  index,
  contract,
  isEditing,
}: TierCardProps) {
  return (
    <div className="max-w-sm flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-lg shadow">
      <div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-semibold">{tier.name}</p>
          <p className="text-xl font-semibold">${tier.amount.toString()}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs font-semibold">
          Total Backers: {tier.backers.toString()}
        </p>
        <TransactionButton
          className="m-4 bg-[#2563EB] text-white p-[0.5rem_1rem] rounded-[0.375rem] cursor-pointer"
          transaction={() =>
            prepareContractCall({
              contract: contract,
              method: "function fund(uint256 _tierIndex) payable",
              params: [BigInt(index)],
            })
          }
          onTransactionConfirmed={async () => alert("Funded Successfully!")}
        >
          Select
        </TransactionButton>
      </div>
      {isEditing && (
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract: contract,
              method: "function removeTier(uint256 _index)",
              params: [BigInt(index)],
            })
          }
          onTransactionConfirmed={async () =>
            alert("Tier Removed Successfully!")
          }
        >
          Remove
        </TransactionButton>
      )}
    </div>
  );
}
