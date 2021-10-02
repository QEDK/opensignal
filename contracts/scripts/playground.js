const hre = require('hardhat')
const ethers = require('ethers')

async function main () {
  // const OpenSignal = await hre.ethers.getContractFactory('OpenSignal')
  // const openSignalContract = await OpenSignal.deploy(
  //   // BiconomyForwarder on Rinkeby
  //   '0xFD4973FeB2031D4409fB57afEE5dF2051b171104', openSignalTokenContract.address
  // )
  // await openSignalContract.deployed()
  // console.log('OpenSignal deployed to:', openSignalContract.address);

  const yourContract = await ethers.getContractAt('OpenSignal', '0x5184AbfB1D536101Ff4BA601874CeDC16154fb1f') // <-- if you want to instantiate a version of a contract at a specific address!
  console.log(yourContract)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
