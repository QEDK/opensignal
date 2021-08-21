// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract OpenSignalShares is ERC20, Ownable, ERC20Permit {
    bool public isEnabled;

    constructor()
        ERC20("OpenSignal Shares", "OSS")
        ERC20Permit("OpenSignal Shares") {
        isEnabled = true;
    }

    function disable() public onlyOwner {
        isEnabled = false;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(isEnabled, "CONTRACT_DISABLED");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
