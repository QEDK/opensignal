// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

contract OpenSignalGovernor is GovernorVotesQuorumFraction {
	constructor(string memory _name, ERC20Votes _tokenAddress, uint256 _quorumNumeratorValue)
	Governor(_name)
	GovernorVotes(_tokenAddress)
	GovernorVotesQuorumFraction(_quorumNumeratorValue) {

	}

	function COUNTING_MODE() public pure override returns (string memory) {
		return "support=bravo&quorum=for,abstain";
	}
}
