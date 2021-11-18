# Reserve





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| uniswapV2Router | contract IUniswapV2Router02 |
| uniswapV2Pair | contract IUniswapV2Pair |
| token | contract ILedgity |
| usdc | contract IERC20 |
| timelock | address |


## Modifiers

### onlyToken
No description
> Reverts if `msg.sender` is NOT the ELEN token.

#### Declaration
```solidity
  modifier onlyToken
```



## Functions

### constructor
> Initializess the contract setting up uniswap router address, ELEN address and USDC address.

#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### buyAndBurn
> Buys tokens in the amount of usdcAmount. Then burns them.

Emits `BuyAndBurn` event.

#### Declaration
```solidity
  function buyAndBurn(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### swapAndCollect
> Exchanges tokens to usdc. After that, usdc remains on the contract.

Emits `SwapAndCollect` event.

#### Declaration
```solidity
  function swapAndCollect(
  ) external onlyToken
```

#### Modifiers:
| Modifier |
| --- |
| onlyToken |



### swapAndLiquify
> Depending on the conditions, either exchanges half
of the token Amount for USD or the same amount from the contract balance.
After that, it adds liquidity to the pool.

Emits `SwapAndLiquify` event.

#### Declaration
```solidity
  function swapAndLiquify(
  ) external onlyToken
```

#### Modifiers:
| Modifier |
| --- |
| onlyToken |



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



### uniswapV2Pair


#### Declaration
```solidity
  function uniswapV2Pair(
  ) external returns (contract IUniswapV2Pair)
```

#### Modifiers:
No modifiers





