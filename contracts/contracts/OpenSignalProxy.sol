// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./libraries/Owned.sol";

contract OpenSignalProxy is ERC1967Proxy, Owned {

  constructor(address _owner, address _logic) ERC1967Proxy(_logic, "") Owned(_owner) {

  }

  function getImplementation() external {
    _implementation();
  }

  function upgradeTo(address impl) external onlyOwner {
    _upgradeTo(impl);
  }

}