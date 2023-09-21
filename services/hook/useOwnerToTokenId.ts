import { useState, useEffect } from 'react';
import AsterSoulABI from "@/artifacts/abi/aster-soul/AsterSoul.json";
import AsterSoulRenderUtilsABI from "@/artifacts/abi/aster-soul/AsterSoulRenderUtils.json";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from 'ethers';

function useOwnerTokenId(contractAddress: any, wallet: any) {
  const [tokenId, setTokenId] = useState<number | null>(null);

  useEffect(() => {
    if (!wallet.account.address) {
      setTokenId(null);
      return;
    }

    async function fetchOwnerToTokenId() {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          AsterSoulABI.abi,
          wallet.provider
        );
       

        const ownerToTokenId = await contract.ownerToTokenId(wallet.account.address);
        setTokenId(BigNumber.from(ownerToTokenId).toNumber());
      } catch (error) {
        console.error(error);
        setTokenId(null);
      }
    }

    fetchOwnerToTokenId();
  }, [contractAddress, wallet.account.address, wallet.provider]);

  return tokenId;
}

export default useOwnerTokenId;
