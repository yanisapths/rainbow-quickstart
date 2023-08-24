import { GoogleProfile } from "../../model/google.model";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { Storage } from "../storage";

const mockUserInfo = {
  id: "1",
  employeeId: "123123",
  firstName: "Yanisa",
  lastName: "P",
  displayName: "string",
  displayImage: "url",
  team: "string",
  role: "string",
  bio: "string",
  email: "string",
  walletAddress: "string",
};
const useWallet = () => {
  const { chain } = useNetwork();
  const checkNetwork = () => {
    return chain && !chain.unsupported;
  };

  const getSession = () => {
    const profile: GoogleProfile = Storage.getInstance().getGoogleProfile();
    const session = Storage.getInstance().getSessionToken()
      ? Storage.getInstance().getSessionToken()
      : undefined;
    return !!session && !!profile;
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
  });

  const handleConnectWallet = () => {
    return checkNetwork() && account.isConnected;
  };

  const callGetUserProfileService = () => {
    Storage.getInstance().setGoogleProfie(mockUserInfo);
  };

  return {
    handleConnectWallet,
    account,
    balance,
    getSession,
    callGetUserProfileService,
  };
};

export default useWallet;
