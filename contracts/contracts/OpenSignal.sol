// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./BancorFormula.sol";
import "./OpenSignalShares.sol";
import "./RewardsDistribution.sol";

contract OpenSignal is ERC2771Context, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.Bytes32Set;

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
    RewardsDistribution public rewardsDistribution;

    mapping(bytes32 => Project) public projects;
    mapping(bytes32 => string) public projectURIs;

    BancorFormula private BF = new BancorFormula();
    Counters.Counter private projectId;
    EnumerableSet.Bytes32Set private projectIDs;

    event NewProject(bytes32 indexed id, string indexed URI);
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
        rewardsDistribution = new RewardsDistribution();
        rewardsDistribution.initialize(address(this), epoch);

    }


    function changeMinLockinTimeInEpochs(uint8 newLockinTime) external onlyGovernor {
        require(newLockinTime > 0, "INVALID_DURATION");
        minLockinTimeInEpochs = newLockinTime;
    }

    function changeMinStake(uint256 newMinStake) external onlyGovernor {
        require(newMinStake > 0, "INVALID_AMOUNT");
        minStake = newMinStake;
    }

    function changeReserveRatio(uint32 newRatio) external onlyGovernor {
        require(reserveRatio > 0 && reserveRatio <= 1000000, "INVALID_RESERVE_WEIGHT");
        reserveRatio = newRatio;
    }

    function createProject(string calldata name, string calldata URI, uint256 amount) external returns (bytes32) {
        require(amount >= minStake, "SELF_STAKE_TOO_LOW");
        nativeToken.safeTransferFrom(_msgSender(), address(this), amount);
        bytes32 id = keccak256(abi.encode(name, block.number, projectId.current()));
        address _deployment = Create2.computeAddress(id, keccak256(type(OpenSignalShares).creationCode));
        projects[id] = Project(_msgSender(), _deployment, amount, amount, block.timestamp);
        projectId.increment();
        projectURIs[id] = URI;
        projectIDs.add(id);
        Create2.deploy(0, id, type(OpenSignalShares).creationCode);
        OpenSignalShares deployment = OpenSignalShares(_deployment);
        deployment.mint(_msgSender(), amount); // 1-to-1 worth of shares
        rewardsDistribution.tokenStaked(_msgSender(), amount, false);
        emit IncreaseSignal(id, amount);
        emit NewProject(id, URI);
        return id;
    }

    function deleteProject(bytes32 id) external nonReentrant {
        Project memory project = projects[id];
        require(_msgSender() == project.creator, "ONLY_CREATOR");
        require(block.timestamp - project.timestamp > (3 * epoch), "THREE_EPOCHS_INCOMPLETE");
        delete projects[id];
        delete projectURIs[id];
        projectIDs.remove(id);
        rewardsDistribution.tokenStaked(_msgSender(), project.selfStake, true);
        nativeToken.safeTransferFrom(address(this), _msgSender(), project.selfStake);
    }

    function addSignal(bytes32 id, uint256 amount, uint256 minShares) external {
        Project memory project = projects[id];
        require(project.creator != address(0), "NON_EXISTENT_PROJECT");
        nativeToken.safeTransferFrom(_msgSender(), address(this), amount);
        OpenSignalShares _deployment = OpenSignalShares(project.deployment);
        uint256 sharesAmt = BF.calculatePurchaseReturn(
            project.signal,
            _deployment.totalSupply(),
            reserveRatio,
            amount
        );
        require(sharesAmt >= minShares, "SLIPPAGE_PROTECTION");
        projects[id].signal += amount;
        _deployment.mint(_msgSender(), sharesAmt);
        rewardsDistribution.tokenStaked(_msgSender(), amount, false);
        emit IncreaseSignal(id, amount);
    }

    function removeSignal(bytes32 id, uint256 sharesAmt, uint256 minAmount) external nonReentrant {
        Project memory project = projects[id];
        require(project.deployment != address(0), "NON_EXISTENT_PROJECT");
        OpenSignalShares _deployment = OpenSignalShares(project.deployment);
        require(_deployment.balanceOf(_msgSender()) >=  sharesAmt, "NOT_ENOUGH_BALANCE");
        if (_msgSender() == project.creator) {
            require((_deployment.balanceOf(_msgSender()) - sharesAmt) >= project.selfStake, "STAKE_LOCKED");
        }
        uint256 amount = BF.calculateSaleReturn(
            project.signal,
            _deployment.totalSupply(),
            reserveRatio,
            sharesAmt
        );
        require(amount >= minAmount, "SLIPPAGE_PROTECTION");
        projects[id].signal -= amount;
        rewardsDistribution.tokenStaked(_msgSender(), amount, true);
        _deployment.burn(_msgSender(), sharesAmt);
        emit DecreaseSignal(id, amount);
    }

    function allProjects() external view returns (bytes32[] memory) {
        return projectIDs.values();
    }

    function projectURI(uint256 idx) external view returns (string memory) {
        return projectURIs[projectIDs.at(idx)];
    }
}
