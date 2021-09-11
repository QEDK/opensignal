import axios from 'axios';
import {NFTStorage} from 'nft.storage';
const saveOnIPFSwithNftStorage = async (properties: any, avatar?: any) => {
    const apiKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFmRDg4MmY5YzlCZGE2QjMyOTVlZjIwZDFiM0VDNjA4NDJCREQxMTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDQ4NTQ2MDM0OSwibmFtZSI6Ik9wZW5TaWduYWwifQ.-Am4LeJJXbE6ONW6NfHdU2qIHGedHNuuIrfZPcpV0jU';
    const client = new NFTStorage({token: apiKey});

    const metadata = await client.store({
        name: 'OpenSignal',
        description: 'OpenSignal Project Info',
        image: avatar || new Blob(),
        properties: properties,
    });

    return metadata;
};

const saveOnIPFS = saveOnIPFSwithNftStorage;
export {saveOnIPFS};
