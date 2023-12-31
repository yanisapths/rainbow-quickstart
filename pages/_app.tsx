import {
  Chain,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Layouts from "../components/layout/layout";
import "../styles/globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const ariseChain: Chain = {
  id: 4833,
  name: "Arise Testnet",
  network: "arisetestnet",
  iconUrl: `${process.env.NEXT_PUBLIC_URL}/images/arise-network.png`,
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Arise",
    symbol: "Arise",
  },
  rpcUrls: {
    default: {
      http: ["https://aster-rpc-nonprd.arisetech.dev"],
    },
    public: {
      http: [],
      webSocket: undefined,
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [ariseChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Meta Mask Wallet",
    wallets: [metaMaskWallet({ chains, projectId: "..." })],
  },
]);

const config = createConfig({
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClientRef = useRef<any>();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH!;
  
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  return (
        <GoogleOAuthProvider clientId={clientId}>
          <QueryClientProvider client={queryClientRef.current}>
            <WagmiConfig config={config}>
              <RainbowKitProvider chains={chains} coolMode>
                <Layouts>
                  <Component {...pageProps} />
                </Layouts>
              </RainbowKitProvider>
            </WagmiConfig>
          </QueryClientProvider>
        </GoogleOAuthProvider>
  );
}

export default MyApp;
