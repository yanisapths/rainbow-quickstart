import { GoogleProfile } from "@/model/google.model";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { Storage } from "@/services/storage";
import { checkExistingMember, getUser } from "../api";
import useGoogleRecaptcha from "./useRecaptcha";
import { useQuery } from "react-query";

const useWallet = () => {
  const recapcha = useGoogleRecaptcha();
  const { chain } = useNetwork();
  const checkNetwork = () => {
    return chain && !chain.unsupported;
  };

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });

  const balance = useBalance({
    address: account.address,
    token: `0x${process.env.NEXT_PUBLIC_ASTR_TOKEN}`,
  });

  const getSession = () => {
    const profile: GoogleProfile = Storage.getInstance().getGoogleProfile();
    const session = Storage.getInstance().getSessionToken();
    return !!session && !!profile;
  };

  const handleConnectWallet = () => {
    return checkNetwork() && account.isConnected && getSession();
  };

  const getUserInfo = async () => {
    try {
      return await getUser((await recapcha.token()).token);
    } catch (err) {
      console.error(err);
    }
  };

  const callGetUserProfileService = useQuery(
    "callGetUserProfileService",
    async () => {
      const res = await getUserInfo();
      if (res) {
        res.data.data.wallet = res.data.data.walletAddress;
        res.data.data.displayImage = `${
          res.data.data.displayImage
        }?${Math.random()}`;
        Storage.getInstance().setGoogleProfie(res.data.data);
      }

      return;
    },
    {
      enabled: false,
    }
  );

  const checkExisting = useQuery(
    [
      "checkExisting",
      checkNetwork() &&
        account.isConnected &&
        account.address &&
        recapcha.loaded,
    ],
    async () => {
      if (account.address) {
        const isExist = (await isExistingMember(account.address))?.data.data
          .isExist;
        return await isExist;
      }
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const isExistingMember = async (address: string) => {
    if (address) {
      try {
        return await checkExistingMember(address, await recapcha.token());
      } catch (err) {
        console.error(err);
      }
    }
  };

  return {
    handleConnectWallet,
    account,
    balance,
    getSession,
    callGetUserProfileService,
    checkExisting: checkExisting.data,
  };
};

export default useWallet;
