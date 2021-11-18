# Ledgity





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| initialTotalSupply | uint256 |
| numTokensToSwap | uint256 |
| inSwapAndLiquify | bool |
| feeDestination | enum Ledgity.FeeDestination |
| sellAccumulationFee | struct Percent.Percent |
| initialSellAccumulationFee | struct Percent.Percent |
| sellAtSmallPriceAccumulationFee | struct Percent.Percent |
| initialSellAtSmallPriceAccumulationFee | struct Percent.Percent |
| sellReflectionFee | struct Percent.Percent |
| initialSellReflectionFee | struct Percent.Percent |
| buyAccumulationFee | struct Percent.Percent |
| initialBuyAccumulationFee | struct Percent.Percent |
| soldPerPeriod | mapping(address => uint256) |
| firstSellAt | mapping(address => uint256) |
| maxTransactionSizePercent | struct Percent.Percent |
| uniswapV2Pair | contract IUniswapV2Pair |
| reserve | contract IReserve |
| priceOracle | contract ILedgityPriceOracle |
| initialPrice | uint256 |


## Modifiers

### lockTheSwap
No description
> Blocks the possibility of exchange for the time of exchange and adding liquidity.

#### Declaration
```solidity
  modifier lockTheSwap
```



## Functions

### constructor
> Initializes the contract excluding itself and the owner from dex fee and limits.

#### Declaration
```solidity
  function constructor(
  ) public ReflectToken
```

#### Modifiers:
| Modifier |
| --- |
| ReflectToken |



### initializeReserve
> Sets reserve address. Also, excludes it from dex fee and limits.
Can be called only by the owner.

