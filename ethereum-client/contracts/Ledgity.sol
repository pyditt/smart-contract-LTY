pragma solidity ^0.6.12;

import "./libraries/ReflectToken.sol";
import "./libraries/Percent.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILedgity.sol";
import "./interfaces/IReserve.sol";


contract Ledgity is ILedgity, ReflectToken {
    using SafeMath for uint256;
    using Percent for Percent.Percent;

    uint256 public numTokensToSwap;
    bool public inSwapAndLiquify;
    enum FeeDestination {
        Liquify,
        Collect
    }
    FeeDestination public feeDestination = FeeDestination.Liquify;
    Percent.Percent public sellAccumulationFee = Percent.encode(6, 100);
    Percent.Percent public initialSellAccumulationFee = sellAccumulationFee;
    Percent.Percent public sellAtSmallPriceAccumulationFee = Percent.encode(6 + 15, 100);
    Percent.Percent public initialSellAtSmallPriceAccumulationFee = sellAtSmallPriceAccumulationFee;
    Percent.Percent public sellReflectionFee = Percent.encode(4, 100);
    Percent.Percent public initialSellReflectionFee = sellReflectionFee;
    Percent.Percent public buyAccumulationFee = Percent.encode(4, 100);
    Percent.Percent public initialBuyAccumulationFee = buyAccumulationFee;


    mapping(address => bool) _isDex;
    mapping(address => bool) public isExcludedFromDexFee;
    mapping(address => uint256) public lastTransactionAt;

    IUniswapV2Pair public uniswapV2Pair;
    IReserve public reserve;

    constructor(address routerAddress, address usdcAddress) public ReflectToken("Ledgity", "LTY", 2760000000 * 10**18) {
        numTokensToSwap = totalSupply().mul(15).div(10000);
        isExcludedFromDexFee[owner()] = true;
        isExcludedFromDexFee[address(this)] = true;

        uniswapV2Pair = IUniswapV2Pair(
            IUniswapV2Factory(IUniswapV2Router02(routerAddress).factory())
                .createPair(address(this), usdcAddress)
        );
        setDex(address(uniswapV2Pair), true);
    }

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    function initialize(address reserveAddress) public onlyOwner {
        reserve = IReserve(reserveAddress);
        isExcludedFromDexFee[address(reserve)] = true;
    }

    function setDex(address target, bool isDex) public onlyOwner {
        _isDex[target] = isDex;
    }

    function setFeeDestination(FeeDestination fd) public onlyOwner {
        feeDestination = fd;
    }

    function setIsExcludedFromDexFee(address account, bool isExcluded) public onlyOwner {
        isExcludedFromDexFee[account] = isExcluded;
    }

    function setNumTokensToSwap(uint256 _numTokensToSwap) public onlyOwner {
        numTokensToSwap = _numTokensToSwap;
    }

    function setSellAccumulationFee(uint128 numerator, uint128 denominator) public onlyOwner {
        sellAccumulationFee = Percent.encode(numerator, denominator);
        require(sellAccumulationFee.lte(initialSellAccumulationFee), "Ledgity: fee too high");
    }

    function setSellAtSmallPriceAccumulationFee(uint128 numerator, uint128 denominator) public onlyOwner {
        sellAtSmallPriceAccumulationFee = Percent.encode(numerator, denominator);
        require(sellAtSmallPriceAccumulationFee.lte(initialSellAtSmallPriceAccumulationFee), "Ledgity: fee too high");
    }

    function setSellReflectionFee(uint128 numerator, uint128 denominator) public onlyOwner {
        sellReflectionFee = Percent.encode(numerator, denominator);
        require(sellReflectionFee.lte(initialSellReflectionFee), "Ledgity: fee too high");
    }

    function setBuyAccumulationFee(uint128 numerator, uint128 denominator) public onlyOwner {
        buyAccumulationFee = Percent.encode(numerator, denominator);
        require(buyAccumulationFee.lte(initialBuyAccumulationFee), "Ledgity: fee too high");
    }

    function burn(uint256 amount) public override returns (bool) {
        // TODO
        revert("Ledgity: not implemented");
        return false;
    }

    function _calculateReflectionFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (_isDex[recipient] && !isExcludedFromDexFee[sender]) {
            return sellReflectionFee.mul(amount);
        }
        return 0;
    }

    function _calculateAccumulationFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (_isDex[sender] && !isExcludedFromDexFee[recipient]) {
            return buyAccumulationFee.mul(amount);
        }
        if (_isDex[recipient] && !isExcludedFromDexFee[sender]) {
            return sellAccumulationFee.mul(amount);
        }
        return 0;
    }

    function _swapAndLiquifyOrCollect(uint256 contractTokenBalance) private lockTheSwap {
        _transfer(address(this), address(reserve), contractTokenBalance);
        if (feeDestination == FeeDestination.Liquify) {
            reserve.swapAndLiquify(contractTokenBalance);
        } else if (feeDestination == FeeDestination.Collect) {
            reserve.swapAndCollect(contractTokenBalance);
        } else {
            revert("Ledgity: invalid feeDestination");
        }
    }

    function _transfer(address sender, address recipient, uint256 amount) internal override {
        // TODO: generalize this
        require(
            sender == owner() || sender == address(uniswapV2Pair) || sender == address(reserve) || lastTransactionAt[sender] < block.timestamp.sub(15 minutes),
            "Ledgity: only one transaction per 15 minutes"
        );
        lastTransactionAt[sender] = block.timestamp;
        super._transfer(sender, recipient, amount);

        uint256 contractTokenBalance = balanceOf(address(this));
        // TODO: uncomment
        // if(contractTokenBalance >= maxTokenTx())
        // {
        //     contractTokenBalance = maxTokenTx();
        // }
        bool overMinTokenBalance = contractTokenBalance >= numTokensToSwap;
        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            sender != address(uniswapV2Pair)
        ) {
            _swapAndLiquifyOrCollect(contractTokenBalance);
        }
    }
}
