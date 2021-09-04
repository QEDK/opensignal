// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

// https://docs.synthetix.io/contracts/source/interfaces/isupplyschedule
interface ISupplySchedule {
    // Views
    function mintableSupply() external view returns (uint);

    function isMintable() external view returns (bool);

    function minterReward() external view returns (uint);

    // Mutative functions
    function recordMintEvent(uint supplyMinted) external returns (bool);
}