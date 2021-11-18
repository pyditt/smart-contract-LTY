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





