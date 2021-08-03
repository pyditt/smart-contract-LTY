pragma solidity ^0.6.12;

import "./libraries/ReflectToken.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILedgity.sol";
import "./interfaces/IReserve.sol";
import "./interfaces/ILedgityPriceOracle.sol";


contract Ledgity is ILedgity, ReflectToken {
    using SafeMath for uint256;

    uint256 public numTokensToSwap;
    bool public inSwapAndLiquify;
    enum FeeDestination {
        Liquify,
        Collect
    }
    FeeDestination public feeDestination = FeeDestination.Liquify;


    mapping(address => bool) _isDex;
    mapping(address => bool) public isExcludedFromDexFee;
    mapping(address => uint256) public lastTransactionAt;

    IUniswapV2Pair public uniswapV2Pair;
    IReserve public reserve;
    ILedgityPriceOracle public priceOracle;
    uint256 public initialPrice;

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

    function initialize(address reserveAddress, address priceOracleAddress) public onlyOwner {
        reserve = IReserve(reserveAddress);
        isExcludedFromDexFee[address(reserve)] = true;
        priceOracle = ILedgityPriceOracle(priceOracleAddress);
        if (initialPrice == 0) {
            initialPrice = _getPrice();
        }
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

    function burn(uint256 amount) public override returns (bool) {
        // TODO
        revert("Ledgity: not implemented");
        return false;
    }

    function _calculateReflectionFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (_isDex[recipient] && !isExcludedFromDexFee[sender]) {
            return amount.mul(4).div(100);
        }
        return 0;
    }

    function _calculateAccumulationFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (_isDex[sender] && !isExcludedFromDexFee[recipient]) {
            return amount.mul(4).div(100);
        }
        if (_isDex[recipient] && !isExcludedFromDexFee[sender]) {
            if (_getPrice() >= initialPrice.mul(10)) {
                return amount.mul(6).div(100);
            } else {
                return amount.mul(6 + 15).div(100);
            }
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

        if (address(priceOracle) != address(0)) {
            priceOracle.tryUpdate();
        }

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

    function _getPrice() private view returns (uint256) {
        if (address(priceOracle) == address(0)) {
            return 0;
        }
        return priceOracle.consult(address(this), 1e18);
    }
}
