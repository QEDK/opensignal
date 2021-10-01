import {ethers} from 'ethers';
import React from 'react';
import {isAddress} from '../util/eth.util';

const useGetAllowance = (
    addr: string,
    tokenContract: any,
    trigger = false
) => {
    const [allowance, setallowance] = React.useState(0);
    const [loading, setloading] = React.useState<boolean>(true);
    const [err, seterr] = React.useState<any>(null);
    // console.log(tokenContract._address, 'xx', addr)
    React.useMemo(async () => {
        console.log(tokenContract._address, 'address')
        if (
            addr &&
            tokenContract &&
            tokenContract._address &&
            isAddress(addr) &&
            isAddress(tokenContract._address)
        ) {
            setallowance(0);
            setloading(true);
            seterr(null);
            try {
                const allowance = await tokenContract.methods
                    .allowance(addr, tokenContract._address)
                    .call();
                console.log(allowance,'allowance')
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
    }, [addr, tokenContract, trigger]);
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
                const balance = await tokenContract.methods
                    .balanceOf(addr)
                    .call();
                setbalance(ethers.utils.formatEther(balance));
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
