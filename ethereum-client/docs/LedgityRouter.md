# LedgityRouter





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| factory | contract IUniswapV2Factory |
| uniswapRouter | contract IUniswapV2Router02 |



## Functions

### constructor
> Initializes the contract setting up the router addresss.

#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### addLiquidityBypassingFee
> Adds liquidity bypassing fee.


#### Declaration
```solidity
  function addLiquidityBypassingFee(
    address tokenA,
    address tokenB,
    uint256 amountADesired,
    uint256 amountBDesired,
    uint256 amountAMin,
    uint256 amountBMin,
    address to,
    uint256 deadline
  ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`tokenA` | address | A pool token.
|`tokenB` | address | pool token.
|`amountADesired` | uint256 | The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).
|`amountBDesired` | uint256 | The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates).
|`amountAMin` | uint256 | Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.
|`amountBMin` | uint256 | Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired.
|`to` | address | Recipient of the liquidity tokens.
|`deadline` | uint256 | Unix timestamp after which the transaction will revert.

#### Returns:
`amountA` The amount of tokenA received.
`amountB` The amount of tokenB received.
### removeLiquidityBypassingFee
> Removes liquidity bypassing fee.


#### Declaration
```solidity
  function removeLiquidityBypassingFee(
    address tokenA,
    address tokenB,
    uint256 amountAMin,
    uint256 amountBMin,
    uint256 to,
    address deadline
  ) external returns (uint256 amountA, uint256 amountB)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`tokenA` | address | A pool token.
|`tokenB` | address | pool token.
|`amountAMin` | uint256 | The minimum amount of tokenA that must be received for the transaction not to revert.
|`amountBMin` | uint256 | The minimum amount of tokenB that must be received for the transaction not to revert.
|`to` | uint256 | Recipient of the liquidity tokens.
|`deadline` | address | Unix timestamp after which the transaction will revert.

#### Returns:
`amountA` The amount of tokenA received.
`amountB` The amount of tokenB received.


