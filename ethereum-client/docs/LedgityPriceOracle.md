# LedgityPriceOracle





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| period | uint256 |
| pair | contract IUniswapV2Pair |
| token0 | address |
| token1 | address |
| price0CumulativeLast | uint256 |
| price1CumulativeLast | uint256 |
| blockTimestampLast | uint32 |
| price0Average | struct FixedPoint.uq112x112 |
| price1Average | struct FixedPoint.uq112x112 |



## Functions

### constructor


#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### update
> Updates average price. Reverts if period has not elapsed yet.

#### Declaration
```solidity
  function update(
  ) external
```

#### Modifiers:
No modifiers



### tryUpdate
> Updates average price.


#### Declaration
```solidity
  function tryUpdate(
  ) public returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
`true` if update succeded. `false` if period has not elapsed yet.
### consult
> Returns the price of tokens.


#### Declaration
```solidity
  function consult(
    address token,
    uint256 amountIn
  ) external returns (uint256 amountOut)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`token` | address | Address of a token.
|`amountIn` | uint256 | amount of tokens.

### changePeriod
> Sets new period. Reverts if `_period` < 0 or reserves are empty.
Can be called only by the owner.

#### Declaration
```solidity
  function changePeriod(
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



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





