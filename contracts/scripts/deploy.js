const { assert } = require('chai');
const hre = require('hardhat')
const { ethers, upgrades } = require('hardhat');

async function main () {

  const openSignalTokenContractAddress = '0x4BeD939d328c4A9B5dEcfF9668B534f44497e601';

  const OpenSignalShares = await hre.ethers.getContractFactory('OpenSignalShares')
  const openSignalSharesContract = await OpenSignalShares.deploy()
  await openSignalSharesContract.deployed()
  console.log('OpenSignalShares deployed to:', openSignalSharesContract.address);


  const OpenSignal = await hre.ethers.getContractFactory('OpenSignal')
  const openSignalContract = await OpenSignal.deploy(
    // BiconomyForwarder on Rinkeby
    '0xFD4973FeB2031D4409fB57afEE5dF2051b171104', openSignalTokenContractAddress
  );
  
  await openSignalContract.deployed()
  console.log('OpenSignal deployed to:', openSignalContract.address);
  const rewardsDist = await openSignalContract.rewardsDistribution();

  console.log('Rewards Distribution address:', rewardsDist);



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
