import Image from "next/image";
import Link from "next/link";
import thirdwebIcon from "@public/thirdweb.svg";
import { useActiveAccount } from "thirdweb/react";

export default function Navbar() {
  const account = useActiveAccount();

  return (
    <nav className="bg-slate-100 border-b-2 border-b-slate-300">
      <div className="mx-auto max-w-7xl px-2 sm:px-6">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-cetner sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                src={thirdwebIcon}
                alt=""
                className="size-[150px] md:size-[150px]"
                style={{
                  filter: "drop-shadow(0px 0px 24px #a726a9a8)",
                }}
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link href="/">
                  <p className="rounded-md px-3 py-2 text-sm font-medium text-slate-700">
                    Campaigns
                  </p>
                </Link>
                {account && (
                  <Link href={`/dashboard/${account?.address}`}>
                    <p className="rounded-md px-3 py-2 text-sm font-medium text-slate-700">
                      Dashboard
                    </p>
                  </Link>
                )}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm-pr-0">
              <ConnectButton
                client={client}
                theme={lightTheme()}
                detailsButton={{
                  style: {
                    maxHeight: "50px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
