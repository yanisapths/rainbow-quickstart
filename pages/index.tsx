import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { GetAssetsRes, NFT } from "@/components/nft/NFT";
import { Key, useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  generateSessionToken,
  getAssets,
  getNonce,
  getUser,
} from "@/services/api";
import { Storage } from "@/services/storage";
import { GetAssetsReq } from "@/model/nft.model";
import { GoogleProfile } from "@/model/google.model";
import useGoogleRecaptcha from "@/services/hook/useRecaptcha";
import { useReCaptcha } from "next-recaptcha-v3";
import { Recaptcha } from "@/model/recaptcha.model";
import { GenSessionRequest } from "@/model/session.model";
import { useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers";
import Wallet from "@/components/wallet/index";

const Home: NextPage = () => {
  const [network, setNetwork] = useState<string>("");

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
        <div className="py-4">
        <NFT/>
        </div>
      </main>
    </div>
  );
};

export default Home;

export interface Nonce {
  nonce: string;
  issuedAt: string;
  expiredAt: string;
}
