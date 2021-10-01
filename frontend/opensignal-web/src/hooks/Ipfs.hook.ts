import axios from 'axios';
import React from 'react';
const PREFIX = 'ipfs://';
const useGetMetadata = (cid: string, trigger = false) => {
    const [metadata, setmetadata] = React.useState<any>(null);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (cid && cid.toString().startsWith(PREFIX)) {
            setloading(true);
            axios
                .get(getIPFSlink(cid))
                .then((result) => {
                    try {
                        setmetadata({
                            ...result.data,
                            avatar: getIPFSImage(cid),
                        });
                        setloading(false);
                    } catch (err) {
                        console.log('err', err);
                        setloading(false);
                        seterr(err);
                        setmetadata(null);
                    }
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

const getIPFSlink = (cid: string) => {
    if (cid && cid.toString().startsWith(PREFIX)) {
        return 'https://ipfs.io/ipfs/' + cid.substr(PREFIX.length);
    }
    return cid + `ipfs.dweb.link/metadata.json`;
};

const getIPFSImage = (cid: string) => {
    return cid + `image.jpeg`;
}