import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function useContract(
  jsonInterface: any,
  address?: string | undefined,
  options?: Record<string, any> | undefined
) {
  const [contract, setContract] = useState<any>();
  const { web3 } = useMoralis();

  useEffect(() => {
    if (web3) {
      const { Contract } = web3.eth;
      const osContracts = new Contract(jsonInterface, address);
      setContract(osContracts);
    }
  }, [web3, address, options, jsonInterface]);

  return contract as Contract;
}
