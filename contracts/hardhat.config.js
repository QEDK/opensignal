require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

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
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL || 'https://rinkeby-light.eth.linkpool.io',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
}
