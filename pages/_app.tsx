import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layouts from "../components/layout/layout";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "ecfb0f367ce95fd57f80c58df2befe9c",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const clientId: string = process.env.NEXT_PUBLIC_GOOGLE_AUTH!;
  return (
    <SessionProvider session={session}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Layouts>
            <Component {...pageProps} />
          </Layouts>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}

export default MyApp;
