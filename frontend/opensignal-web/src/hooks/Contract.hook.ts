import React from "react";
import Web3 from "web3";
import CONTRACTS from "../contracts/hardhat_contracts.json";
const CONTRACT_DATA: any = CONTRACTS;
const useGetOpenSignalContract = (contractAddress: string, trigger = false) => {
    const [contract, setcontract] = React.useState(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contractAddress) {
            try {
                const myweb3: any = new Web3(window.ethereum);

                setcontract(new myweb3.eth.Contract(CONTRACT_DATA.OpenSignal.abi, contractAddress));
                seterr(null);
            } catch (err) {
                console.log("err", err);
                seterr(err);
            }
        }
    }, [trigger, contractAddress]);
    return [contract, loading, err];
};

const useGetOpenSignalTokenContract = (contractAddress: string, trigger = false) => {
    const [contract, setcontract] = React.useState(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contractAddress) {
            try {
                const myweb3: any = new Web3(window.ethereum);

                setcontract(
                    new myweb3.eth.Contract(CONTRACT_DATA.OpenSignalToken.abi, contractAddress),
                );
                seterr(null);
            } catch (err) {
                seterr(err);
            }
        }
    }, [trigger, contractAddress]);
    return [contract, loading, err];
};

const useGetOpenSignalProxyContract = (contractAddress: string, trigger = false) => {
    const [contract, setcontract] = React.useState(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contractAddress) {
            try {
                const myweb3: any = new Web3(window.ethereum);

                setcontract(new myweb3.eth.Contract(CONTRACT_DATA.OpenSignal.abi, contractAddress));
                seterr(null);
            } catch (err) {
                seterr(err);
            }
        }
    }, [trigger, contractAddress]);
    return [contract, loading, err];
};

const useGetRewardsDistributionContract = (contractAddress: string, trigger = false) => {
    const [contract, setcontract] = React.useState(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contractAddress) {
            try {
                const myweb3: any = new Web3(window.ethereum);

                setcontract(
                    new myweb3.eth.Contract(CONTRACT_DATA.rewardsDistribution.abi, contractAddress),
                );
                seterr(null);
            } catch (err) {
                seterr(err);
            }
        }
    }, [trigger, contractAddress]);
    return [contract, loading, err];
};

export {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
    useGetOpenSignalProxyContract,
    CONTRACT_DATA as CONTRACTS,
    useGetRewardsDistributionContract,
};
