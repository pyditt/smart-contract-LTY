pragma solidity ^0.6.12;

import "./libraries/SafeERC20.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILedgity.sol";
import "./interfaces/ILedgityRouter.sol";

// SPDX-License-Identifier: Unlicensed
contract LedgityRouter is ILedgityRouter {
    IUniswapV2Factory public immutable factory;
    IUniswapV2Router02 public immutable uniswapRouter;

    /**
     * @dev Initializes the contract setting up the router addresss.
     */
    constructor(address _router) public {
        IUniswapV2Router02 _uniswapRouter = IUniswapV2Router02(_router);
        factory = IUniswapV2Factory(_uniswapRouter.factory());
        uniswapRouter = _uniswapRouter;
    }

    /**
     * @dev Adds liquidity bypassing fee.
     * @param tokenA A pool token.
     * @param tokenB pool token.
     * @param amountADesired The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).
     * @param amountBDesired The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates).
     * @param amountAMin Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.
     * @param amountBMin Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired.
     * @param to Recipient of the liquidity tokens.
     * @param deadline Unix timestamp after which the transaction will revert.
     * @return amountA The amount of tokenA received.
     * @return amountB The amount of tokenB received.
     */
    function addLiquidityBypassingFee(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external override returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        SafeERC20.safeTransferFrom(tokenA, msg.sender, address(this), amountADesired);
        SafeERC20.safeTransferFrom(tokenB, msg.sender, address(this), amountBDesired);
        SafeERC20.safeApprove(tokenA, address(uniswapRouter), amountADesired);
        SafeERC20.safeApprove(tokenB, address(uniswapRouter), amountBDesired);
        (amountA, amountB, liquidity) = uniswapRouter.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline);
        _refund(tokenA, msg.sender);
        _refund(tokenB, msg.sender);
    }

    /**
     * @dev Removes liquidity bypassing fee.
     * @param tokenA A pool token.
     * @param tokenB pool token.
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert.
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert.
     * @param to Recipient of the liquidity tokens.
     * @param deadline Unix timestamp after which the transaction will revert.
     * @return amountA The amount of tokenA received.
     * @return amountB The amount of tokenB received.
     */
    function removeLiquidityBypassingFee(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external override returns (uint256 amountA, uint256 amountB) {
        address pair = factory.getPair(tokenA, tokenB);
        SafeERC20.safeTransferFrom(pair, msg.sender, address(this), liquidity);
        SafeERC20.safeApprove(pair, address(uniswapRouter), liquidity);
        (amountA, amountB) = uniswapRouter.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, address(this), deadline);
        _refund(tokenA, to);
        _refund(tokenB, to);
    }

    /**
     * @dev Transfers `msg.sender` entire balance to `to`.
     * @param token A pool token.
     * @param to A recipient.
     */
    function _refund(address token, address to) private {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance != 0) {
            SafeERC20.safeTransfer(token, to, balance);
        }
    }
}
