import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { GetAssetsRes, NFT } from "@/components/nft/NFT";
import { Key, useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers";
import Wallet from "@/components/wallet/index";
import useOwnerTokenId from "@/services/hook/useOwnerToTokenId";
import useWallet from "@/services/hook/useWallet";
import { ariseSoulAddress } from "@/constants";

const Home: NextPage = () => {
  const [network, setNetwork] = useState<string>("");
  const wallet = useWallet();
  const ownerTokenId = useOwnerTokenId(ariseSoulAddress,wallet);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  console.log(process.env.BOT_TOKEN)

  const requestGrantRole = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/grant-role", {
        method: "POST",
        body: JSON.stringify({ ownerTokenId }), 
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setMessage(data.message || data.error);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="h-screen flex flex-col justify-center items-center">
        <Wallet />

        <div className="py-4 ">
          <NFT />
        </div>

        {account.address && (
          <div className="px-6 py-3 rounded-full btn bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-3xl shadow-gray-800 cursor-pointer hover:shadow-blue-500">
            <button className="text-white" onClick={requestGrantRole}>
              <span>Give me the role</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
