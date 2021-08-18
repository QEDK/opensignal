// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./BancorFormula.sol";
import "./OpenSignalShares.sol";

contract OpenSignal is ERC2771Context, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    struct Project {
        address creator;
        address deployment;
        uint256 selfStake;
        uint256 signal;
        uint256 timestamp;
    }

    uint32 public constant epoch = 2592000;

    address public governor;
    IERC20 public nativeToken;
    uint256 public minStake;
    uint32 public reserveRatio;
    uint8 public minLockinTimeInEpochs;

    mapping(bytes32 => Project) public projects;

    BancorFormula private BF = new BancorFormula();
    Counters.Counter private projectId;

    event IncreaseSignal(bytes32 indexed id, uint256 indexed amount);
    event DecreaseSignal(bytes32 indexed id, uint256 indexed amount);

    modifier onlyGovernor() {
        require(_msgSender() == governor, "ONLY_GOVERNOR");
        _;
    }

    constructor(address _trustedForwarder, IERC20 _nativeToken) ERC2771Context(_trustedForwarder) {
        governor = msg.sender;
        nativeToken = _nativeToken;
        minStake = 2 ether;
        reserveRatio = 500000;
        minLockinTimeInEpochs = 3;
    }

    function changeMinLockinTimeInEpochs(uint8 newLockinTime) onlyGovernor {
        require(newLockinTime > 0, "INVALID_DURATION")
        minLockinTimeInEpochs = newLockinTime;
    }

    function changeMinStake(uint256 newMinStake) onlyGovernor {
        require(amount > 0, "INVALID_AMOUNT");
        minStake = newMinStake;
    }

    function changeReserveRatio(uint32 newRatio) onlyGovernor {
        require(reserveRatio > 0 && reserveRatio <= 1000000, "INVALID_RESERVE_WEIGHT");
        reserveRatio = newRatio;
    }

    function createProject(string calldata name, uint256 amount) external {
        require(amount >= minStake, "SELF_STAKE_TOO_LOW");
        nativeToken.safeTransferFrom(_msgSender(), address(this), amount);
        bytes32 id = keccak256(abi.encode(name, block.number, projectId.current()));
        address _deployment = Create2.computeAddress(id, keccak256(type(OpenSignalShares).creationCode));
        projects[id] = Project(_msgSender(), _deployment, amount, amount, block.timestamp);
        projectId.increment();
        Create2.deploy(0, id, type(OpenSignalShares).creationCode);
        OpenSignalShares deployment = OpenSignalShares(_deployment);
        deployment.mint(_msgSender(), amount); // 1-to-1 worth of shares
        emit IncreaseSignal(id, amount);
    }

    function deleteProject(bytes32 id, uint256 amount) external nonReentrant {
        Project memory project = projects[id];
        require(_msgSender() == project.creator, "ONLY_CREATOR");
        require(block.timestamp - project.timestamp > (3 * epoch), "THREE_EPOCHS_INCOMPLETE");
        delete projects[id];
        nativeToken.safeTransferFrom(address(this), _msgSender(), project.selfStake);
    }

    function increaseStake(bytes32 id, uint256 amount) external {
        Project memory project = projects[id];
        require(_msgSender() == project.creator, "ONLY_CREATOR");
    }

    function addSignal(bytes32 id, uint256 amount) external {
        Project memory project = projects[id];
        require(project.creator != address(0), "NON_EXISTENT_PROJECT");
        nativeToken.safeTransferFrom(_msgSender(), address(this), amount);
        OpenSignalShares _deployment = OpenSignalShares(project.deployment);
        uint256 sharesAmt = BF.calculatePurchaseReturn(
            project.signal,
            _deployment.totalSupply(),
            500000,
            amount
        );
        shares[id][_msgSender()] += sharesAmt;
        projects[id].signal += amount;
        _deployment.mint(_msgSender(), sharesAmt);
        emit IncreaseSignal(id, amount);
    }

    function removeSignal(bytes32 id, uint256 sharesAmt, uint256 minAmount) external nonReentrant {
        Project memory project = projects[id];
        require(project.deployment != address(0), "NON_EXISTENT_PROJECT");
        require(shares[id][_msgSender()] >= sharesAmt, "NOT_ENOUGH_BALANCE");
        OpenSignalShares _deployment = OpenSignalShares(project.deployment);
        uint256 amount = BF.calculateSaleReturn(
            project.signal,
            _deployment.totalSupply(),
            500000,
            sharesAmt
        );
        require(amount >= minAmount, "SLIPPAGE_PROTECTION");
        shares[id][_msgSender()] -= sharesAmt;
        projects[id].signal -= amount;
        emit DecreaseSignal(id, amount);
    }
}
