import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const useGetENSByAddress = ({ address }: { address: string }) => {
  // const { ethers } = useBlockchain()
  const [name, setName] = useState<string | null>("");

  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/JANw7_5C171cj-buFVibsh1jIZAwe4Yq"
  );
  useEffect(() => {
    if (address !== null) {
      (async () => {
        try {
          const respName = await provider?.lookupAddress(address);
          console.log("😮", respName);
          setName(respName);
        } catch {
          setName(null);
        }
      })();
    }
  }, [address]);

  return name;
};
