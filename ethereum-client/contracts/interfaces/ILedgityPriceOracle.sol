pragma solidity ^0.6.12;

interface ILedgityPriceOracle {
    /**
     * @dev Update avarage price.
     */
    function update() external;

    /**
     * @dev Returns the price of tokens.
     */
    function consult(address token, uint amountIn) external view returns (uint amountOut);
}
