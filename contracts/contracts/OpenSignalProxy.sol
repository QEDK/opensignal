// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenSignalProxy is ERC1967Proxy, Ownable {

  constructor(address _logic) ERC1967Proxy(_logic, "") {

  }

  function getImplementation() external {
    _implementation();
  }

  function upgradeTo(address impl) external onlyOwner {
    _upgradeTo(impl);
  }

}
