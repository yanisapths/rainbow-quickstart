import useWallet from "@/services/hook/useWallet";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const [network, setNetwork] = useState<string>("");
  const wallet = useWallet();

  // handle account

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

      <main className="h-screen flex flex-col justify-center items-center">
      </main>
    </div>
  );
};

export default Home;
