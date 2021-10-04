const hre = require('hardhat')
const { ethers, upgrades } = require('hardhat')

async function main () {
  const signers = await hre.ethers.getSigners()
  const userAddress = signers[0].address
  const OpenSignalToken = await hre.ethers.getContractFactory('OpenSignalToken')
  const openSignalToken = await OpenSignalToken.deploy()
  await openSignalToken.deployed()
  console.log('OpenSignalToken deployed to:', openSignalToken.address)

  await openSignalToken.initialize()

  console.log('Balance:', await openSignalToken.balanceOf(userAddress))

  const RewardsDistribution = await hre.ethers.getContractFactory('RewardsDistribution')
  const rewardsDistribution = await RewardsDistribution.deploy()

  await rewardsDistribution.deployed()

  console.log('RewardsDistribution deployed to:', rewardsDistribution.address)

  const rewardsTx = await openSignalToken.transfer(rewardsDistribution.address, hre.ethers.utils.parseUnits('100000'))
  await rewardsTx.wait()

  const OpenSignal = await hre.ethers.getContractFactory('OpenSignal')
  const openSignalContract = await OpenSignal.deploy(
    // BiconomyForwarder on Rinkeby
    '0xFD4973FeB2031D4409fB57afEE5dF2051b171104', rewardsDistribution.address, openSignalToken.address, '1'
  )

  await openSignalContract.deployed()

  console.log('OpenSignal deployed to:', openSignalContract.address)

  const approveTx = await openSignalToken.approve(openSignalContract.address, hre.ethers.utils.parseUnits('8'))

  await approveTx.wait()

  const projectTx = await openSignalContract.createProject('newProject', 'ipfs://testinghash', hre.ethers.utils.parseUnits('2'))

  const projectReceipt = await projectTx.wait()

  console.log('Project ID:', projectReceipt.events[6].args[0])

  let addSignalTx = await openSignalContract.addSignal(projectReceipt.events[6].args[0], hre.ethers.utils.parseUnits('2'), '0')

  await addSignalTx.wait()

  const userIndex = await rewardsDistribution.userIndex(userAddress)
  console.log('User index:', userIndex)

  console.log('Epoch 0')

  console.log(await rewardsDistribution.getCurrentStakingAmount(userAddress))
  console.log(await rewardsDistribution.getCurrentRewardEstimate(hre.ethers.utils.parseUnits('2')))
  console.log(await rewardsDistribution.getTokensEligibleForRewards(userAddress))
  await new Promise(resolve => setTimeout(resolve, 1001))

  addSignalTx = await openSignalContract.addSignal(projectReceipt.events[6].args[0], hre.ethers.utils.parseUnits('2'), '0')
  let addSignalReceipt = await addSignalTx.wait()

  console.log('Epoch 1')

  console.log(await rewardsDistribution.getCurrentStakingAmount(userAddress))
  console.log(await rewardsDistribution.getCurrentRewardEstimate(hre.ethers.utils.parseUnits('2')))
  console.log(await rewardsDistribution.getTokensEligibleForRewards(userAddress))

  await new Promise(resolve => setTimeout(resolve, 1001))

  addSignalTx = await openSignalContract.addSignal(projectReceipt.events[6].args[0], hre.ethers.utils.parseUnits('2'), '0')
  addSignalReceipt = await addSignalTx.wait()

  console.log('Epoch 2')

  console.log(await rewardsDistribution.getCurrentStakingAmount(userAddress))
  console.log(await rewardsDistribution.getCurrentRewardEstimate(hre.ethers.utils.parseUnits('2')))
  console.log(await rewardsDistribution.getTokensEligibleForRewards(userAddress))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
