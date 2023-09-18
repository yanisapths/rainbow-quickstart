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
  const { loaded, executeRecaptcha } = useReCaptcha();
  const recapcha = useGoogleRecaptcha();
  const storage = Storage.getInstance();
  const [network, setNetwork] = useState<string>("");
  const [googleProfile, setGoogleProfile] = useState<GoogleProfile>();
  const [token, setToken] = useState<string>();
  const [nonceRes, setNonceRes] = useState<Nonce>();
  const [isSigned, setIsSigned] = useState<boolean>(false);

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

  const getProfile = () => {
    const profile: GoogleProfile = Storage.getInstance().getGoogleProfile();

    return profile;
  };

  const userProfile = useQuery(
    "userProfile",
    () => {
      return getProfile();
    },
    {
      refetchInterval: 1000,
    }
  );

  const getAssetsService = async () => {
    const req: GetAssetsReq = {
      walletAddress: userProfile?.data?.wallet || "",
    };
    if (token) {
      try {
        return await getAssets(token, req);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const assetsProfile = useQuery(
    "assetsProfile",
    () => {
      return getAssetsService();
    },
    {
      enabled: userProfile.isSuccess,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        {assetsProfile.data ? (
          assetsProfile.data.data.data.map((nft: GetAssetsRes, key: Key) => {
            return (
              <div key={key} className="">
                <NFT
                  nft={nft}
                  link={`/nft/?id=${
                    nft.tokenId
                  }&address=${nft.contractAddress.toLocaleLowerCase()}`}
                />
              </div>
            );
          })
        ) : (
          <div className="rounded-full bg-black">
            <p className="p-2 uppercase">no data</p>
          </div>
        )}
        {account.address}
        {userProfile.data && <p>{userProfile.data.employeeId}</p>}
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
