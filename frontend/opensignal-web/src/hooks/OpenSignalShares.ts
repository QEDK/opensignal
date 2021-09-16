import React from "react";
import { isAddress } from "../util/eth.util";
import { CONTRACTS } from "./Contract.hook";
import Web3 from "web3";
import { ethers } from "ethers";

const useGetShareBalance = (
  deploymentAddr?: string,
  addr?: string,
  trigger = false,
) => {
  const [balance, setbalance] = React.useState<string>("");
  const [loading, setloading] = React.useState<boolean>(false);
  const [err, seterr] = React.useState<any>(null);
  React.useMemo(async () => {
    if (
      isAddress(deploymentAddr) &&
      addr &&
      isAddress(addr) &&
      isAddress(addr)
    ) {
      setbalance("");
      setloading(true);
      seterr(null);
      try {
        const myweb3: any = new Web3(window.ethereum);
        const shareContract = new myweb3.eth.Contract(
          CONTRACTS.OpenSignalShares.abi,
          deploymentAddr,
        );

        const balance = await shareContract.methods.balanceOf(addr).call();

        setbalance(ethers.utils.formatEther(balance).toString());
        setloading(false);
        seterr(null);
      } catch (err) {
        console.log("err", err);
        setbalance("");
        setloading(false);
        seterr(err);
      }
    } else {
      setbalance("");
      setloading(false);
      seterr(null);
    }
  }, [addr, deploymentAddr, trigger]);
  return [balance, loading, err];
};

const useGetShareAllowance = (
  opensignalContractAddress?: string,
  shareContractAddress?: string,
  addr?: string,
  trigger = false,
) => {
  const [allowance, setallowance] = React.useState<string>("");
  const [loading, setloading] = React.useState<boolean>(false);
  const [err, seterr] = React.useState<any>(null);
  React.useMemo(async () => {
    if (
      shareContractAddress &&
      isAddress(shareContractAddress) &&
      opensignalContractAddress &&
      isAddress(opensignalContractAddress) &&
      addr &&
      isAddress(addr) &&
      isAddress(addr)
    ) {
      setallowance("");
      setloading(true);
      seterr(null);
      try {
        const shareContract = getShareContract(shareContractAddress);

        const allowance = await shareContract.methods
          .allowance(addr, opensignalContractAddress)
          .call();
        console.log("allowance", allowance);
        setallowance(allowance);
        setloading(false);
        seterr(null);
      } catch (err) {
        console.log("err123123", err);
        setallowance("");
        setloading(false);
        seterr(err);
      }
    } else {
      setallowance("");
      setloading(false);
      seterr(null);
    }
  }, [addr, opensignalContractAddress, shareContractAddress, trigger]);
  return [allowance, loading, err];
};

const getShareContract = (deploymentAddr: string) => {
  const myweb3: any = new Web3(window.ethereum);
  return new myweb3.eth.Contract(
    CONTRACTS.OpenSignalShares.abi,
    deploymentAddr,
  );
};

const useGetTotalSupply = (shareContractAddress?: string, trigger = false) => {
  const [totalSupply, settotalSupply] = React.useState<string>("");
  const [loading, setloading] = React.useState<boolean>(false);
  const [err, seterr] = React.useState<any>(null);
  React.useMemo(async () => {
    if (shareContractAddress && isAddress(shareContractAddress)) {
      settotalSupply("");
      setloading(true);
      seterr(null);
      try {
        const shareContract = getShareContract(shareContractAddress);

        const totalSupply = await shareContract.methods.totalSupply().call();
        console.log("totalSupply", totalSupply);
        settotalSupply(totalSupply);
        setloading(false);
        seterr(null);
      } catch (err) {
        console.log("err123123", err);
        settotalSupply("");
        setloading(false);
        seterr(err);
      }
    } else {
      settotalSupply("");
      setloading(false);
      seterr(null);
    }
  }, [shareContractAddress, trigger]);
  return [totalSupply, loading, err];
};

export {
  useGetShareBalance,
  useGetShareAllowance,
  getShareContract,
  useGetTotalSupply,
};
