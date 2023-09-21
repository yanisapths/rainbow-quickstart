import useWallet from "@/services/hook/useWallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useConnect, useNetwork } from "wagmi";

export default function Wallet() {
  const wallet = useWallet();
  const { chain } = useNetwork();

  const [network, setNetwork] = useState<string>("");
  const [arise, setArise] = useState<string>("");
  // handle account
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setNetwork(connector!.chains[0].name);
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });

  // handle balance
  const balance = useBalance({
    address: account.address,
    token: `0x${process.env.NEXT_PUBLIC_ASTR_TOKEN}`,
  });

  // handle balance native
  const balanceNative = useBalance({
    address: account.address,
  });

  useEffect(() => {
    if (balanceNative.data && balanceNative.isSuccess) {
      setArise(Number(balanceNative.data.formatted).toLocaleString());
    }
  }, [balanceNative]);


  return (
    <>
      <div className="wallet-button-wrapper">
        <div className="py-2">
          <ConnectButton chainStatus="icon" />
        </div>

        {wallet.handleConnectWallet() && (
          <div className="flex gap-4 items-center">
            <div className="flex flex-row items-center gap-1 md:gap-3 p-2 rounded-lg bg-shadow">
              {wallet.handleConnectWallet() &&
                balance.isSuccess &&
                balance.data && (
                  <p className="mt-1 ml-1">
                    {Number(balance.data.formatted).toLocaleString()}{" "}
                    {process.env.NEXT_PUBLIC_ASTR_TOKEN_NAME}
                  </p>
                )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
