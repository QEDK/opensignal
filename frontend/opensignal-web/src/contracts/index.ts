import {BigNumber, ethers} from 'ethers';

declare const window: any;
const deployContract = (
    chainId: any,
    contractName:
        | string
        | 'OpenSignal'
        | 'OpenSignalShares'
        | 'OpenSignalToken'
        | 'OpenSignalGoverner'
        | 'OpenSignalProxy',
    args?: any[]
): Promise<string> => {
    console.log(`redeploying contracts on ${chainId}`);
    return new Promise(async (resolve, reject) => {
        try {
            const provider = new ethers.providers.Web3Provider(
                window.ethereum,
                'any' // getNetworkName(chainId).toLocaleLowerCase()
            );

            let contractMetas: any = {};

            try {
                contractMetas = require('./hardhat_contracts.json');
            } catch (e) {
                console.log(e);
            }

            const metadata = contractMetas[contractName];

            console.log(`Deploying ${contractName} ${args}`);

            let factory = new ethers.ContractFactory(
                metadata.abi,
                metadata.data.bytecode.object,
                provider.getSigner()
            );

            const contract = await factory.deploy(...(args || []));
            console.log('Contract Address: ', contract.address);
            await contract.deployed();
            console.log('Contract Deployed: ', contract.deployTransaction);
            if (contract.deployTransaction) {
                console.log(
                    `gas limit ${
                        BigNumber.from(
                            contract.deployTransaction.gasLimit
                        ).toNumber() / 1e9
                    } at gas price ${
                        BigNumber.from(
                            contract.deployTransaction.gasPrice
                        ).toNumber() / 1e9
                    }`
                );
            }

            resolve(contract.address);
        } catch (e: any) {
            if (e && e['reason']) {
                reject(e['reason']);
            } else if (e && e['message']) {
                reject(e['message']);
            } else {
                console.log(e);
                reject('ERROR [!]');
            }
        }
    });
};
export {deployContract};
