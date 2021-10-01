// import axios from 'axios';
import {NFTStorage} from 'nft.storage';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

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

function makeGatewayURL(cid, path) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`
}

const saveOnIPFSWithWeb3Storage = async (properties: any, avatar?: any) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZCZWIzQmQ4MjQyODVCNDlDODNjZEQxMjkyQTdGNmQ5ZWNFNDRkOUMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzI0MTYzMDYxMTAsIm5hbWUiOiJPcGVuU2lnbmFsIn0.COZtw1xHp_26UU_rkv0VLaWMhUxiCbVI3llqTqnajEs';
    const storage = new Web3Storage({ token });

    const imageFile = [new File([avatar], 'image.jpeg')];
      
    const imageCid = await storage.put(imageFile);

    const imageURL = makeGatewayURL(imageCid, 'image.jpeg');

    const obj = {
        name: 'OpenSignal',
        description: 'OpenSignal Project Info',
        avatar: imageURL,
        properties: properties,
    };
    const blob = new Blob([JSON.stringify(obj)], {type : 'application/json'});

    const metadataFile = [ new File([blob], 'metadata.json')];

    const metadataCid = await storage.put(metadataFile);

    const metadataURL = makeGatewayURL(metadataCid, 'metadata.json');

    return {metadataCid, imageURL, metadataURL};
}

const saveOnIPFS = saveOnIPFSwithNftStorage;
export {saveOnIPFS, saveOnIPFSWithWeb3Storage};
