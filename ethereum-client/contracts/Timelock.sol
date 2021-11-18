pragma solidity ^0.6.12;

import "./libraries/Ownable.sol";
import "./libraries/SafeMath.sol";
import "./libraries/SafeERC20.sol";
import "./interfaces/IERC20.sol";

// SPDX-License-Identifier: Unlicensed
contract Timelock is Ownable {
    using SafeMath for uint256;

    /**
     * @dev Timestamp, surpassing which allows the owner to withdraw.
     */
    uint256 public unlockAt;

    /**
     * @dev Reverts if `block.timestamp` < `unlockAt`,
     * i.e. if `unlockAt` equals 15:00 and current time is 14:40 then revert occurs.
     */
    modifier unlocked {
        require(block.timestamp >= unlockAt, "Timelock: locked");
        _;
    }

    /**
     * @dev Initializes the contract setting up initial unlock timestamp.
     * @param delay Amount of seconds to lock the timelock for.
     */
    constructor (uint256 delay) public {
        unlockAt = block.timestamp.add(delay);
    }

    /**
     * @dev Withdraws `amount` tokens to `msg.sender`. Can be called only by the owner.
     * Can be called only when timelock is unlocked.
     * @param token Address of the token.
     * @param amount Amount of tokens to be withdrawn.
     */
    function withdraw(address token, uint256 amount) external onlyOwner unlocked {
        SafeERC20.safeTransfer(token, msg.sender, amount);
    }

    /**
     * @dev Sest new timestamp for unlocking. Can be called only by the owner.
     * Can be called only when timelock is unlocked.
     * @param delay Amount of seconds to lock the timelock for.
     */
    function setDelay(uint256 delay) external onlyOwner unlocked {
        unlockAt = block.timestamp.add(delay);
    }
}
