import React from 'react';
import Web3 from 'web3';
import CONTRACTS from '../contracts/hardhat_contracts.json';
const CONTRACT_DATA: any = CONTRACTS;
const useGetOpenSignalContract = (metadata: any, trigger = false) => {
    const [contract, setcontract] = React.useState(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (metadata) {
            try {
                let myweb3: any = new Web3(window.ethereum);
                setcontract(
                    new myweb3.eth.Contract(
                        CONTRACT_DATA.OpenSignal.abi,
                        metadata.properties.address
                    )
                );
                seterr(null);
            } catch (err) {
                seterr(err);
            }
        }
    }, [trigger, metadata]);
    return [contract, loading, err];
};

const useGetOpenSignalTokenContract = (metadata: any, trigger = false) => {
    const [contract, setcontract] = React.useState(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (metadata) {
            try {
                let myweb3: any = new Web3(window.ethereum);

                setcontract(
                    new myweb3.eth.Contract(
                        CONTRACT_DATA.OpenSignalToken.abi,
                        metadata.properties.address
                    )
                );
                seterr(null);
            } catch (err) {
                seterr(err);
            }
        }
    }, [trigger, metadata]);
    return [contract, loading, err];
};

export {
    useGetOpenSignalContract,
    useGetOpenSignalTokenContract,
    CONTRACT_DATA as CONTRACTS,
};