#### Declaration
```solidity
  function initializeReserve(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### initializePriceOracle
> Sets price oracle address. Can be called only by the owner.

#### Declaration
```solidity
  function initializePriceOracle(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### totalBurn
> Returns total amount of burnt tokens.

#### Declaration
```solidity
  function totalBurn(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### setDex
> Adds/removes `target` to the dexes list. Can be called only by the owner.
Can be called only by the owner.


#### Declaration
```solidity
  function setDex(
    address target,
    bool dex
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`target` | address | Address of dex.
|`dex` | bool | Add/remove `target` from dexes list.

### setFeeDestination
> Sets fee destination. Can be called only by the owner.


#### Declaration
```solidity
  function setFeeDestination(
    enum Ledgity.FeeDestination fd
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`fd` | enum Ledgity.FeeDestination | An enum `FeeDestination`. Can be `Liquify` or `Collect`.

### setIsExcludedFromDexFee
> Includes/Excludes `account` address from dex fee depending on `isExcluded`.
Can be called only by the owner.


#### Declaration
```solidity
  function setIsExcludedFromDexFee(
    address account,
    bool isExcluded
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of account to be excluded/NOT excluded from dex fee.
|`isExcluded` | bool | Include/Exclude `account` from dex fee.

### setIsExcludedFromLimits
> Includes/Excludes `account` address from limits depending on `isExcluded`.
Can be called only by the owner.


#### Declaration
```solidity
  function setIsExcludedFromLimits(
    address account,
    bool isExcluded
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of account to be excluded/NOT excluded from limits.
|`isExcluded` | bool | Include/Exclude `account` from limits.

### setNumTokensToSwap
> Sets number of tokens to swap. Can be called only by the owner.


#### Declaration
```solidity
  function setNumTokensToSwap(
    uint256 _numTokensToSwap
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_numTokensToSwap` | uint256 | Amount of tokens to swap.

### setMaxTransactionSizePercent
> Sets maxiumum transaction size which value is represented as a fraction.
Can be called only by the owner.


#### Declaration
```solidity
  function setMaxTransactionSizePercent(
    uint128 numerator,
    uint128 denominator
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`numerator` | uint128 | Numerator of a maximum transaction size value.
|`denominator` | uint128 | Denominator of a maximum transaction size value.

### setSellAccumulationFee
> Sets sell accumulation fee which value is represented as a fraction.
Can be called only by the owner.


#### Declaration
```solidity
  function setSellAccumulationFee(
    uint128 numerator,
    uint128 denominator
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`numerator` | uint128 | Numerator of a sell accumulation fee fractional value.
|`denominator` | uint128 | Denominator of a sell accumulation fee fractional value.

### setSellAtSmallPriceAccumulationFee
> Sets sell accumulation fee which value is represented as a fraction.
Can be called only by the owner.


#### Declaration
```solidity
  function setSellAtSmallPriceAccumulationFee(
    uint128 numerator,
    uint128 denominator
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`numerator` | uint128 | Numerator of a sell accumulation fee fractional value.
|`denominator` | uint128 | Denominator of a sell accumulation fee fractional value.

### setSellReflectionFee
> Sets sell reflection fee which value is represented as a fraction.
Can be called only by the owner.


#### Declaration
```solidity
  function setSellReflectionFee(
    uint128 numerator,
    uint128 denominator
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`numerator` | uint128 | Numerator of a sell reflection fee fractional value.
|`denominator` | uint128 | Denominator of a sell reflection fee fractional value.

### setBuyAccumulationFee
> Sets buy accumulation fee which value is represented as a fraction.
Can be called only by the owner.


#### Declaration
```solidity
  function setBuyAccumulationFee(
    uint128 numerator,
    uint128 denominator
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`numerator` | uint128 | Numerator of a buy accumulation fee fractional value.
|`denominator` | uint128 | Denominator of a buy accumulation fee fractional value.

### burn
> Burns `amount` tokens.


#### Declaration
```solidity
  function burn(
  ) external returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
`true` if burn succeded else `false`.
### getDexes
> Returns an array of dexes addresses.

#### Declaration
```solidity
  function getDexes(
  ) external returns (address[])
```

#### Modifiers:
No modifiers



### getExcludedFromDexFee
> Returns an array of addresses excluded from dex fee.

#### Declaration
```solidity
  function getExcludedFromDexFee(
  ) external returns (address[])
```

#### Modifiers:
No modifiers



### getExcludedFromLimits
> Returns an array of addresses excluded from limits.

#### Declaration
```solidity
  function getExcludedFromLimits(
  ) external returns (address[])
```

#### Modifiers:
No modifiers



### isDex
> Checks if `account` is dex.


#### Declaration
```solidity
  function isDex(
    address account
  ) public returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address that is being checked whether it's dex.

#### Returns:
`true` if `account` is in the dexes list else `false`
### isExcludedFromDexFee
> Checks if `account` is excluded from dex fee.


#### Declaration
```solidity
  function isExcludedFromDexFee(
    address account
  ) public returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address that is being checked where it's excluded from dex fee.

#### Returns:
`true` if `account` is excluded from dex fee else `false`.
### isExcludedFromLimits
> Checks if `account` is excluded from limits.


#### Declaration
```solidity
  function isExcludedFromLimits(
    address account
  ) public returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address that is being checked where it's excluded from limits.

#### Returns:
`true` if `account` is excluded from limits else `false`.
### _calculateReflectionFee
> Computes reflection fee.


#### Declaration
```solidity
  function _calculateReflectionFee(
    address sender,
    address recipient,
    uint256 amount
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`sender` | address | Address of the sender.
|`recipient` | address | Address of the recipient.
|`amount` | uint256 | Amount of tokens.

### _calculateAccumulationFee
> Computes accumulation fee.


#### Declaration
```solidity
  function _calculateAccumulationFee(
    address sender,
    address recipient,
    uint256 amount
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`sender` | address | Address of the sender.
|`recipient` | address | Address of the recipient.
|`amount` | uint256 | Amount of tokens.

### _transfer
> Moves `amount` tokens from `sender` to `recipient`.
Control the limit of tokens sold on dex.
When numTokensToSwap is reached, it executes {_swapandliquifyorcollect}.
See {ReflectToken}.

#### Declaration
```solidity
  function _transfer(
  ) internal
```

#### Modifiers:
No modifiers



### maxTransactionSize
> Returns max transaction size.

#### Declaration
```solidity
  function maxTransactionSize(
  ) public returns (uint256)
```

#### Modifiers:
No modifiers



### name
> Returns the name of the token.

#### Declaration
```solidity
  function name(
  ) external returns (string)
```

#### Modifiers:
No modifiers



### symbol
> Returns the symbol of the token, usually a shorter version of the
name.

#### Declaration
```solidity
  function symbol(
  ) external returns (string)
```

#### Modifiers:
No modifiers



### decimals
> Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}.

#### Declaration
```solidity
  function decimals(
  ) external returns (uint8)
```

#### Modifiers:
No modifiers



### totalSupply
> See {IERC20-totalSupply}.

#### Declaration
```solidity
  function totalSupply(
  ) public returns (uint256)
```

#### Modifiers:
No modifiers



### balanceOf
> Returns the amount of tokens owned by `account` considering `tokenFromReflection`.

#### Declaration
```solidity
  function balanceOf(
  ) public returns (uint256)
```

#### Modifiers:
No modifiers



### transfer
> See {IERC20-transfer}.

Requirements:

- `recipient` cannot be the zero address.
- the caller must have a balance of at least `amount`.

#### Declaration
```solidity
  function transfer(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### allowance
> See {IERC20-allowance}.

#### Declaration
```solidity
  function allowance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### approve
> See {IERC20-approve}.

Requirements:

- `spender` cannot be the zero address.

#### Declaration
```solidity
  function approve(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### transferFrom
> See {IERC20-transferFrom}.

Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {ERC20}.

Requirements:

- `sender` and `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.
- the caller must have allowance for ``sender``'s tokens of at least
`amount`.

#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### increaseAllowance
> Atomically increases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- `spender` cannot be the zero address.

#### Declaration
```solidity
  function increaseAllowance(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### decreaseAllowance
> Atomically decreases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- `spender` cannot be the zero address.
- `spender` must have allowance for the caller of at least
`subtractedValue`.

#### Declaration
```solidity
  function decreaseAllowance(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### getExcluded
> Returns array of excluded accounts from reflection rewards.

#### Declaration
```solidity
  function getExcluded(
  ) external returns (address[])
```

#### Modifiers:
No modifiers



### isExcluded
> Checks whether account is excluded from reflection rewards.


#### Declaration
```solidity
  function isExcluded(
    address account
  ) public returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of an account.

### totalFees
> Returns number of total fees. It increases when fees are applied.

#### Declaration
```solidity
  function totalFees(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### reflect
> Allows to distribute certain amount of tokens with reflect mechanism.


#### Declaration
```solidity
  function reflect(
    uint256 tAmount
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`tAmount` | uint256 | Amount of tokens to distribute.

### reflectionFromToken
> Returns amount of tokens in a Tx when applying a fee.


#### Declaration
```solidity
  function reflectionFromToken(
    uint256 tAmount,
    bool deductTransferFee
  ) external returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`tAmount` | uint256 | Amount of tokens.
|`deductTransferFee` | bool | Decide whether to apply a fee or not.

### tokenFromReflection
> Converts reflection to token amount.


#### Declaration
```solidity
  function tokenFromReflection(
    uint256 rAmount
  ) public returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rAmount` | uint256 | Amount of reflection.

### excludeAccount
> Excludes account from retrieveng reflect rewards. Can be called only by the owner.


#### Declaration
```solidity
  function excludeAccount(
    address account
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of the account.

### includeAccount
> Allows account to retrieve reflect rewards. Can be called only by the owner.


#### Declaration
```solidity
  function includeAccount(
    address account
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of the account.

### _burn
> Destroys `amount` tokens from `account`, reducing the
total supply.

Emits a {Transfer} event with `to` set to the zero address.

Requirements:

- `account` cannot be the zero address.
- `account` must have at least `amount` tokens.

#### Declaration
```solidity
  function _burn(
  ) internal
```

#### Modifiers:
No modifiers



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







# LedgityPriceOracleAdjusted





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







# MockERC20





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| name | string |
| symbol | string |
| totalSupply | uint256 |
| decimals | uint8 |
| balanceOf | mapping(address => uint256) |
| allowance | mapping(address => mapping(address => uint256)) |



## Functions

### constructor


#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### transfer


#### Declaration
```solidity
  function transfer(
  ) external returns (bool success)
```

#### Modifiers:
No modifiers



### approve


#### Declaration
```solidity
  function approve(
  ) external returns (bool success)
```

#### Modifiers:
No modifiers



### transferFrom


#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool success)
```

#### Modifiers:
No modifiers



### mint


#### Declaration
```solidity
  function mint(
  ) external
```

#### Modifiers:
No modifiers





## Events

### Transfer
No description




### Approval
No description






# MockUSDC





## Contents
<!-- START doctoc -->
<!-- END doctoc -->








# MockLedgity





## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| reserve | contract IReserve |



## Functions

### setReserve


#### Declaration
```solidity
  function setReserve(
  ) external
```

#### Modifiers:
No modifiers



### swapAndCollect


#### Declaration
```solidity
  function swapAndCollect(
  ) external
```

#### Modifiers:
No modifiers



### swapAndLiquify


#### Declaration
```solidity
  function swapAndLiquify(
  ) external
```

#### Modifiers:
No modifiers



### burn


#### Declaration
```solidity
  function burn(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### constructor


#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### transfer


#### Declaration
```solidity
  function transfer(
  ) external returns (bool success)
```

#### Modifiers:
No modifiers



### approve


#### Declaration
```solidity
  function approve(
  ) external returns (bool success)
```

#### Modifiers:
No modifiers



### transferFrom


#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool success)
```

#### Modifiers:
No modifiers



### mint


#### Declaration
```solidity
  function mint(
  ) external
```

#### Modifiers:
No modifiers







# SetWrapper



> Wrapper for testing.

## Contents
<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var | Type |
| --- | --- |
| lastAction | bool |



## Functions

### values


#### Declaration
```solidity
  function values(
  ) external returns (address[])
```

#### Modifiers:
No modifiers



### add


#### Declaration
```solidity
  function add(
  ) external
```

#### Modifiers:
No modifiers



### remove


#### Declaration
```solidity
  function remove(
  ) external
```

#### Modifiers:
No modifiers



### has


#### Declaration
```solidity
  function has(
  ) external returns (bool)
```

#### Modifiers:
No modifiers







# IERC20





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### totalSupply
> Returns the amount of tokens in existence.

#### Declaration
```solidity
  function totalSupply(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### balanceOf
> Returns the amount of tokens owned by `account`.

#### Declaration
```solidity
  function balanceOf(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### transfer
> Moves `amount` tokens from the caller's account to `recipient`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event.

#### Declaration
```solidity
  function transfer(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### allowance
> Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called.

#### Declaration
```solidity
  function allowance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### approve
> Sets `amount` as the allowance of `spender` over the caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event.

#### Declaration
```solidity
  function approve(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### transferFrom
> Moves `amount` tokens from `sender` to `recipient` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event.

#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool)
```

#### Modifiers:
No modifiers





## Events

### Transfer
No description
> Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.



### Approval
No description
> Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.





# ILedgity





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### burn


#### Declaration
```solidity
  function burn(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### totalSupply
> Returns the amount of tokens in existence.

#### Declaration
```solidity
  function totalSupply(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### balanceOf
> Returns the amount of tokens owned by `account`.

#### Declaration
```solidity
  function balanceOf(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### transfer
> Moves `amount` tokens from the caller's account to `recipient`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event.

#### Declaration
```solidity
  function transfer(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### allowance
> Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called.

#### Declaration
```solidity
  function allowance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### approve
> Sets `amount` as the allowance of `spender` over the caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event.

#### Declaration
```solidity
  function approve(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### transferFrom
> Moves `amount` tokens from `sender` to `recipient` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event.

#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool)
```

#### Modifiers:
No modifiers







# ILedgityPriceOracle





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### tryUpdate
> Update average price.


#### Declaration
```solidity
  function tryUpdate(
  ) external returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
`if` update successful; `false` if period has not yet elapsed.
### update
> Update average price. Reverts if period has not yet elapsed.

#### Declaration
```solidity
  function update(
  ) external
```

#### Modifiers:
No modifiers



### consult
> Returns the price of tokens.

#### Declaration
```solidity
  function consult(
  ) external returns (uint256 amountOut)
```

#### Modifiers:
No modifiers







# ILedgityRouter





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### addLiquidityBypassingFee


#### Declaration
```solidity
  function addLiquidityBypassingFee(
  ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)
```

#### Modifiers:
No modifiers



### removeLiquidityBypassingFee


#### Declaration
```solidity
  function removeLiquidityBypassingFee(
  ) external returns (uint256 amountA, uint256 amountB)
```

#### Modifiers:
No modifiers







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





# IUniswapV2Factory





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### feeTo


#### Declaration
```solidity
  function feeTo(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### feeToSetter


#### Declaration
```solidity
  function feeToSetter(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### getPair


#### Declaration
```solidity
  function getPair(
  ) external returns (address pair)
```

#### Modifiers:
No modifiers



### allPairs


#### Declaration
```solidity
  function allPairs(
  ) external returns (address pair)
```

#### Modifiers:
No modifiers



### allPairsLength


#### Declaration
```solidity
  function allPairsLength(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### createPair


#### Declaration
```solidity
  function createPair(
  ) external returns (address pair)
```

#### Modifiers:
No modifiers



### setFeeTo


#### Declaration
```solidity
  function setFeeTo(
  ) external
```

#### Modifiers:
No modifiers



### setFeeToSetter


#### Declaration
```solidity
  function setFeeToSetter(
  ) external
```

#### Modifiers:
No modifiers





## Events

### PairCreated
No description






# IUniswapV2Pair





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### name


#### Declaration
```solidity
  function name(
  ) external returns (string)
```

#### Modifiers:
No modifiers



### symbol


#### Declaration
```solidity
  function symbol(
  ) external returns (string)
```

#### Modifiers:
No modifiers



### decimals


#### Declaration
```solidity
  function decimals(
  ) external returns (uint8)
```

#### Modifiers:
No modifiers



### totalSupply


#### Declaration
```solidity
  function totalSupply(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### balanceOf


#### Declaration
```solidity
  function balanceOf(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### allowance


#### Declaration
```solidity
  function allowance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### approve


#### Declaration
```solidity
  function approve(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### transfer


#### Declaration
```solidity
  function transfer(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### transferFrom


#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### DOMAIN_SEPARATOR


#### Declaration
```solidity
  function DOMAIN_SEPARATOR(
  ) external returns (bytes32)
```

#### Modifiers:
No modifiers



### PERMIT_TYPEHASH


#### Declaration
```solidity
  function PERMIT_TYPEHASH(
  ) external returns (bytes32)
```

#### Modifiers:
No modifiers



### nonces


#### Declaration
```solidity
  function nonces(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### permit


#### Declaration
```solidity
  function permit(
  ) external
```

#### Modifiers:
No modifiers



### MINIMUM_LIQUIDITY


#### Declaration
```solidity
  function MINIMUM_LIQUIDITY(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### factory


#### Declaration
```solidity
  function factory(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### token0


#### Declaration
```solidity
  function token0(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### token1


#### Declaration
```solidity
  function token1(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### getReserves


#### Declaration
```solidity
  function getReserves(
  ) external returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)
```

#### Modifiers:
No modifiers



### price0CumulativeLast


#### Declaration
```solidity
  function price0CumulativeLast(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### price1CumulativeLast


#### Declaration
```solidity
  function price1CumulativeLast(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### kLast


#### Declaration
```solidity
  function kLast(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### mint


#### Declaration
```solidity
  function mint(
  ) external returns (uint256 liquidity)
```

#### Modifiers:
No modifiers



### burn


#### Declaration
```solidity
  function burn(
  ) external returns (uint256 amount0, uint256 amount1)
```

#### Modifiers:
No modifiers



### swap


#### Declaration
```solidity
  function swap(
  ) external
```

#### Modifiers:
No modifiers



### skim


#### Declaration
```solidity
  function skim(
  ) external
```

#### Modifiers:
No modifiers



### sync


#### Declaration
```solidity
  function sync(
  ) external
```

#### Modifiers:
No modifiers



### initialize


#### Declaration
```solidity
  function initialize(
  ) external
```

#### Modifiers:
No modifiers





## Events

### Approval
No description




### Transfer
No description




### Mint
No description




### Burn
No description




### Swap
No description




### Sync
No description






# IUniswapV2Router01





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### factory


#### Declaration
```solidity
  function factory(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### WETH


#### Declaration
```solidity
  function WETH(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### addLiquidity


#### Declaration
```solidity
  function addLiquidity(
  ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)
```

#### Modifiers:
No modifiers



### addLiquidityETH


#### Declaration
```solidity
  function addLiquidityETH(
  ) external returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)
```

#### Modifiers:
No modifiers



### removeLiquidity


#### Declaration
```solidity
  function removeLiquidity(
  ) external returns (uint256 amountA, uint256 amountB)
```

#### Modifiers:
No modifiers



### removeLiquidityETH


#### Declaration
```solidity
  function removeLiquidityETH(
  ) external returns (uint256 amountToken, uint256 amountETH)
```

#### Modifiers:
No modifiers



### removeLiquidityWithPermit


#### Declaration
```solidity
  function removeLiquidityWithPermit(
  ) external returns (uint256 amountA, uint256 amountB)
```

#### Modifiers:
No modifiers



### removeLiquidityETHWithPermit


#### Declaration
```solidity
  function removeLiquidityETHWithPermit(
  ) external returns (uint256 amountToken, uint256 amountETH)
```

#### Modifiers:
No modifiers



### swapExactTokensForTokens


#### Declaration
```solidity
  function swapExactTokensForTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapTokensForExactTokens


#### Declaration
```solidity
  function swapTokensForExactTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapExactETHForTokens


#### Declaration
```solidity
  function swapExactETHForTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapTokensForExactETH


#### Declaration
```solidity
  function swapTokensForExactETH(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapExactTokensForETH


#### Declaration
```solidity
  function swapExactTokensForETH(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapETHForExactTokens


#### Declaration
```solidity
  function swapETHForExactTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### quote


#### Declaration
```solidity
  function quote(
  ) external returns (uint256 amountB)
```

#### Modifiers:
No modifiers



### getAmountOut


#### Declaration
```solidity
  function getAmountOut(
  ) external returns (uint256 amountOut)
```

#### Modifiers:
No modifiers



### getAmountIn


#### Declaration
```solidity
  function getAmountIn(
  ) external returns (uint256 amountIn)
```

#### Modifiers:
No modifiers



### getAmountsOut


#### Declaration
```solidity
  function getAmountsOut(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### getAmountsIn


#### Declaration
```solidity
  function getAmountsIn(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers







# IUniswapV2Router02





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### removeLiquidityETHSupportingFeeOnTransferTokens


#### Declaration
```solidity
  function removeLiquidityETHSupportingFeeOnTransferTokens(
  ) external returns (uint256 amountETH)
```

#### Modifiers:
No modifiers



### removeLiquidityETHWithPermitSupportingFeeOnTransferTokens


#### Declaration
```solidity
  function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
  ) external returns (uint256 amountETH)
```

#### Modifiers:
No modifiers



### swapExactTokensForTokensSupportingFeeOnTransferTokens


#### Declaration
```solidity
  function swapExactTokensForTokensSupportingFeeOnTransferTokens(
  ) external
```

#### Modifiers:
No modifiers



### swapExactETHForTokensSupportingFeeOnTransferTokens


#### Declaration
```solidity
  function swapExactETHForTokensSupportingFeeOnTransferTokens(
  ) external
```

#### Modifiers:
No modifiers



### swapExactTokensForETHSupportingFeeOnTransferTokens


#### Declaration
```solidity
  function swapExactTokensForETHSupportingFeeOnTransferTokens(
  ) external
```

#### Modifiers:
No modifiers



### factory


#### Declaration
```solidity
  function factory(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### WETH


#### Declaration
```solidity
  function WETH(
  ) external returns (address)
```

#### Modifiers:
No modifiers



### addLiquidity


#### Declaration
```solidity
  function addLiquidity(
  ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)
```

#### Modifiers:
No modifiers



### addLiquidityETH


#### Declaration
```solidity
  function addLiquidityETH(
  ) external returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)
```

#### Modifiers:
No modifiers



### removeLiquidity


#### Declaration
```solidity
  function removeLiquidity(
  ) external returns (uint256 amountA, uint256 amountB)
```

#### Modifiers:
No modifiers



### removeLiquidityETH


#### Declaration
```solidity
  function removeLiquidityETH(
  ) external returns (uint256 amountToken, uint256 amountETH)
```

#### Modifiers:
No modifiers



### removeLiquidityWithPermit


#### Declaration
```solidity
  function removeLiquidityWithPermit(
  ) external returns (uint256 amountA, uint256 amountB)
```

#### Modifiers:
No modifiers



### removeLiquidityETHWithPermit


#### Declaration
```solidity
  function removeLiquidityETHWithPermit(
  ) external returns (uint256 amountToken, uint256 amountETH)
```

#### Modifiers:
No modifiers



### swapExactTokensForTokens


#### Declaration
```solidity
  function swapExactTokensForTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapTokensForExactTokens


#### Declaration
```solidity
  function swapTokensForExactTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapExactETHForTokens


#### Declaration
```solidity
  function swapExactETHForTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapTokensForExactETH


#### Declaration
```solidity
  function swapTokensForExactETH(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapExactTokensForETH


#### Declaration
```solidity
  function swapExactTokensForETH(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### swapETHForExactTokens


#### Declaration
```solidity
  function swapETHForExactTokens(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### quote


#### Declaration
```solidity
  function quote(
  ) external returns (uint256 amountB)
```

#### Modifiers:
No modifiers



### getAmountOut


#### Declaration
```solidity
  function getAmountOut(
  ) external returns (uint256 amountOut)
```

#### Modifiers:
No modifiers



### getAmountIn


#### Declaration
```solidity
  function getAmountIn(
  ) external returns (uint256 amountIn)
```

#### Modifiers:
No modifiers



### getAmountsOut


#### Declaration
```solidity
  function getAmountsOut(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers



### getAmountsIn


#### Declaration
```solidity
  function getAmountsIn(
  ) external returns (uint256[] amounts)
```

#### Modifiers:
No modifiers







# Context





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

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







# Ownable





## Contents
<!-- START doctoc -->
<!-- END doctoc -->



## Modifiers

### onlyOwner
No description
> Throws if called by any account other than the owner.

#### Declaration
```solidity
  modifier onlyOwner
```



## Functions

### constructor
> Initializes the contract setting the deployer as the initial owner.

#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



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





## Events

### OwnershipTransferred
No description






# Percent





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### encode


#### Declaration
```solidity
  function encode(
  ) internal returns (struct Percent.Percent)
```

#### Modifiers:
No modifiers



### mul


#### Declaration
```solidity
  function mul(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### lte


#### Declaration
```solidity
  function lte(
  ) internal returns (bool)
```

#### Modifiers:
No modifiers







# ReflectToken





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### constructor
> Sets the values for {name} and {symbol}.

The default value of {decimals} is 18. To select a different value for
{decimals} you should overload it.

All two of these values are immutable: they can only be set once during
construction.

#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### _calculateReflectionFee
> Amount of tokens to be charged as a reflection fee. Must be in range 0..amount.

#### Declaration
```solidity
  function _calculateReflectionFee(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### _calculateAccumulationFee
> Amount of tokens to be charged and stored in this contract. Must be in range 0..amount.

#### Declaration
```solidity
  function _calculateAccumulationFee(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### name
> Returns the name of the token.

#### Declaration
```solidity
  function name(
  ) external returns (string)
```

#### Modifiers:
No modifiers



### symbol
> Returns the symbol of the token, usually a shorter version of the
name.

#### Declaration
```solidity
  function symbol(
  ) external returns (string)
```

#### Modifiers:
No modifiers



### decimals
> Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}.

#### Declaration
```solidity
  function decimals(
  ) external returns (uint8)
```

#### Modifiers:
No modifiers



### totalSupply
> See {IERC20-totalSupply}.

#### Declaration
```solidity
  function totalSupply(
  ) public returns (uint256)
```

#### Modifiers:
No modifiers



### balanceOf
> Returns the amount of tokens owned by `account` considering `tokenFromReflection`.

#### Declaration
```solidity
  function balanceOf(
  ) public returns (uint256)
```

#### Modifiers:
No modifiers



### transfer
> See {IERC20-transfer}.

Requirements:

- `recipient` cannot be the zero address.
- the caller must have a balance of at least `amount`.

#### Declaration
```solidity
  function transfer(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### allowance
> See {IERC20-allowance}.

#### Declaration
```solidity
  function allowance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### approve
> See {IERC20-approve}.

Requirements:

- `spender` cannot be the zero address.

#### Declaration
```solidity
  function approve(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### transferFrom
> See {IERC20-transferFrom}.

Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {ERC20}.

Requirements:

- `sender` and `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.
- the caller must have allowance for ``sender``'s tokens of at least
`amount`.

#### Declaration
```solidity
  function transferFrom(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### increaseAllowance
> Atomically increases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- `spender` cannot be the zero address.

#### Declaration
```solidity
  function increaseAllowance(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### decreaseAllowance
> Atomically decreases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- `spender` cannot be the zero address.
- `spender` must have allowance for the caller of at least
`subtractedValue`.

#### Declaration
```solidity
  function decreaseAllowance(
  ) external returns (bool)
```

#### Modifiers:
No modifiers



### getExcluded
> Returns array of excluded accounts from reflection rewards.

#### Declaration
```solidity
  function getExcluded(
  ) external returns (address[])
```

#### Modifiers:
No modifiers



### isExcluded
> Checks whether account is excluded from reflection rewards.


#### Declaration
```solidity
  function isExcluded(
    address account
  ) public returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of an account.

### totalFees
> Returns number of total fees. It increases when fees are applied.

#### Declaration
```solidity
  function totalFees(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### reflect
> Allows to distribute certain amount of tokens with reflect mechanism.


#### Declaration
```solidity
  function reflect(
    uint256 tAmount
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`tAmount` | uint256 | Amount of tokens to distribute.

### reflectionFromToken
> Returns amount of tokens in a Tx when applying a fee.


#### Declaration
```solidity
  function reflectionFromToken(
    uint256 tAmount,
    bool deductTransferFee
  ) external returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`tAmount` | uint256 | Amount of tokens.
|`deductTransferFee` | bool | Decide whether to apply a fee or not.

### tokenFromReflection
> Converts reflection to token amount.


#### Declaration
```solidity
  function tokenFromReflection(
    uint256 rAmount
  ) public returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rAmount` | uint256 | Amount of reflection.

### excludeAccount
> Excludes account from retrieveng reflect rewards. Can be called only by the owner.


#### Declaration
```solidity
  function excludeAccount(
    address account
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of the account.

### includeAccount
> Allows account to retrieve reflect rewards. Can be called only by the owner.


#### Declaration
```solidity
  function includeAccount(
    address account
  ) public onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`account` | address | Address of the account.

### _burn
> Destroys `amount` tokens from `account`, reducing the
total supply.

Emits a {Transfer} event with `to` set to the zero address.

Requirements:

- `account` cannot be the zero address.
- `account` must have at least `amount` tokens.

#### Declaration
```solidity
  function _burn(
  ) internal
```

#### Modifiers:
No modifiers



### _transfer
> See {IERC20-transfer}.

Transfer is executed considering both accounts states recipient and sender.
Also, distributes reflection rewards and accumulates fee.

Requirements:

- `recipient` cannot be the zero address.
- the caller must have a balance of at least `amount`.

#### Declaration
```solidity
  function _transfer(
  ) internal
```

#### Modifiers:
No modifiers



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







# SafeERC20





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### safeTransfer


#### Declaration
```solidity
  function safeTransfer(
  ) internal
```

#### Modifiers:
No modifiers



### safeTransferFrom


#### Declaration
```solidity
  function safeTransferFrom(
  ) internal
```

#### Modifiers:
No modifiers



### safeApprove


#### Declaration
```solidity
  function safeApprove(
  ) internal
```

#### Modifiers:
No modifiers







# SafeMath





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### add
> Returns the addition of two unsigned integers, reverting on
overflow.

Counterpart to Solidity's `+` operator.

Requirements:

- Addition cannot overflow.

#### Declaration
```solidity
  function add(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### sub
> Returns the subtraction of two unsigned integers, reverting on
overflow (when the result is negative).

Counterpart to Solidity's `-` operator.

Requirements:

- Subtraction cannot overflow.

#### Declaration
```solidity
  function sub(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### sub
> Returns the subtraction of two unsigned integers, reverting with custom message on
overflow (when the result is negative).

Counterpart to Solidity's `-` operator.

Requirements:

- Subtraction cannot overflow.

#### Declaration
```solidity
  function sub(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### mul
> Returns the multiplication of two unsigned integers, reverting on
overflow.

Counterpart to Solidity's `*` operator.

Requirements:

- Multiplication cannot overflow.

#### Declaration
```solidity
  function mul(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### div
> Returns the integer division of two unsigned integers. Reverts on
division by zero. The result is rounded towards zero.

Counterpart to Solidity's `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero.

#### Declaration
```solidity
  function div(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### div
> Returns the integer division of two unsigned integers. Reverts with custom message on
division by zero. The result is rounded towards zero.

Counterpart to Solidity's `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero.

#### Declaration
```solidity
  function div(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers







# Set





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### add
> Adds a value to the set.


#### Declaration
```solidity
  function add(
  ) internal returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
`if` the value was successfully added; `false` if the value was already in the set.
### remove
> Removes a value from the set.


#### Declaration
```solidity
  function remove(
  ) internal returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
`if` value was successfully removed; `false` if the value was not in the set.
### has
> Checks if a value is in the set.


#### Declaration
```solidity
  function has(
  ) internal returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
`if` the value is in the set; `false` if the value is not in the set.




# UniswapV2OracleLibrary





## Contents
<!-- START doctoc -->
<!-- END doctoc -->




## Functions

### currentBlockTimestamp


#### Declaration
```solidity
  function currentBlockTimestamp(
  ) internal returns (uint32)
```

#### Modifiers:
No modifiers



### currentCumulativePrices


#### Declaration
```solidity
  function currentCumulativePrices(
  ) internal returns (uint256 price0Cumulative, uint256 price1Cumulative, uint32 blockTimestamp)
```

#### Modifiers:
No modifiers





