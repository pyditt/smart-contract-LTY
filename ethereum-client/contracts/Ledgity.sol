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
    mapping(address => bool) public isExcludedFromDexFee;
    mapping(address => uint256) public lastTransactionAt;

    // IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Pair public uniswapV2Pair;
    IReserve public reserve;

    constructor() public ReflectToken("Ledgity", "LTY", 2760000000 * 10**18) {
    }

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    function initialize(address routerAddress, address reserveAddress, address usdcAddress) public onlyOwner {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(routerAddress);
        address _uniswapV2PairAddress = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), usdcAddress);
        uniswapV2Pair = IUniswapV2Pair(_uniswapV2PairAddress);
        // uniswapV2Router = _uniswapV2Router;
        setDex(address(uniswapV2Pair), true);

        reserve = IReserve(reserveAddress);
        isExcludedFromDexFee[owner()] = true;
        isExcludedFromDexFee[address(this)] = true;
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
            return amount.mul(6).div(100);
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
        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToLiquidity;
        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            sender != address(uniswapV2Pair)
        ) {
            _swapAndLiquifyOrCollect(contractTokenBalance);
        }
    }
}
