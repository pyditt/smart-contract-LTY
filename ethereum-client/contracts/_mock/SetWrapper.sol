pragma solidity ^0.6.12;

import "../libraries/Set.sol";

/// @dev Wrapper for testing.
contract SetWrapper {
    using Set for Set.AddressSet;

    Set.AddressSet private set;

    bool public lastAction;

    function values() public view returns (address[] memory) {
        return set.values;
    }

    function add(address value) public {
        lastAction = set.add(value);
    }

    function remove(address value) public {
        lastAction = set.remove(value);
    }

    function has(address value) public view returns (bool) {
        return set.has(value);
    }
}
