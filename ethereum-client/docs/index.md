# Ledgity


You can use this contract for only the most basic simulation

All function calls are currently implemented without side effects

## Functions

### `constructor()`
Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.
This value changes when {approve} or {transferFrom} are called.


### `initializeReserve(address reserveAddress)`
The Alexandr N. Tetearing algorithm could increase precision


#### Parameters:
- `reserveAddress`: The number of rings from dendrochronological sample

### `initializePriceOracle(address priceOracleAddress)`
No description


### `totalBurn() → uint256`
No description


### `setDex(address target, bool dex)`
No description


### `setFeeDestination(enum Ledgity.FeeDestination fd)`
No description


### `setIsExcludedFromDexFee(address account, bool isExcluded)`
No description


### `setIsExcludedFromLimits(address account, bool isExcluded)`
No description


### `setNumTokensToSwap(uint256 _numTokensToSwap)`
No description


### `setMaxTransactionSizePercent(uint128 numerator, uint128 denominator)`
No description


### `setSellAccumulationFee(uint128 numerator, uint128 denominator)`
No description


### `setSellAtSmallPriceAccumulationFee(uint128 numerator, uint128 denominator)`
No description


### `setSellReflectionFee(uint128 numerator, uint128 denominator)`
No description


### `setBuyAccumulationFee(uint128 numerator, uint128 denominator)`
No description


### `burn(uint256 amount) → bool`
No description


### `getDexes() → address[]`
No description


### `getExcludedFromDexFee() → address[]`
No description


### `getExcludedFromLimits() → address[]`
No description


### `isDex(address account) → bool`
The Alexandr N. Tetearing algorithm could increase precision


#### Parameters:
- `account`: The number of rings from dendrochronological sample

#### Return Values:
- bool in years, rounded up for partial years

### `isExcludedFromDexFee(address account) → bool`
No description


### `isExcludedFromLimits(address account) → bool`
No description


### `_calculateReflectionFee(address sender, address recipient, uint256 amount) → uint256`
No description


### `_calculateAccumulationFee(address sender, address recipient, uint256 amount) → uint256`
No description


### `_transfer(address sender, address recipient, uint256 amount)`
Transfer token to a specified address.


#### Parameters:
- `sender`: The address to transfer to.

- `recipient`: The amount to be transferred.

- `amount`: The amount to be transferred.

### `maxTransactionSize() → uint256`
No description







# LedgityPriceOracle





## Functions

### `constructor(address pair_)`
No description


### `update()`
No description


### `tryUpdate() → bool`
No description


### `consult(address token, uint256 amountIn) → uint256 amountOut`
No description


### `changePeriod(uint256 _period)`
No description







# LedgityPriceOracleAdjusted





## Functions

### `constructor(address pair_)`
No description


### `update()`
No description


### `tryUpdate() → bool`
No description


### `consult(address token, uint256 amountIn) → uint256 amountOut`
No description


### `changePeriod(uint256 _period)`
No description







# LedgityRouter





## Functions

### `constructor(address _router)`
No description


### `addLiquidityBypassingFee(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) → uint256 amountA, uint256 amountB, uint256 liquidity`
No description


### `removeLiquidityBypassingFee(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) → uint256 amountA, uint256 amountB`
No description







# Reserve





## Functions

### `constructor(address uniswapRouter, address TOKEN, address USDC, address timelock_)`
No description


### `buyAndBurn(uint256 usdcAmount)`
No description


### `swapAndCollect(uint256 tokenAmount)`
No description


### `swapAndLiquify(uint256 tokenAmount)`
No description







# Timelock





## Functions

### `constructor(uint256 delay)`
No description


### `withdraw(address token, uint256 amount)`
No description


### `setDelay(uint256 delay)`
No description







# MockERC20





## Functions

### `constructor(string name_, string symbol_, uint8 decimals_)`
No description


### `transfer(address _to, uint256 _value) → bool success`
No description


### `approve(address _spender, uint256 _value) → bool success`
No description


### `transferFrom(address _from, address _to, uint256 _value) → bool success`
No description


### `mint(address account, uint256 amount)`
No description




## Events

### `Transfer(address _from, address _to, uint256 _value)`
No description

### `Approval(address _owner, address _spender, uint256 _value)`
No description



# MockUSDC











# MockLedgity





## Functions

### `setReserve(address _reserve)`
No description


### `swapAndCollect(uint256 tokenAmount)`
No description


### `swapAndLiquify(uint256 tokenAmount)`
No description


### `burn(uint256 amount) → bool`
No description







# SetWrapper



Wrapper for testing.

## Functions

### `values() → address[]`
No description


### `add(address value)`
No description


### `remove(address value)`
No description


### `has(address value) → bool`
No description







# IERC20





## Functions

### `totalSupply() → uint256`
Returns the amount of tokens in existence.


### `balanceOf(address account) → uint256`
Returns the amount of tokens owned by `account`.


### `transfer(address recipient, uint256 amount) → bool`
Moves `amount` tokens from the caller's account to `recipient`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event.


### `allowance(address owner, address spender) → uint256`
Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called.


