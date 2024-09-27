"use client";

import Image from "next/image";
import Link from "next/link";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "../client";
import { useActiveAccount, ConnectButton, lightTheme } from "thirdweb/react";

export default function Navbar() {
  const account = useActiveAccount();

  return (
    <nav className="bg-slate-100 border-b-2 border-b-slate-300">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <Image
                src={thirdwebIcon}
                alt="Thirdweb Logo"
                className="w-10 h-10 md:w-12 md:h-12"
                style={{
                  filter: "drop-shadow(0px 0px 8px #a726a9a8)",
                }}
              />
            </div>
            <Link href="/" className="text-slate-700 hover:text-slate-900">
              <p className="rounded-md px-3 py-2 text-sm font-medium">
                Campaigns
              </p>
            </Link>
            {account && (
              <Link
                href={`/dashboard/${account?.address}`}
                className="text-slate-700 hover:text-slate-900"
              >
                <p className="rounded-md px-3 py-2 text-sm font-medium">
                  Dashboard
                </p>
              </Link>
            )}
          </div>
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
    </nav>
  );
}
