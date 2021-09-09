import axios from 'axios';
import React from 'react';
const PREFIX = 'ipfs://';
const useGetMetadata = (cid: string, trigger = false) => {
    const [metadata, setmetadata] = React.useState<any>(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (cid && cid.toString().startsWith(PREFIX)) {
            console.log(
                'cid',
                'https://ipfs.io/ipfs/' + cid.substr(PREFIX.length)
            );
            axios
                .get('https://ipfs.io/ipfs/' + cid.substr(PREFIX.length))
                .then((result) => {
                    console.log('result', result);
                    setmetadata(result.data);
                })
                .catch((err) => {
                    setloading(false);
                    seterr(err);
                    setmetadata(null);
                });
        }
    }, [cid, trigger]);
    return [metadata, loading, err];
};

export {useGetMetadata};
