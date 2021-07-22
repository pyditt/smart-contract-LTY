pragma solidity ^0.6.12;

import "./libraries/Ownable.sol";
import "./libraries/SafeMath.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILedgity.sol";
import "./interfaces/IReserve.sol";


contract Reserve is IReserve, Ownable {
    using SafeMath for uint256;

    IUniswapV2Router02 public immutable uniswapV2Router;
    ILedgity public immutable token;
    IERC20 public immutable usdc;

    modifier onlyToken {
        require(msg.sender == address(token), "Reserve: caller is not the token");
        _;
    }

    constructor(address uniswapRouter, address TOKEN, address USDC) public {
        uniswapV2Router = IUniswapV2Router02(uniswapRouter);
        token = ILedgity(TOKEN);
        usdc = IERC20(USDC);
    }

    // TODO: remove this
    function getBalances() view public returns(uint256 LTYbalance, uint256 USDCbalance){
        LTYbalance = token.balanceOf(address(this));
        USDCbalance = usdc.balanceOf(address(this));
    }

    function buyAndBurn(uint256 usdcAmount) public override onlyOwner {
        address[] memory path = new address[](2);
        path[0] = address(usdc);
        path[1] = address(token);
        uint256 tokenBalanceBefore = token.balanceOf(address(this));
        usdc.approve(address(uniswapV2Router), usdcAmount);
        uniswapV2Router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            usdcAmount,
            0, // accept any amount of token
            path,
            address(this),
            block.timestamp
        );
        uint256 tokensSwapped = token.balanceOf(address(this)).sub(tokenBalanceBefore);
        require(token.burn(tokensSwapped), "Reserve: burn failed");
        emit BuyAndBurn(tokensSwapped, usdcAmount);
    }

    function swapAndCollect(uint256 tokenAmount) external override onlyToken {
        uint256 usdcReceived = _swapTokensForUSDC(tokenAmount);
        emit SwapAndCollect(tokenAmount, usdcReceived);
    }

    function swapAndLiquify(uint256 tokenAmount) external override onlyToken {
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance < tokenAmount.mul(2)) {
            tokenAmount = tokenBalance.div(2);
        }

        uint256 usdcReceived = _swapTokensForUSDC(tokenAmount);
        token.approve(address(uniswapV2Router), tokenAmount);
        usdc.approve(address(uniswapV2Router), usdcReceived);
        uniswapV2Router.addLiquidity(
            address(token),
            address(usdc),
            tokenAmount,
            usdcReceived,
            0,
            0,
            // TODO: lock LP tokens for 5 years
            owner(),
            block.timestamp
        );
        emit SwapAndLiquify(tokenAmount, usdcReceived, tokenAmount);
    }

    function _swapTokensForUSDC(uint256 tokenAmount) private returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = address(token);
        path[1] = address(usdc);
        uint256 usdcBalanceBefore = usdc.balanceOf(address(this));
        token.approve(address(uniswapV2Router), tokenAmount);
        uniswapV2Router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of USDC
            path,
            address(this),
            block.timestamp
        );
        uint256 usdcSwapped = usdc.balanceOf(address(this)).sub(usdcBalanceBefore);
        return usdcSwapped;
    }
}
