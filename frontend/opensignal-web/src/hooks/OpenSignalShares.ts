import React from 'react';
import {isAddress} from '../util/eth.util';
import {CONTRACTS} from './Contract.hook';
import Web3 from 'web3';
import {ethers} from 'ethers';

const useGetShareBalance = (
    deploymentAddr?: string,
    addr?: string,
    trigger = false
) => {
    const [balance, setbalance] = React.useState<string>('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (
            isAddress(deploymentAddr) &&
            addr &&
            isAddress(addr) &&
            isAddress(addr)
        ) {
            setbalance('');
            setloading(true);
            seterr(null);
            try {
                let myweb3: any = new Web3(window.ethereum);
                const shareContract = new myweb3.eth.Contract(
                    CONTRACTS.OpenSignalShares.abi,
                    deploymentAddr
                );

                const balance = await shareContract.methods
                    .balanceOf(addr)
                    .call();

                setbalance(
                    ethers.utils.formatEther(parseInt(balance)).toString()
                );
                setloading(false);
                seterr(null);
            } catch (err) {
                setbalance('');
                setloading(false);
                seterr(err);
            }
        } else {
            setbalance('');
            setloading(false);
            seterr(null);
        }
    }, [addr, deploymentAddr, trigger]);
    return [balance, loading, err];
};

export {useGetShareBalance};
