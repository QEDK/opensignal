require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const defaultNetwork = 'rinkeby';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.7',
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999
      }
    }
  },
  defaultNetwork,
  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL || 'https://rinkeby-light.eth.linkpool.io',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}
