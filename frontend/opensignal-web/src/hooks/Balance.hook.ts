import Web3 from "web3";
import React from "react";
import { HttpProviderBase } from "web3-core-helpers";
import { isAddress } from "../util/eth.util";

const useGetBalance = (addr: string, provider: HttpProviderBase, trigger = false) => {
  const [balance, setbalance] = React.useState("");
  React.useMemo(async () => {
    if (provider && addr && isAddress(addr)) {
      try {
        const web3 = new Web3(provider);
        const a = Number(await web3.eth.getBalance(addr)) / 1e18;
        const b = parseFloat(a.toString()).toFixed(2);
        setbalance(b);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setbalance("");
    }
  }, [addr, provider, trigger]);
  return balance;
};

export { useGetBalance };
