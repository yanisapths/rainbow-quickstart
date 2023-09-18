import {
  Chain,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Layouts from "../components/layout/layout";
import "../styles/globals.css";

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
      http: [process.env.RPC_URL!],
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
  return (
    <SessionProvider session={session}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains} coolMode>
          <Layouts>
            <Component {...pageProps} />
          </Layouts>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}

export default MyApp;
