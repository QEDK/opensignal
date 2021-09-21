const hre = require('hardhat')

async function main () {

  const EPOCH_LENGTH = 2592000;
  const ONWER_ADDRESS = '0x16e9b2B8A2C92e98faBd8f9B08210f674F570059';

  const OpenSignalToken = await hre.ethers.getContractFactory('OpenSignalToken')
  const openSignalTokenContract = await OpenSignalToken.deploy()
  await openSignalTokenContract.deployed()
  console.log('OpenSignalToken deployed to:', openSignalTokenContract.address);

  await openSignalTokenContract.initialize();

  const RewardsDistribution = await hre.ethers.getContractFactory('RewardsDistribution')
  const rewardsDistributionContract = await RewardsDistribution.deploy()
  await rewardsDistributionContract.deployed()
  console.log('RewardsDistribution deployed to:', rewardsDistributionContract.address);

  await rewardsDistributionContract.initialize(openSignalTokenContract.address, EPOCH_LENGTH, ONWER_ADDRESS);


  const OpenSignalShares = await hre.ethers.getContractFactory('OpenSignalShares')
  const openSignalSharesContract = await OpenSignalShares.deploy()
  await openSignalSharesContract.deployed()
  console.log('OpenSignalShares deployed to:', openSignalSharesContract.address);


  const OpenSignal = await hre.ethers.getContractFactory('OpenSignal')
  const openSignalContract = await OpenSignal.deploy(
    // BiconomyForwarder on Rinkeby
    '0xFD4973FeB2031D4409fB57afEE5dF2051b171104', openSignalTokenContract.address, rewardsDistributionContract.address
  )
  await openSignalContract.deployed()
  console.log('OpenSignal deployed to:', openSignalContract.address);

  const OpenSignalProxy = await hre.ethers.getContractFactory('OpenSignalProxy')
  const openSignalProxyContract = await OpenSignalProxy.deploy(
    ONWER_ADDRESS, openSignalContract.address
  )
  await openSignalProxyContract.deployed()
  console.log('OpenSignalProxy deployed to:', openSignalProxyContract.address);




}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
