import React from 'react';
import {NFTStorage, File} from 'nft.storage';

const useGetOpenSignalContract = (trigger = false) => {
    const [contract, setcontract] = React.useState('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {}, [trigger]);
    return [contract, loading, err];
};

const useGetOpenSignalTokenContract = (trigger = false) => {
    const [contract, setcontract] = React.useState('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {}, [trigger]);
    return [contract, loading, err];
};
export {useGetOpenSignalContract, useGetOpenSignalTokenContract};
