import type { NextPage } from "next";
import Head from "next/head";
import { NFT } from "@/components/nft/NFT";
import { useState } from "react";
import { useAccount } from "wagmi";
import Wallet from "@/components/wallet/index";
import useOwnerTokenId from "@/services/hook/useOwnerToTokenId";
import useWallet from "@/services/hook/useWallet";
import { ariseSoulAddress } from "@/constants";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/CustomToast";
import Button from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

const Home: NextPage = () => {
  const router = useRouter();
  const wallet = useWallet();
  const ownerTokenId = useOwnerTokenId(ariseSoulAddress, wallet);

  const [network, setNetwork] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isGrantingRole, setIsGrantingRole] = useState<boolean>(false);
  const user_id = router.query.user_id;

  // handle account
  const account = useAccount({
    onConnect({ address, connector }) {
      setNetwork(connector!.chains[0].name);
    },
    onDisconnect() {},
  });

  const requestGrantRole = async () => {
    try {
      setLoading(true);
      setIsGrantingRole(true);
      const response = await fetch("/api/grant-role", {
        method: "POST",
        body: JSON.stringify({
          ownerTokenId,
          user_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      toast({
        title: "Congratulations! 🎉",
        message: "You received Arise Soul role!",
        type: "success",
      });
      if (response.ok) router.push({ pathname: "/success" });
      setMessage(data.message || data.error);
    } catch (e) {
      toast({
        title: "Error granting role",
        message: "Please try again",
        type: "error",
      });
    } finally {
      setLoading(false);
      setIsGrantingRole(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Verify App</title>
        <meta
          content="Verify your NFT to access secret room on poc server"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="h-screen text-white">
        <div className="py-3 flex flex-col justify-center text-center items-center pt-20">
          <h1 className="text-4xl pb-2">Welcome</h1>
          <p className="text-lg w-full">
            To join secret rooms in POC Discord server, you will need to verify
            that you have an Arise Soul.
          </p>
          <p>
            To get started, click Connect Wallet below to begin then grant
            yourself a role
          </p>
        </div>
        <div className="flex justify-center text-center items-center">
          <Wallet />
        </div>
        <div className="flex justify-center text-center items-center py-4">
          <div className="flex flex-col">
            {ownerTokenId && (
              <div className="py-4">
                <NFT />
              </div>
            )}

            {account.address && ownerTokenId && user_id && (
              <Button onClick={requestGrantRole} size="lg">
                <p>{isGrantingRole ? "Granting role" : "Give me the role"}</p>
                {isGrantingRole ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : null}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
