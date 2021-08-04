pragma solidity ^0.6.12;

import "./libraries/Ownable.sol";
import "./libraries/SafeMath.sol";
import "./interfaces/IERC20.sol";


contract Timelock is Ownable {
    using SafeMath for uint256;

    uint256 public unlockAt;

    modifier unlocked {
        require(block.timestamp >= unlockAt, "Timelock: locked");
        _;
    }

    constructor (uint256 delay) public {
        unlockAt = block.timestamp.add(delay);
    }

    function withdraw(address token, uint256 amount) public onlyOwner unlocked {
        require(IERC20(token).transfer(msg.sender, amount), "Timelock: transfer failed");
    }

    function setDelay(uint256 delay) public onlyOwner unlocked {
        unlockAt = block.timestamp.add(delay);
    }
}
