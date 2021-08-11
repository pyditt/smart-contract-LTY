pragma solidity ^0.6.12;

import "../libraries/Set.sol";

/// @dev Wrapper for testing.
contract SetWrapper {
    using Set for Set.AddressSet;

    Set.AddressSet private set;

    bool public lastAction;

    function values() external view returns (address[] memory) {
        return set.values;
    }

    function add(address value) external {
        lastAction = set.add(value);
    }

    function remove(address value) external {
        lastAction = set.remove(value);
    }

    function has(address value) external view returns (bool) {
        return set.has(value);
    }
}
