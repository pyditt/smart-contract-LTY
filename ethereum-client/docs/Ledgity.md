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





