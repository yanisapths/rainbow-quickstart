import { useAppContext } from "@/context/app";
import { GoogleProfile, GoogleRequest } from "@/model/google.model";
import { Nonce } from "@/model/nonce.model";
import { Recaptcha } from "@/model/recaptcha.model";
import { GenSessionRequest } from "@/model/session.model";
import {
  checkExistingMember,
  generateSessionToken,
  getAccessTokenGoogle,
  getNonce,
  getUser,
} from "@/services/api";
import { Storage } from "@/services/storage";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGoogleLogin } from "@react-oauth/google";
import { watchNetwork } from "@wagmi/core";
import { verifyMessage } from "ethers";
import { useReCaptcha } from "next-recaptcha-v3";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import {
  useAccount,
  useBalance,
  useConnect,
  useNetwork,
  useSignMessage,
} from "wagmi";
import Modal from "../modal";
import RegisterForm from "../register-form";
import Image from "next/image";
import useWallet from "@/services/hook/useWallet";

export default function Wallet() {
  const storage = Storage.getInstance();
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [googleModal, setGoogleModal] = useState<boolean>(false);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const [showSignInButton, setShowSignInButton] = useState<boolean>(true);
  const recoveredAddress = useRef<string>();
  const { Loading } = useAppContext();
  const [googleProfile, setGoogleProfile] = useState<GoogleProfile>();
  const { loaded, executeRecaptcha } = useReCaptcha();
  const wallet = useWallet();

  const getRecaptchaToken = async () => {
    return await executeRecaptcha("form_submit");
  };

  // handle watch network
  const unwatch = watchNetwork((network) => {
    if (network && network.chain && network.chain.unsupported) {
      handleGoogleModal(false);
      handleReviewModal(false);
      handleResigsterForm(false);
    }
  });

  const handleGoogleModal = useCallback((input: any) => {
    setGoogleModal(input);
  }, []);

  const handleReviewModal = useCallback((input: any) => {
    setReviewModal(input);
  }, []);

  const handleResigsterForm = useCallback((input: any) => {
    setShowSignInButton(input);
  }, []);

  const handleSigned = useCallback((input: any) => {
    setIsSigned(input);
  }, []);

  const clearSession = () => {
    storage.clearGoogleToken();
    storage.clearProfile();
    storage.clearSessionToken();
    setGoogleProfile(undefined);
  };

  const getSession = () => {
    const profile: GoogleProfile = Storage.getInstance().getGoogleProfile();
    const session = Storage.getInstance().getSessionToken();
    return !!session && !!profile;
  };

  const session = useQuery(
    "session",
    () => {
      if (getSession()) {
        setIsSigned(true);
        const profile: GoogleProfile = Storage.getInstance().getGoogleProfile();
        if (account.address != profile.wallet) {
          console.log(account);
          clearSession();
          window.location.reload();
        }
      }
      return getSession();
    },
    {
      refetchInterval: 1000,
    }
  );

  const googleAuthen = async (accessToken: string) => {
    const request: GoogleRequest = { accessToken: accessToken };
    try {
      const token: Recaptcha = await { token: await getRecaptchaToken() };
      const res = await getAccessTokenGoogle(request, token);
      if (res.status == 200) {
        Loading.hide();
        setGoogleModal(false);
        setReviewModal(true);
        storage.setGoogleToken(accessToken);
        storage.setGoogleProfie(res.data.data);
        res.data.data.wallet = account.address;
        setGoogleProfile(res.data.data);
      }
    } catch (err) {
      Loading.hide();
   
      console.error(err);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      Loading.show();
      googleAuthen(tokenResponse.access_token);
    },
    onError: (tokenResponse) => {
      // toast.errorToast(tokenResponse.error_description)
    },
  });

  const { chain } = useNetwork();
  const checkNetwork = () => {
    return chain && !chain.unsupported;
  };

  const [network, setNetwork] = useState<string>("");
  const [arise, setArise] = useState<string>("");
  // handle account
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setNetwork(connector!.chains[0].name);
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      clearSession();
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
    if(balanceNative.data && balanceNative.isSuccess){
        setArise(Number(balanceNative.data.formatted).toLocaleString());
    }
  }, [balanceNative]);

  const connect = useConnect({
    onSuccess(data) {
      console.log("Connect", data);
    },
    onError(error) {
      console.log("Error", error);
    },
    onMutate(connector) {
      console.log("Before Connect", connector);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });

  const genSessionToken = async (signedMessage: any) => {
    if(nonce.data && account.address){
        try {
          const req: GenSessionRequest = {
            signedMessage: signedMessage,
            nonce: nonce.data.data.data.nonce,
            publicAddress: account.address,
          };
          const token: Recaptcha = await { token: await getRecaptchaToken() };
          const data = await generateSessionToken(req, token.token);
          storage.setSessionToken(data.data.data.sessionToken);
    
          const userInfo = await getUserInfo();
          if(userInfo){
              userInfo.data.data.wallet = account.address;
              storage.setGoogleProfie(userInfo.data.data);
              setGoogleProfile(userInfo.data.data);
          }
        } catch (err) {
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
    }
  };

  const { data, error, isLoading, signMessage, isError } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
      genSessionToken(data);
      setIsSigned(true);
    },
    onError(error) {
      console.log(error);
      if (error.message !== "Connector not found") {
        setIsSigned(false);
        // signedMessage.refetch()
      }
    },
  });

  const getUserInfo = async () => {
    try {
      const token: Recaptcha = await { token: await getRecaptchaToken() };
      return await getUser(token.token);
    } catch (err) {
      console.error(err);
    }
  };

  const isExistingMember = async (address: string) => {
    if (address) {
      try {
        const token: Recaptcha = await { token: await getRecaptchaToken() };
        return await checkExistingMember(address, token);
      } catch (err) {
        console.error(err);
   
      }
    }
  };

  const checkExisting = useQuery(
    [
      "checkExisting",
      checkNetwork() && account.isConnected && account.address && loaded,
    ],
    async () => {
      if (account.address) {
        const isExist = (await isExistingMember(account.address))!.data.data
          .isExist;
        if (await !isExist) {
          setGoogleModal(true);
          clearSession();
        } else {
          setGoogleModal(false);
          const profile: GoogleProfile =
            Storage.getInstance().getGoogleProfile();
          setGoogleProfile(profile);
        }
        return await isExist;
      }
    },
    {
      enabled:
        checkNetwork() && account.isConnected && !!account.address && loaded,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const nonce = useQuery(
    [
      "getNonce",
      account.isConnected &&
        checkExisting.status === "success" &&
        checkExisting.data &&
        !getSession() &&
        loaded,
    ],
    async () => {
      const token: Recaptcha = await { token: await getRecaptchaToken() };
      return await getNonce(token.token);
    },
    {
      enabled:
        account.isConnected &&
        checkExisting.status === "success" &&
        checkExisting.data &&
        !getSession() &&
        loaded,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const signedMessage = useQuery(
    [
      "signMessage",
      account.connector && account.isConnected && nonce.status === "success",
    ],
    async () => {
        if(nonce.data){

            const nonceResponse: Nonce = nonce.data.data.data;
            const message = `Please sign in with your Ethereum account: ${account.address}\n\nSign in with Ethereum to the app.\n\nWebsite: ${process.env.NEXT_PUBLIC_URL}\nNonce: ${nonceResponse.nonce}\nIssued At: ${nonceResponse.issuedAt}\nExpiration Time: ${nonceResponse.expiredAt}`;
            signMessage({ message });
        }
    },
    {
      enabled: account.isConnected && nonce.status === "success",
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <div className="wallet-button-wrapper">
        {checkNetwork() &&
          account.isConnected &&
          account.address &&
          checkExisting &&
          checkExisting.status === "success" &&
          !checkExisting.data &&
          showSignInButton && (
            <button
              className="relative mt-2  text-white bg-gradient-to-br
        from-pink-500 to-orange-400 hover:bg-gradient-to-bl
        font-small rounded-lg text-xl px-5 py-2 text-center mr-2 mb-2"
              onClick={() => {
                setGoogleModal(true);
              }}
            >
              REGISTER
            </button>
          )}

        <ConnectButton chainStatus="icon" />
        {checkExisting &&
          checkExisting.status === "success" &&
          checkExisting.data && !isSigned && (<>
        <button
        className="iekbcc0 iekbcc9 ju367v73 ju367v7o ju367v9c ju367vn ju367vec ju367vex ju367v11 ju367v1c ju367v2b ju367v8o _12cbo8i3 ju367v8m _12cbo8i4 _12cbo8i6"
        onClick={()=>{
            signedMessage.refetch();
        }}
        >Please Sign Message</button>
        </>)}
        {wallet.handleConnectWallet() &&
              isSigned &&
            <div className="flex gap-4 items-center" >
          <div className="flex flex-row items-center gap-1 md:gap-3 p-2 rounded-lg bg-shadow">
            {wallet.handleConnectWallet() &&
              balance.isSuccess &&
              balance.data &&
              isSigned && (
                <p className="mt-1 ml-1">
                  {Number(balance.data.formatted).toLocaleString()}{" "}
                  {process.env.NEXT_PUBLIC_ASTR_TOKEN_NAME}
                </p>
              )}
          </div>
          
        </div>}
      </div>
      {googleModal && (
        <Modal title={"Register"} isOpen={true} callback={handleGoogleModal}>
          <div className="flex flex-col mt-12">
            <button className="google-signin p-4" onClick={() => login()}>
              <i className="google-icon"></i> Sign in with Google
            </button>
          </div>
        </Modal>
      )}
      {reviewModal && (
        <Modal
          title={"Review your information"}
          isOpen={true}
          callback={handleReviewModal}
        >
          <div className="mt-12">
            <RegisterForm
              closeModal={setReviewModal}
              profile={googleProfile}
              callback={handleResigsterForm}
              signed={handleSigned}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