### `approve(address spender, uint256 amount) → bool`
Sets `amount` as the allowance of `spender` over the caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event.


### `transferFrom(address sender, address recipient, uint256 amount) → bool`
Moves `amount` tokens from `sender` to `recipient` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event.




## Events

### `Transfer(address from, address to, uint256 value)`
Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.

### `Approval(address owner, address spender, uint256 value)`
Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.



# ILedgity





## Functions

### `burn(uint256 amount) → bool`
No description







# ILedgityPriceOracle





## Functions

### `tryUpdate() → bool`
Update average price.


#### Return Values:
- if update successful; `false` if period has not yet elapsed.

### `update()`
Update average price. Reverts if period has not yet elapsed.


### `consult(address token, uint256 amountIn) → uint256 amountOut`
Returns the price of tokens.







# ILedgityRouter





## Functions

### `addLiquidityBypassingFee(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) → uint256 amountA, uint256 amountB, uint256 liquidity`
No description


### `removeLiquidityBypassingFee(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) → uint256 amountA, uint256 amountB`
No description







# IReserve





## Functions

### `uniswapV2Pair() → contract IUniswapV2Pair`
No description


### `swapAndCollect(uint256 tokenAmount)`
Returns the amount of tokens in existence.


### `swapAndLiquify(uint256 tokenAmount)`
Returns the amount of tokens owned by `account`.


### `buyAndBurn(uint256 usdcAmount)`
Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called.




## Events

### `BuyAndBurn(uint256 tokenAmount, uint256 usdcAmount)`
Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero.

### `SwapAndCollect(uint256 tokenAmount, uint256 usdcAmount)`
Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.

### `SwapAndLiquify(uint256 tokenSwapped, uint256 usdcReceived, uint256 tokensIntoLiqudity)`
Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.



# IUniswapV2Factory





## Functions

### `feeTo() → address`
No description


### `feeToSetter() → address`
No description


### `getPair(address tokenA, address tokenB) → address pair`
No description


### `allPairs(uint256) → address pair`
No description


### `allPairsLength() → uint256`
No description


### `createPair(address tokenA, address tokenB) → address pair`
No description


### `setFeeTo(address)`
No description


### `setFeeToSetter(address)`
No description




## Events

### `PairCreated(address token0, address token1, address pair, uint256)`
No description



# IUniswapV2Pair





## Functions

### `name() → string`
No description


### `symbol() → string`
No description


### `decimals() → uint8`
No description


### `totalSupply() → uint256`
No description


### `balanceOf(address owner) → uint256`
No description


### `allowance(address owner, address spender) → uint256`
No description


### `approve(address spender, uint256 value) → bool`
No description


### `transfer(address to, uint256 value) → bool`
No description


### `transferFrom(address from, address to, uint256 value) → bool`
No description


### `DOMAIN_SEPARATOR() → bytes32`
No description


### `PERMIT_TYPEHASH() → bytes32`
No description


### `nonces(address owner) → uint256`
No description


### `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)`
No description


### `MINIMUM_LIQUIDITY() → uint256`
No description


### `factory() → address`
No description


### `token0() → address`
No description


### `token1() → address`
No description


### `getReserves() → uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast`
No description


### `price0CumulativeLast() → uint256`
No description


### `price1CumulativeLast() → uint256`
No description


### `kLast() → uint256`
No description


### `mint(address to) → uint256 liquidity`
No description


### `burn(address to) → uint256 amount0, uint256 amount1`
No description


### `swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)`
No description


### `skim(address to)`
No description


### `sync()`
No description


### `initialize(address, address)`
No description




## Events

### `Approval(address owner, address spender, uint256 value)`
No description

### `Transfer(address from, address to, uint256 value)`
No description

### `Mint(address sender, uint256 amount0, uint256 amount1)`
No description

### `Burn(address sender, uint256 amount0, uint256 amount1, address to)`
No description

### `Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)`
No description

### `Sync(uint112 reserve0, uint112 reserve1)`
No description



# IUniswapV2Router01





## Functions

### `factory() → address`
No description


### `WETH() → address`
No description


### `addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) → uint256 amountA, uint256 amountB, uint256 liquidity`
No description


### `addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) → uint256 amountToken, uint256 amountETH, uint256 liquidity`
No description


### `removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) → uint256 amountA, uint256 amountB`
No description


### `removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) → uint256 amountToken, uint256 amountETH`
No description


### `removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) → uint256 amountA, uint256 amountB`
No description


### `removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) → uint256 amountToken, uint256 amountETH`
No description


### `swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) → uint256[] amounts`
No description


### `swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) → uint256[] amounts`
No description


### `swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) → uint256[] amounts`
No description


### `swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) → uint256[] amounts`
No description


### `swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) → uint256[] amounts`
No description


### `swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) → uint256[] amounts`
No description


### `quote(uint256 amountA, uint256 reserveA, uint256 reserveB) → uint256 amountB`
No description


### `getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) → uint256 amountOut`
No description


### `getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) → uint256 amountIn`
No description


### `getAmountsOut(uint256 amountIn, address[] path) → uint256[] amounts`
No description


