import React from 'react';
import {isAddress} from '../util/eth.util';

const useGetShareBalance = (
    addr: string,
    shareContract: any,
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
                const balance = await shareContract.methods
                    .balanceOf(addr)
                    .call();
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
    }, [addr, shareContract, trigger]);
    return [balance, loading, err];
};

export {useGetShareBalance};
