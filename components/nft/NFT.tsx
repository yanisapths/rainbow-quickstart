import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import AsterSoulABI from "@/artifacts/abi/aster-soul/AsterSoul.json";
import AsterSoulRenderUtilsABI from "@/artifacts/abi/aster-soul/AsterSoulRenderUtils.json";
import { useContractRead } from "wagmi";
import type { BigNumberish } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import useWallet from "@/services/hook/useWallet";

export interface SlotParts {
  childAssetMetadata: ChildAssetMetadata;
  z: number;
}
interface ChildAssetMetadata {
  id: number;
  trait_type: string;
  value: string;
  image: string;
}
export function NFT() {
  const [slotParts, setSlotParts] = useState<SlotParts[]>([]);
  const wallet = useWallet();
  const [ownerToTokenId, setOwnerToTokenId] = useState<number>(0);
  // ownerToTokenId
  const contractOwnerToTokenId = useContractRead({
    address: process.env.NEXT_PUBLIC_ABI_ADDRESS_ASTERSOUL as any,
    abi: AsterSoulABI.abi,
    functionName: "ownerToTokenId",
    args: [wallet.account.address],
    enabled: !!wallet.account.address,
    onSuccess(data: any) {
      setOwnerToTokenId(BigNumber.from(data).toNumber());
    },
    onError(error) {
      console.log(error);
    },
  });

  // composeEquippables
  const contractComposeEquippables = useContractRead({
    address: process.env.NEXT_PUBLIC_ABI_ADDRESS_ASTERSOUL_RENDER_UTILS as any,
    abi: AsterSoulRenderUtilsABI.abi,
    functionName: "composeEquippables",
    args: [process.env.NEXT_PUBLIC_ABI_ADDRESS_ASTERSOUL, ownerToTokenId, 1],
    enabled: !!wallet.account.address && !!ownerToTokenId,
    onSuccess(data: any) {
      const parts = data[4]
        .filter((e: any) => e.childAssetMetadata !== "")
        .map((e: any) => ({
          childAssetMetadata: JSON.parse(e.childAssetMetadata),
          z: e.z,
        }));
      setSlotParts(parts);
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <section>
      <div
        className="nft-gen-image relative bg-white"
        style={{
          borderRadius: "0.5rem 0.5rem 0 0",
          backgroundImage: `url(/images/nft/generator/bg-001.png)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {slotParts &&
          slotParts.map((slot, k) => {
            return (
              <div
                key={k}
                className="nft-gen-image absolute"
                style={{
                  zIndex: `${slot.z}`,
                  backgroundImage: `url(${slot.childAssetMetadata.image})`,
                }}
              ></div>
            );
          })}
      </div>
    </section>
  );
}
export interface GetAssetsRes {
  campaignId: number;
  campaignName: string;
  eventName: string;
  eventTag: string;
  contractAddress: string;
  tokenId: number;
  assetType: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
  attributes: Attribute[];
}

export interface Attribute {
  trait_type: string;
  value: string | number;
}

export interface NFTProps {
  nft?: GetAssetsRes;
  link?: string;
}
