const hre = require('hardhat')

async function main () {

  const OpenSignalToken = await hre.ethers.getContractFactory('OpenSignalToken')
  const openSignalTokenContract = await OpenSignalToken.deploy()
  await openSignalTokenContract.deployed()
  console.log('OpenSignalToken deployed to:', openSignalTokenContract.address);

  await openSignalTokenContract.initialize();


  const OpenSignalShares = await hre.ethers.getContractFactory('OpenSignalShares')
  const openSignalSharesContract = await OpenSignalShares.deploy()
  await openSignalSharesContract.deployed()
  console.log('OpenSignalShares deployed to:', openSignalSharesContract.address);


  const OpenSignal = await hre.ethers.getContractFactory('OpenSignal')
  const openSignalContract = await OpenSignal.deploy(
    // BiconomyForwarder on Rinkeby
    '0xFD4973FeB2031D4409fB57afEE5dF2051b171104', openSignalTokenContract.address
  )
  await openSignalContract.deployed()
  console.log('OpenSignal deployed to:', openSignalContract.address);

  const OpenSignalProxy = await hre.ethers.getContractFactory('OpenSignalProxy')
  const openSignalProxyContract = await OpenSignalProxy.deploy(
    openSignalContract.address
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
