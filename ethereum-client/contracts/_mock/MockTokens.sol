pragma solidity ^0.6.12;

import {MockERC20} from "./MockERC20.sol";

contract MockUSDC is MockERC20 {
    constructor() public MockERC20("MockUSDC", "MUSDC") { }
}
