// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "./libraries/SafeDecimalMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract RewardsDistribution is Initializable, OwnableUpgradeable {
    using SafeMath for uint256;
    using SafeDecimalMath for uint256;
    using SafeERC20 for IERC20;

    struct DistributionData {
        address destination;
        uint256 currentStake;
        uint256 minimumStake;
    }

    address public openSignalProxy;

    /**
     * @notice An array of addresses and amounts to send
     */
    DistributionData[] public lastEpochStaking;
    DistributionData[] public rewardEpochStaking;
    mapping(address => uint256) public userIndex;

    uint256 public epochBegin;
    uint256 public epochEnd;
    uint256 public epocLength;

    uint256 public totalTokensStaked;
    uint256 public totalRewardsToDistribute = 100; //distribute 100 tokens per epoch

    function initialize(
        address _openSignalContract,
        uint32 _epochLength
    ) public initializer {
        __Ownable_init();
        openSignalProxy = _openSignalContract;
        epocLength = _epochLength;
        epochBegin = block.timestamp;
        epochEnd = block.timestamp + _epochLength;
    }

    // ========== EXTERNAL SETTERS ==========

    function setOpenSignalProxy(address _openSignalProxy) external onlyOwner {
        openSignalProxy = _openSignalProxy;
    }

    modifier onlyOpenSignal() {
        require(msg.sender == openSignalProxy, "only OpenSignal can call");
        _;
    }

    function getOpenSignalProxy() public view returns (address) {
        return openSignalProxy;
    }


    // ========== EXTERNAL FUNCTIONS ==========

    function tokenStaked(address destination, uint256 amount, bool _tokenRedeemed) external onlyOpenSignal returns (bool) {
        require(destination != address(0), "Cant add a zero address");
        require(amount != 0, "Cant add a zero amount");

        if (block.timestamp >= epochEnd) {
            epochHasEnded();
        }

        if (userIndex[destination] == 0) {
            addRewardDistribution(destination, amount);
            userIndex[destination] = rewardEpochStaking.length - 1;
        } else {
            uint256 index = userIndex[destination];
            editRewardDistribution(index, amount, _tokenRedeemed, destination);
        }

        if (_tokenRedeemed) {
            totalTokensStaked = totalTokensStaked.sub(amount);
        } else {
            totalTokensStaked = totalTokensStaked.add(amount);
        }

        return true;
    }

    function getCurrentRewardEstimate(address destination) external view returns (uint256) {
        uint256 index = userIndex[destination];
        require(index != 0, "You are not eligible");
        if (rewardEpochStaking[index].minimumStake == 0) {
            return 0;
        }
        return rewardEpochStaking[index].minimumStake.mul(totalRewardsToDistribute.div(totalTokensStaked));
    }

    function getCurrentStakingAmount(address destination) external view returns (uint256) {
        uint256 index = userIndex[destination];
        if (index == 0) {
            return 0;
        }
        return rewardEpochStaking[index].currentStake;
    }

    function getTokensEligibleForRewards(address destination) external view returns (uint256) {
        uint256 index = userIndex[destination];
        if (index == 0) {
            return 0;
        }
        return rewardEpochStaking[index].minimumStake;
    }

    function changeEpochLength(uint256 _seconds) public returns (bool) {
        epocLength = _seconds;
        return true;
    }

    /**
     * @notice Adds a Rewards DistributionData struct to the distributions
     * array. Any entries here will be iterated and rewards distributed to
     * each address when tokens are sent to this contract and distributeRewards()
     * is called by the autority.
     * @param destination An address to send rewards tokens too
     * @param amount The amount of rewards tokens to send
     */
    function addRewardDistribution(address destination, uint256 amount) internal returns (bool) {
        require(destination != address(0), "Cant add a zero address");
        require(amount != 0, "Cant add a zero amount");

        DistributionData memory rewardsDistribution = DistributionData(
            {destination: destination, currentStake: amount, minimumStake: 0 }
        );
        rewardEpochStaking.push(rewardsDistribution);

        emit RewardDistributionAdded(rewardEpochStaking.length - 1, destination, amount);
        return true;
    }

    /**
     * @notice Deletes a RewardDistribution from the distributions
     * so it will no longer be included in the call to distributeRewards()
     * @param index The index of the DistributionData to delete
     */
    function removeRewardDistribution(uint index, address sender) internal {
        require(index <= rewardEpochStaking.length - 1, "index out of bounds");

        // shift rewardEpochStaking indexes across
        for (uint i = index; i < rewardEpochStaking.length - 1; i++) {
            rewardEpochStaking[i] = rewardEpochStaking[i + 1];
        }
        userIndex[sender] = 0;
        delete rewardEpochStaking[rewardEpochStaking.length - 1];

        // Since this function must shift all later entries down to fill the
        // gap from the one it removed, it could in principle consume an
        // unbounded amount of gas. However, the number of entries will
        // presumably always be very low.
    }

    /**
     * @notice Edits a RewardDistribution in the distributions array.
     * @param index The index of the DistributionData to edit
     * @param amount The amount of tokens to edit. Send the same number to keep or change the amount of tokens to send.
     * @param tokenUnstaked Have they unstaked tokens? If true, we must subtract from their staked token balance.
     */
    function editRewardDistribution(
        uint index,
        uint amount,
        bool tokenUnstaked,
        address sender
    ) internal returns (bool) {
        require(index <= rewardEpochStaking.length - 1, "index out of bounds");
        if (tokenUnstaked) { //unstaked tokens
            rewardEpochStaking[index].currentStake = rewardEpochStaking[index].currentStake.sub(amount);

            if (rewardEpochStaking[index].currentStake == 0) { // they no longer have any staked tokens so remove them from the rewards array
                removeRewardDistribution(index, sender);
            } else if (rewardEpochStaking[index].minimumStake >= rewardEpochStaking[index].currentStake) {
                rewardEpochStaking[index].minimumStake = rewardEpochStaking[index].currentStake;
            }
        }
        rewardEpochStaking[index].currentStake = rewardEpochStaking[index].currentStake.add(amount);
        return true;
    }

    /**
        * @notice Edits a RewardDistribution in the distributions array.
        * @param amount this is the total amount of tokens that will be distributed. Each participant will get their proportion of amount based on their total tokens staked
     */
    function distributeRewards(uint256 amount) internal returns (bool) {
        require(amount > 0, "Nothing to distribute");
        require(address(openSignalProxy) != address(0), "OpenSignalProxy is not set");
        require(
            IERC20(openSignalProxy).balanceOf(address(this)) >= amount,
            "insufficient tokens available"
        );

        uint256 remainder = amount;

        for (uint i = 0; i < rewardEpochStaking.length; i++) {
            if (rewardEpochStaking[i].destination != address(0) && rewardEpochStaking[i].minimumStake != 0) {
                uint256 userAllocation = rewardEpochStaking[i].minimumStake.mul(amount.div(totalTokensStaked));
                remainder = remainder.sub(userAllocation);

                // Transfer the OS Tokens
                IERC20(openSignalProxy).safeTransferFrom(address(openSignalProxy), rewardEpochStaking[i].destination, userAllocation);
            }
        }

        emit RewardsDistributed(amount);
        return true;
    }

    function epochHasEnded() internal returns (bool) {
        if (lastEpochStaking.length != 0) {
            distributeRewards(totalRewardsToDistribute);
        }
        
        for (uint256 i = 0; i < lastEpochStaking.length; i++) { //ensure that the two arrays are always equal length
        
            lastEpochStaking = rewardEpochStaking;
            rewardEpochStaking[i].minimumStake = rewardEpochStaking[i].currentStake;
        }

        epochEnd = epochEnd.add(epocLength);
        return true;
    }

    /* ========== Events ========== */

    event RewardDistributionAdded(uint256 index, address destination, uint256 amount);
    event RewardsDistributed(uint256 amount);
}
