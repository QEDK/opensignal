import React from 'react';
import {isAddress} from '../util/eth.util';

const useGetAllowance = (
    addr: string,
    tokenContract: any,
    opensignalContractAddr: string,
    trigger = false
) => {
    const [allowance, setallowance] = React.useState(0);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (
            addr &&
            isAddress(addr) &&
            isAddress(tokenContract.address) &&
            isAddress(opensignalContractAddr)
        ) {
            setallowance(0);
            setloading(true);
            seterr(null);
            try {
                const allowance = await tokenContract.methods.allowance(
                    opensignalContractAddr
                );
                setallowance(allowance);
                setloading(false);
                seterr(null);
            } catch (err) {
                setallowance(0);
                setloading(false);
                seterr(err);
            }
        } else {
            setallowance(0);
            setloading(false);
            seterr(null);
        }
    }, [addr, tokenContract, opensignalContractAddr, trigger]);
    return [allowance, loading, err];
};
const useGetTokenBalance = (
    addr: string,
    tokenContract: any,
    trigger = false
) => {
    const [balance, setbalance] = React.useState('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (addr && isAddress(addr) && isAddress(addr)) {
            setbalance('');
            setloading(true);
            seterr(null);
            try {
                const balance = await tokenContract.methods.balance(addr);
                setbalance(balance);
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
    }, [addr, tokenContract, trigger]);
    return [balance, loading, err];
};

export {useGetAllowance, useGetTokenBalance};
