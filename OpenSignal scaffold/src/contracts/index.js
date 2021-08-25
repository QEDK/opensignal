import { BigNumber, ethers } from "ethers";

const deployContract = (name, args = []) => {
  console.log(`\n\n\n\n\n redeploying contracts  ${name}`);
  return new Promise(async (resolve, reject) => {
    let opensognalAddr = localStorage.getItem(name);
    if (opensognalAddr) {
      return resolve(opensognalAddr);
    }
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any", // getNetworkName(chainId).toLocaleLowerCase()
      );

      let contractList = {};

      try {
        contractList = require("./hardhat_contracts.json");
      } catch (e) {
        console.log(e);
      }

      const contractMetas = Object.keys(contractList).map(chainId => {
        return contractList[chainId]["localhost"]["contracts"];
      })[0];

      const metadata = contractMetas[name];

      console.log(`Deploying ${name} ${args}`);

      let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, provider.getSigner());

      const contract = await factory.deploy(...args, { nonce: 0 });
      console.log("Contract Address: ", contract.address);
      await contract.deployed();
      console.log("Contract Deployed: ", contract.deployTransaction);
      if (contract.deployTransaction) {
        console.log(
          `gas limit ${BigNumber.from(contract.deployTransaction.gasLimit).toNumber() / 1e9} at gas price ${
            BigNumber.from(contract.deployTransaction.gasPrice).toNumber() / 1e9
          }`,
        );
      }
      localStorage.setItem(name, contract.address);
      resolve(contract.address);
    } catch (e) {
      if (e && e["reason"]) {
        reject(e["reason"]);
      } else if (e && e["message"]) {
        reject(e["message"]);
      } else {
        console.log(e);
        reject("ERROR [!]");
      }
    }
  });
};
export { deployContract };
