import useWallet from "@/services/hook/useWallet";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAccount } from "wagmi";

const Success: NextPage = () => {
  const [network, setNetwork] = useState<string>("");
  const wallet = useWallet();

  // handle account
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setNetwork(connector!.chains[0].name);
    },
    onDisconnect() {},
  });

  return (
    <div>
      <Head>
        <title>Verify App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="h-screen flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl pb-8">Success</h1>
        <p className="">Your Discord account will be updated soon.</p>
        <p>
         You may close this page.
        </p>
      </main>
    </div>
  );
};

export default Success;
