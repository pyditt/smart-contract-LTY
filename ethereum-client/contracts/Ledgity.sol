pragma solidity ^0.6.12;

import "./libraries/ReflectToken.sol";
import "./libraries/Percent.sol";
import "./libraries/Set.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILedgity.sol";
import "./interfaces/IReserve.sol";
import "./interfaces/ILedgityPriceOracle.sol";

// SPDX-License-Identifier: Unlicensed
contract Ledgity is ILedgity, ReflectToken {
    using SafeMath for uint256;
    using Percent for Percent.Percent;
    using Set for Set.AddressSet;

    uint256 public constant initialTotalSupply = 2760000000 * 10**18;

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
    Set.AddressSet private _dexes;
    Set.AddressSet private _excludedFromDexFee;

    Set.AddressSet private _excludedFromLimits;
    mapping(address => uint256) public soldPerPeriod;
    mapping(address => uint256) public firstSellAt;
    Percent.Percent public maxTransactionSizePercent = Percent.encode(5, 10000);

    IUniswapV2Pair public uniswapV2Pair;
    IReserve public reserve;
    ILedgityPriceOracle public priceOracle;
    uint256 public initialPrice;
    
     /**
     * @dev Initializes the contract excluding itself and the owner from dex fee and limits.
     */
    constructor() public ReflectToken("Ledgity", "LTY", initialTotalSupply) {
        numTokensToSwap = totalSupply().mul(15).div(10000);
        setIsExcludedFromDexFee(owner(), true);
        setIsExcludedFromDexFee(address(this), true);
        setIsExcludedFromLimits(owner(), true);
        setIsExcludedFromLimits(address(this), true);
        excludeAccount(address(this));
    }

    /**
     * @dev Blocks the possibility of exchange for the time of exchange and adding liquidity.
     */
    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    /**
     * @dev Sets reserve address. Also, excludes it from dex fee and limits.
     * Can be called only by the owner.
     */
    function initializeReserve(address reserveAddress) external onlyOwner {
        reserve = IReserve(reserveAddress);
        setIsExcludedFromDexFee(address(reserve), true);
        setIsExcludedFromLimits(address(reserve), true);
        excludeAccount(address(reserve));
        uniswapV2Pair = reserve.uniswapV2Pair();
        setDex(address(uniswapV2Pair), true);
    }

    /**
     * @dev Sets price oracle address. Can be called only by the owner.
     */
    function initializePriceOracle(address priceOracleAddress) external onlyOwner {
        priceOracle = ILedgityPriceOracle(priceOracleAddress);
        if (initialPrice == 0) {
            initialPrice = _getPrice();
        }
    }

    /**
     * @dev Returns total amount of burnt tokens.
     */
    function totalBurn() external view returns (uint256) {
        return initialTotalSupply - totalSupply();
    }

    /**
     * @dev Adds/removes `target` to the dexes list. Can be called only by the owner.
     * Can be called only by the owner.
     * @param target Address of dex.
     * @param dex Add/remove `target` from dexes list.
     */
    function setDex(address target, bool dex) public onlyOwner {
        if (dex) {
            _dexes.add(target);
            if (!isExcluded(target)) {
                excludeAccount(target);
            }
        } else {
            _dexes.remove(target);
            if (isExcluded(target)) {
                includeAccount(target);
            }
        }
    }

    /**
     * @dev Sets fee destination. Can be called only by the owner.
     * @param fd An enum `FeeDestination`. Can be `Liquify` or `Collect`.
     */
    function setFeeDestination(FeeDestination fd) public onlyOwner {
        feeDestination = fd;
    }

    /**
     * @dev Includes/Excludes `account` address from dex fee depending on `isExcluded`.
     * Can be called only by the owner.
     * @param account Address of account to be excluded/NOT excluded from dex fee.
     * @param isExcluded Include/Exclude `account` from dex fee.
     */
    function setIsExcludedFromDexFee(address account, bool isExcluded) public onlyOwner {
        if (isExcluded) {
            _excludedFromDexFee.add(account);
        } else {
            _excludedFromDexFee.remove(account);
        }
    }

    /**
    * @dev Includes/Excludes `account` address from limits depending on `isExcluded`.
    * Can be called only by the owner.
    * @param account Address of account to be excluded/NOT excluded from limits.
    * @param isExcluded Include/Exclude `account` from limits.
    */
    function setIsExcludedFromLimits(address account, bool isExcluded) public onlyOwner {
        if (isExcluded) {
            _excludedFromLimits.add(account);
        } else {
            _excludedFromLimits.remove(account);
        }
    }

     /**
     * @dev Sets number of tokens to swap. Can be called only by the owner.
     * @param _numTokensToSwap Amount of tokens to swap.
     */
    function setNumTokensToSwap(uint256 _numTokensToSwap) external onlyOwner {
        numTokensToSwap = _numTokensToSwap;
    }

    /**
     * @dev Sets maxiumum transaction size which value is represented as a fraction.
     * Can be called only by the owner.
     * @param numerator Numerator of a maximum transaction size value.
     * @param denominator Denominator of a maximum transaction size value.
     */
    function setMaxTransactionSizePercent(uint128 numerator, uint128 denominator) external onlyOwner {
        maxTransactionSizePercent = Percent.encode(numerator, denominator);
    }

    /**
     * @dev Sets sell accumulation fee which value is represented as a fraction.
     * Can be called only by the owner.
     * @param numerator Numerator of a sell accumulation fee fractional value.
     * @param denominator Denominator of a sell accumulation fee fractional value.
     */
    function setSellAccumulationFee(uint128 numerator, uint128 denominator) external onlyOwner {
        sellAccumulationFee = Percent.encode(numerator, denominator);
        require(sellAccumulationFee.lte(initialSellAccumulationFee), "Ledgity: fee too high");
    }

    /**
     * @dev Sets sell accumulation fee which value is represented as a fraction.
     * Can be called only by the owner.
     * @param numerator Numerator of a sell accumulation fee fractional value.
     * @param denominator Denominator of a sell accumulation fee fractional value.
     */
    function setSellAtSmallPriceAccumulationFee(uint128 numerator, uint128 denominator) external onlyOwner {
        sellAtSmallPriceAccumulationFee = Percent.encode(numerator, denominator);
        require(sellAtSmallPriceAccumulationFee.lte(initialSellAtSmallPriceAccumulationFee), "Ledgity: fee too high");
    }

     /**
     * @dev Sets sell reflection fee which value is represented as a fraction.
     * Can be called only by the owner.
     * @param numerator Numerator of a sell reflection fee fractional value.
     * @param denominator Denominator of a sell reflection fee fractional value.
     */
    function setSellReflectionFee(uint128 numerator, uint128 denominator) external onlyOwner {
        sellReflectionFee = Percent.encode(numerator, denominator);
        require(sellReflectionFee.lte(initialSellReflectionFee), "Ledgity: fee too high");
    }

    /**
     * @dev Sets buy accumulation fee which value is represented as a fraction.
     * Can be called only by the owner.
     * @param numerator Numerator of a buy accumulation fee fractional value.
     * @param denominator Denominator of a buy accumulation fee fractional value.
     */
    function setBuyAccumulationFee(uint128 numerator, uint128 denominator) external onlyOwner {
        buyAccumulationFee = Percent.encode(numerator, denominator);
        require(buyAccumulationFee.lte(initialBuyAccumulationFee), "Ledgity: fee too high");
    }

     /**
     * @dev Burns `amount` tokens.
     * @return true if burn succeded else `false`.
     */
    function burn(uint256 amount) external override returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }

    /**
     * @dev Returns an array of dexes addresses.
     */
    function getDexes() external view returns (address[] memory) {
        return _dexes.values;
    }

    /**
     * @dev Returns an array of addresses excluded from dex fee.
     */
    function getExcludedFromDexFee() external view returns (address[] memory) {
        return _excludedFromDexFee.values;
    }

    /**
     * @dev Returns an array of addresses excluded from limits.
     */
    function getExcludedFromLimits() external view returns (address[] memory) {
        return _excludedFromLimits.values;
    }

    /**
     * @dev Checks if `account` is dex.
     * @param account Address that is being checked whether it's dex.
     * @return true if `account` is in the dexes list else `false`
     */
    function isDex(address account) public view returns (bool) {
        return _dexes.has(account);
    }

    /**
     * @dev Checks if `account` is excluded from dex fee.
     * @param account Address that is being checked where it's excluded from dex fee.
     * @return true if `account` is excluded from dex fee else `false`.
     */
    function isExcludedFromDexFee(address account) public view returns (bool) {
        return _excludedFromDexFee.has(account);
    }

    /**
     * @dev Checks if `account` is excluded from limits.
     * @param account Address that is being checked where it's excluded from limits.
     * @return true if `account` is excluded from limits else `false`.
     */
    function isExcludedFromLimits(address account) public view returns (bool) {
        return _excludedFromLimits.has(account);
    }

    /**
     * @dev Computes reflection fee.
     * @param sender Address of the sender.
     * @param recipient Address of the recipient.
     * @param amount Amount of tokens.
     */
    function _calculateReflectionFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (isDex(recipient) && !isExcludedFromDexFee(sender)) {
            return sellReflectionFee.mul(amount);
        }
        return 0;
    }

     /**
     * @dev Computes accumulation fee.
     * @param sender Address of the sender.
     * @param recipient Address of the recipient.
     * @param amount Amount of tokens.
     */
    function _calculateAccumulationFee(address sender, address recipient, uint256 amount) internal override view returns (uint256) {
        if (isDex(sender) && !isExcludedFromDexFee(recipient)) {
            return buyAccumulationFee.mul(amount);
        }
        if (isDex(recipient) && !isExcludedFromDexFee(sender)) {
            if (_getPrice() >= initialPrice.mul(10)) {
                return sellAccumulationFee.mul(amount);
            } else {
                return sellAtSmallPriceAccumulationFee.mul(amount);
            }
        }
        return 0;
    }

    /**
     * @dev Depending on the fee Destination flag,
     * it calls swapAndLiquify or swapAndCollect in Reserve,
     * with token amount.
     */
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

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient`.
     * Control the limit of tokens sold on dex.
     * When numTokensToSwap is reached, it executes {_swapandliquifyorcollect}.
     * See {ReflectToken}.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        if (!isExcludedFromLimits(sender) && isDex(recipient)) {
            uint256 _sold;
            if (block.timestamp.sub(firstSellAt[sender]) > 10 minutes) {
                // _sold = 0;  // is already 0
                firstSellAt[sender] = block.timestamp;
            } else {
                _sold = soldPerPeriod[sender];
            }
            _sold = _sold.add(amount);
            require(_sold <= maxTransactionSize());
            soldPerPeriod[sender] = _sold;
        }

        if (address(priceOracle) != address(0)) {
            priceOracle.tryUpdate();
        }

        uint256 contractTokenBalance = balanceOf(address(this));
        uint256 _numTokensToSwap = numTokensToSwap;
        if (
            contractTokenBalance >= _numTokensToSwap &&
            !inSwapAndLiquify &&
            sender != address(uniswapV2Pair)
        ) {
            if (contractTokenBalance > _numTokensToSwap) {
                contractTokenBalance = _numTokensToSwap;
            }
            _swapAndLiquifyOrCollect(contractTokenBalance);
        }

        super._transfer(sender, recipient, amount);
    }

     /**
     * @dev Returns the price of tokens.
     * @return 0 if price oracle address is NOT setted up via `initializePriceOracle` function.
     */
    function _getPrice() private view returns (uint256) {
        if (address(priceOracle) == address(0)) {
            return 0;
        }
        return priceOracle.consult(address(this), 1e18);
    }
    
    /**
     * @dev Returns max transaction size.
     */
    function maxTransactionSize() public view returns (uint256) {
        return maxTransactionSizePercent.mul(totalSupply());
    }
}
