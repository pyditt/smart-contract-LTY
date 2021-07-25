pragma solidity ^0.6.12;

import "./libraries/ReflectToken.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILedgity.sol";
import "./interfaces/IReserve.sol";


contract Ledgity is ILedgity, ReflectToken {
    using SafeMath for uint256;

    // TODO: make this 10**18
    uint256 public numTokensSellToAddToLiquidity = 5000 * 10**18;

    bool public inSwapAndLiquify;
    enum FeeDestination {
        Liquify,
        Collect
    }
    FeeDestination public feeDestination = FeeDestination.Liquify;


    mapping(address => bool) _isDex;

    // IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Pair public uniswapV2Pair;
    IReserve public reserve;

    constructor() public ReflectToken("Ledgity", "LTY") {
    }

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    function initialize(address routerAddress, address reserveAddress) public onlyOwner {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(routerAddress);
        address _uniswapV2PairAddress = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        uniswapV2Pair = IUniswapV2Pair(_uniswapV2PairAddress);
        // uniswapV2Router = _uniswapV2Router;
        setDex(address(uniswapV2Pair), true);

        reserve = IReserve(reserveAddress);
    }

    function setDex(address target, bool isDex) public onlyOwner {
        _isDex[target] = isDex;
    }

    function burn(uint256 amount) public override returns (bool) {
        // TODO
        revert("Ledgity: not implemented");
        return false;
    }

    function _calculateReflectionFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (_isDex[recipient]) {
            return amount.mul(4).div(100);
        }
        return 0;
    }

    function _calculateAccumulationFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (_isDex[sender]) {
            return amount.mul(4).div(100);
        }
        if (_isDex[recipient]) {
            return amount.mul(6).div(100);
        }
        return 0;
    }

    function _swapAndLiquifyOrCollect(uint256 contractTokenBalance) private lockTheSwap {
        require(transfer(address(reserve), contractTokenBalance), "Ledgity: transfer failed");
        if (feeDestination == FeeDestination.Liquify) {
            reserve.swapAndLiquify(contractTokenBalance);
        } else if (feeDestination == FeeDestination.Collect) {
            reserve.swapAndCollect(contractTokenBalance);
        } else {
            revert("Ledgity: invalid feeDestination");
        }
    }

    function _transfer(address sender, address recipient, uint256 amount) internal override {
        uint256 contractTokenBalance = balanceOf(address(this));
        // TODO: uncomment
        // if(contractTokenBalance >= maxTokenTx())
        // {
        //     contractTokenBalance = maxTokenTx();
        // }
        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToLiquidity;
        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            sender != address(uniswapV2Pair)
        ) {
            _swapAndLiquifyOrCollect(contractTokenBalance);
        }

        super._transfer(sender, recipient, amount);
    }
}
