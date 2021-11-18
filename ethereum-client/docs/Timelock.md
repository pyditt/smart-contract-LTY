# Timelock





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| unlockAt | uint256 |


## Modifiers

### unlocked
No description
> Reverts if `block.timestamp` < `unlockAt`,
i.e. if `unlockAt` equals 15:00 and current time is 14:40 then revert occurs.

#### Declaration
```solidity
  modifier unlocked
```



## Functions

### constructor
> Initializes the contract setting up initial unlock timestamp.


#### Declaration
```solidity
  function constructor(
    uint256 delay
  ) public
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`delay` | uint256 | Amount of seconds to lock the timelock for.

### withdraw
> Withdraws `amount` tokens to `msg.sender`. Can be called only by the owner.
Can be called only when timelock is unlocked.


#### Declaration
```solidity
  function withdraw(
    address token,
    uint256 amount
  ) external onlyOwner unlocked
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |
| unlocked |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`token` | address | Address of the token.
|`amount` | uint256 | Amount of tokens to be withdrawn.

### setDelay
> Sest new timestamp for unlocking. Can be called only by the owner.
Can be called only when timelock is unlocked.


#### Declaration
```solidity
  function setDelay(
    uint256 delay
  ) external onlyOwner unlocked
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |
| unlocked |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`delay` | uint256 | Amount of seconds to lock the timelock for.

### owner
> Returns the address of the current owner.

#### Declaration
```solidity
  function owner(
  ) public returns (address)
```

#### Modifiers:
No modifiers



### renounceOwnership
> Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.

#### Declaration
```solidity
  function renounceOwnership(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### transferOwnership
> Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.

#### Declaration
```solidity
  function transferOwnership(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### _msgSender


#### Declaration
```solidity
  function _msgSender(
  ) internal returns (address payable)
```

#### Modifiers:
No modifiers



### _msgData


#### Declaration
```solidity
  function _msgData(
  ) internal returns (bytes)
```

#### Modifiers:
No modifiers





