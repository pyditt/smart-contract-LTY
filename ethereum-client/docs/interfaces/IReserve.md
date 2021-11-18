# IReserve





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### uniswapV2Pair


#### Declaration
```solidity
  function uniswapV2Pair(
  ) external returns (contract IUniswapV2Pair)
```

#### Modifiers:
No modifiers



### swapAndCollect
> Returns the amount of tokens in existence.

#### Declaration
```solidity
  function swapAndCollect(
  ) external
```

#### Modifiers:
No modifiers



### swapAndLiquify
> Returns the amount of tokens owned by `account`.

#### Declaration
```solidity
  function swapAndLiquify(
  ) external
```

#### Modifiers:
No modifiers



### buyAndBurn
> Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called.

#### Declaration
```solidity
  function buyAndBurn(
  ) external
```

#### Modifiers:
No modifiers





## Events

### BuyAndBurn
No description
> Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.



### SwapAndCollect
No description
> Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.



### SwapAndLiquify
No description
> Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.



