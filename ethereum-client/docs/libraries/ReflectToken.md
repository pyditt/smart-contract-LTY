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





