//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./OpenSignalShares.sol";

contract OpenSignal is ERC2771Context, ReentrancyGuard {
	using Counters for Counters.Counter;
	struct Project {
		address creator;
		uint256 selfStake;
		uint256 timestamp;
	}

	Counters.Counter private projectId;

	address public admin;
	mapping(bytes32 => mapping(address => uint256)) public shares;
	mapping(bytes32 => uint256) public signals;
	mapping(bytes32 => Project) projects;

	event IncreaseSignal(bytes32 indexed id, uint256 indexed amount);
	event DecreaseSignal(bytes32 indexed id, uint256 indexed amount);

	constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {
		admin = msg.sender;
	}

	function createProject(string calldata name, uint256 amount) external {
		bytes32 id = keccak256(abi.encode(name, block.number, projectId));
		projects[id] = Project(_msgSender(), amount, block.timestamp);
		projectId.increment();
		Create2.deploy(0, id, type(OpenSignalShares).creationCode);
	}

	function deleteProject(bytes32 id, uint256 amount) nonReentrant external {

	}

	function increaseStake(uint256) external {

	}

	function addSignal(bytes32 id, uint256 amount) external {
		signals[id] += amount;
		emit IncreaseSignal(id, amount);
	}

	function removeSignal(bytes32 id, uint256 amount, uint256 minTokenOut) nonReentrant external {
		signals[id] -= amount;
		emit DecreaseSignal(id, amount);
	}
}