### `getAmountsIn(uint256 amountOut, address[] path) → uint256[] amounts`
No description







# IUniswapV2Router02





## Functions

### `removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) → uint256 amountETH`
No description


### `removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) → uint256 amountETH`
No description


### `swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)`
No description


### `swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)`
No description


### `swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)`
No description







# Context





## Functions

### `_msgSender() → address payable`
No description


### `_msgData() → bytes`
No description







# Ownable





## Functions

### `constructor()`
Initializes the contract setting the deployer as the initial owner.


### `owner() → address`
Returns the address of the current owner.


### `renounceOwnership()`
Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.


### `transferOwnership(address newOwner)`
Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.




## Events

### `OwnershipTransferred(address previousOwner, address newOwner)`
No description



# Percent





## Functions

### `encode(uint128 numerator, uint128 denominator) → struct Percent.Percent`
No description


### `mul(struct Percent.Percent self, uint256 value) → uint256`
No description


### `lte(struct Percent.Percent self, struct Percent.Percent other) → bool`
No description







# ReflectToken





## Functions

### `constructor(string name_, string symbol_, uint256 tTotal_)`
No description


### `_calculateReflectionFee(address sender, address recipient, uint256 amount) → uint256`
Amount of tokens to be charged as a reflection fee. Must be in range 0..amount.


### `_calculateAccumulationFee(address sender, address recipient, uint256 amount) → uint256`
Amount of tokens to be charged and stored in this contract. Must be in range 0..amount.


### `name() → string`
No description


### `symbol() → string`
No description


### `decimals() → uint8`
No description


### `totalSupply() → uint256`
No description


### `balanceOf(address account) → uint256`
No description


### `transfer(address recipient, uint256 amount) → bool`
No description


### `allowance(address owner, address spender) → uint256`
No description


### `approve(address spender, uint256 amount) → bool`
No description


### `transferFrom(address sender, address recipient, uint256 amount) → bool`
No description


### `increaseAllowance(address spender, uint256 addedValue) → bool`
No description


### `decreaseAllowance(address spender, uint256 subtractedValue) → bool`
No description


### `getExcluded() → address[]`
No description


### `isExcluded(address account) → bool`
No description


### `totalFees() → uint256`
No description


### `reflect(uint256 tAmount)`
No description


### `reflectionFromToken(uint256 tAmount, bool deductTransferFee) → uint256`
No description


### `tokenFromReflection(uint256 rAmount) → uint256`
No description


### `excludeAccount(address account)`
No description


### `includeAccount(address account)`
No description


### `_burn(address from, uint256 tAmount)`
No description


### `_transfer(address sender, address recipient, uint256 tAmount)`
No description







# SafeERC20





## Functions

### `safeTransfer(address token, address to, uint256 value)`
No description


### `safeTransferFrom(address token, address from, address to, uint256 value)`
No description


### `safeApprove(address token, address to, uint256 value)`
No description







# SafeMath





## Functions

### `add(uint256 a, uint256 b) → uint256`
Returns the addition of two unsigned integers, reverting on
overflow.

Counterpart to Solidity's `+` operator.

Requirements:

- Addition cannot overflow.


### `sub(uint256 a, uint256 b) → uint256`
Returns the subtraction of two unsigned integers, reverting on
overflow (when the result is negative).

Counterpart to Solidity's `-` operator.

Requirements:

- Subtraction cannot overflow.


### `sub(uint256 a, uint256 b, string errorMessage) → uint256`
Returns the subtraction of two unsigned integers, reverting with custom message on
overflow (when the result is negative).

Counterpart to Solidity's `-` operator.

Requirements:

- Subtraction cannot overflow.


### `mul(uint256 a, uint256 b) → uint256`
Returns the multiplication of two unsigned integers, reverting on
overflow.

Counterpart to Solidity's `*` operator.

Requirements:

- Multiplication cannot overflow.


### `div(uint256 a, uint256 b) → uint256`
Returns the integer division of two unsigned integers. Reverts on
division by zero. The result is rounded towards zero.

Counterpart to Solidity's `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero.


### `div(uint256 a, uint256 b, string errorMessage) → uint256`
Returns the integer division of two unsigned integers. Reverts with custom message on
division by zero. The result is rounded towards zero.

Counterpart to Solidity's `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero.







# Set





## Functions

### `add(struct Set.AddressSet set, address value) → bool`
Adds a value to the set.


#### Return Values:
- if the value was successfully added; `false` if the value was already in the set.

### `remove(struct Set.AddressSet set, address value) → bool`
Removes a value from the set.


#### Return Values:
- if value was successfully removed; `false` if the value was not in the set.

### `has(struct Set.AddressSet set, address value) → bool`
Checks if a value is in the set.


#### Return Values:
- if the value is in the set; `false` if the value is not in the set.






# UniswapV2OracleLibrary





## Functions

### `currentBlockTimestamp() → uint32`
No description


### `currentCumulativePrices(address pair) → uint256 price0Cumulative, uint256 price1Cumulative, uint32 blockTimestamp`
No description





