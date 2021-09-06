// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

// Inheritance
import "@openzeppelin/contracts/access/Ownable.sol";

// Libraires
import "./libraries/SafeDecimalMath.sol";

// Internal references
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "./interfaces/IFeePool.sol";

// https://docs.synthetix.io/contracts/source/contracts/rewardsdistribution
contract RewardsDistribution is Ownable {
    using SafeMath for uint;
    using SafeDecimalMath for uint;

    struct DistributionData {
        address destination;
        uint amount;
    }

    /**
     * @notice Authorised address able to call distributeRewards
     */
    address public authority;

    /**
     * @notice Address of the Synthetix ProxyERC20
     */
    address public openSignalProxy;

    /**
     * @notice Address of the RewardEscrow contract
     */
    address public rewardEscrow;

    // /**
    //  * @notice Address of the FeePoolProxy
    //  */
    // address public feePoolProxy;

    /**
     * @notice An array of addresses and amounts to send
     */
    DistributionData[] public distributions;

    mapping(address => uint256) public userIndex;

    /**
     * @dev _authority maybe the underlying synthetix contract.
     * Remember to set the authority on a synthetix upgrade
     */
    constructor(
        address _owner,
        address _authority,
        address _openSignalProxy,
        address _rewardEscrow
        // address _feePoolProxy
    ) public {
        authority = _authority;
        openSignalProxy = _openSignalProxy;
        rewardEscrow = _rewardEscrow;
        // feePoolProxy = _feePoolProxy;
    }

    // ========== EXTERNAL SETTERS ==========

    function setOpenSignalProxy(address _openSignalProxy) external onlyOwner {
        openSignalProxy = _openSignalProxy;
    }

    function setRewardEscrow(address _rewardEscrow) external onlyOwner {
        rewardEscrow = _rewardEscrow;
    }

    // function setFeePoolProxy(address _feePoolProxy) external onlyOwner {
    //     feePoolProxy = _feePoolProxy;
    // }

    /**
     * @notice Set the address of the contract authorised to call distributeRewards()
     * @param _authority Address of the authorised calling contract.
     */
    function setAuthority(address _authority) external onlyOwner {
        authority = _authority;
    }

    // ========== EXTERNAL FUNCTIONS ==========

    function tokenStaked(address destination, uint256 amount, bool _tokenRedeemed) external onlyOwner returns (bool) {
      require(destination != address(0), "Cant add a zero address");
      require(amount != 0, "Cant add a zero amount");

      if (userIndex[destination] == 0) {
        addRewardDistribution(destination, amount);
        userIndex[destination] = distributions.length - 1;
      } else {
        uint256 index = userIndex[destination];
        editRewardDistribution(index, amount, _tokenRedeemed);
      }
    }

    /**
     * @notice Adds a Rewards DistributionData struct to the distributions
     * array. Any entries here will be iterated and rewards distributed to
     * each address when tokens are sent to this contract and distributeRewards()
     * is called by the autority.
     * @param destination An address to send rewards tokens too
     * @param amount The amount of rewards tokens to send
     */
    function addRewardDistribution(address destination, uint amount) public onlyOwner returns (bool) {
        require(destination != address(0), "Cant add a zero address");
        require(amount != 0, "Cant add a zero amount");

        DistributionData memory rewardsDistribution = DistributionData(destination, amount);
        distributions.push(rewardsDistribution);

        emit RewardDistributionAdded(distributions.length - 1, destination, amount);
        return true;
    }

    /**
     * @notice Deletes a RewardDistribution from the distributions
     * so it will no longer be included in the call to distributeRewards()
     * @param index The index of the DistributionData to delete
     */
    function removeRewardDistribution(uint index) external onlyOwner {
        require(index <= distributions.length - 1, "index out of bounds");

        // shift distributions indexes across
        for (uint i = index; i < distributions.length - 1; i++) {
            distributions[i] = distributions[i + 1];
        }
        distributions.length--;

        // Since this function must shift all later entries down to fill the
        // gap from the one it removed, it could in principle consume an
        // unbounded amount of gas. However, the number of entries will
        // presumably always be very low.
    }

    /**
     * @notice Edits a RewardDistribution in the distributions array.
     * @param index The index of the DistributionData to edit
     * @param amount The amount of tokens to edit. Send the same number to keep or change the amount of tokens to send.
     * @param tokenRedeemed Have they unstaked tokens? If true, we must subtract from their staked token balance.
     */
    function editRewardDistribution(
        uint index,
        uint amount,
        bool tokenRedeemed
    ) public onlyOwner returns (bool) {
        require(index <= distributions.length - 1, "index out of bounds");
        if (tokenRedeemed) { //unstaked tokens
            distributions[index].amount =  distributions[index].amount.sub(amount);
            if (distributions[index].amount == 0) { // they no longer have any staked tokens so remove them from the rewards array
                removeRewardDistribution(index);
            }
        }
        distributions[index].amount =  distributions[index].amount.plus(amount);
        return true;
    }

    /**
        * @notice Edits a RewardDistribution in the distributions array.
        * @param amount this is the total amount of tokens that will be distributed. Each participant will get their proportion of amount based on their total tokens staked
     */
    function distributeRewards(uint amount, uint256 totalTokensStaked) external returns (bool) {
        require(amount > 0, "Nothing to distribute");
        require(msg.sender == authority, "Caller is not authorised");
        require(rewardEscrow != address(0), "RewardEscrow is not set");
        require(OpenSignalProxy != address(0), "OpenSignalProxy is not set");
        // require(feePoolProxy != address(0), "FeePoolProxy is not set");
        require(
            IERC20(OpenSignalProxy).balanceOf(address(this)) >= amount,
            "RewardsDistribution contract does not have enough tokens to distribute"
        );

        uint remainder = amount;

        // Iterate the array of distributions sending the configured amounts
        for (uint i = 0; i < distributions.length; i++) {
            if (distributions[i].destination != address(0) || distributions[i].amount != 0) {
                remainder = remainder.sub(distributions[i].amount);

                // Transfer the OS Tokens
                IERC20(openSignalProxy).transfer(distributions[i].destination, distributions[i].amount * amount / totalTokensStaked);
            }
        }

        // After all ditributions have been sent, send the remainder to the RewardsEscrow contract
        // IERC20(openSignalProxy).transfer(rewardEscrow, remainder);

        // // Tell the FeePool how much it has to distribute to the stakers
        // IFeePool(feePoolProxy).setRewardsToDistribute(remainder);

        emit RewardsDistributed(amount);
        return true;
    }

    /* ========== VIEWS ========== */

    /**
     * @notice Retrieve the length of the distributions array
     */
    function distributionsLength() external view returns (uint) {
        return distributions.length;
    }

    /* ========== Events ========== */

    event RewardDistributionAdded(uint index, address destination, uint amount);
    event RewardsDistributed(uint amount);
}