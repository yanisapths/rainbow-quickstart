import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function NFT({ nft, link }: NFTProps) {
  const [detail, setDetail] = useState<NFTMetadata>();
  const metaData = `${
    process.env.NEXT_PUBLIC_NFT_META_DATA
  }/${nft.contractAddress.toLocaleLowerCase()}/${nft.tokenId}`;
  const fetchImage = async () => {
    try {
      const res = await fetch(metaData);
      console.log({res:res})
      if (res.status == 200) {
        const result = await res.json();
        setDetail(result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <>
      {detail && (
        <Link href={`${link}`}>
          <div className="col-span-1 flex flex-col campaigns">
            <div
              className="image"
              style={{ backgroundImage: `url(${detail.image})` }}
            ></div>

            <div className="mb-4 flex flex-wrap p-4">
              <span className="mr-2 tags">{nft.assetType}</span>
            </div>
            <h2 className="font-bold text-md text-white pr-4 pl-4">
              {detail.name}
            </h2>
            <div className="flex flex-wrap mt-auto pt-3 text-xs p-4">
              <p className="mr-2 mb-2 flex items-center gap-1 text-white font-light ">
                <Image
                  src={nft.eventTag}
                  alt={nft.eventName}
                  width={"20"}
                  height={"20"}
                />
                {nft.eventName}
              </p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
export interface GetAssetsRes {
    campaignId:      number;
    campaignName:    string;
    eventName:       string;
    eventTag:        string;
    contractAddress: string;
    tokenId:         number;
    assetType: string;
}

export interface NFTMetadata {
    name:          string;
    description:   string;
    image:         string;
    external_link: string;
    attributes:    Attribute[];
}

export interface Attribute {
    trait_type: string;
    value:      string | number;
}

export interface NFTProps {
  nft: GetAssetsRes;
  link: string;
}