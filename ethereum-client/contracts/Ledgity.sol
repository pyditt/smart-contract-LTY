pragma solidity ^0.6.12;

import "./libraries/Address.sol";
import "./libraries/Context.sol";
import "./libraries/Ownable.sol";
import "./libraries/SafeMath.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";


contract Ledgity is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;
    mapping (address => uint256) private _TxTime;
    mapping (address => bool) private _dexM;
    address[] private _dex;

    mapping (address => bool) private _isExcluded;
    address[] private _excluded;

    uint256 private constant MAX = ~uint256(0);

    // TODO replace expressions of multiplication and reduction of powers
    // TODO переменные которые являются константными сделать публичными и без подчеркиваний(для публичнык нет _), упорядочить структуру переменных
    // 1 library using, 2.Структуры, 3. паблик переменные, 4. приват 5.сложные структуры, массивы (паблик)
    // 6 сложные структуры, массивы (приват), 7. Паблик view 8. Приват view, 9. Events, 10. Конструктор, 11.
    // Внутри функций не дорлжно быть пустых строк
    // Require message указывать в формате "Ledgity: mesdss hkfkdhd dsf" не более 5 слов
    // Внутри функций убрать комментарии

    uint256 private  _tTotal = 10e26;
    uint256 private constant _tAllTotal = 100000000000 * 10**6 * 10**9;
    uint256 private _rTotal = (MAX - (MAX % _tTotal));
    string private _name = 'Ledgity';
    string private _symbol = 'LTY';
    uint8 private _decimals = 9;
    uint256 public allowTradeAt;

    uint256 private _tBurnedTotal;
    uint256 private _rBurnedTotal;
    uint256 private _tFeeTotal;

    uint256 _price = 7;
    uint256 constant _startPrice = 1;

    uint256 private numTokensSellToAddToLiquidity = 5000 * 10**9;

    uint256 public _taxFee = 33;
    uint256 private _previousTaxFee = _taxFee;

    uint256 public _liquidityFee = 33;
    uint256 private _previousLiquidityFee = _liquidityFee;

    bool _takeFee = false;

    IUniswapV2Router02 public immutable uniswapV2Router;
    IUniswapV2Pair public immutable uniswapV2Pair;
    // TODO: remove this
    address public immutable uniswapV2PairAddress;
    bool inSwapAndLiquify;

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    constructor(address uniswapRouter) public {
        _rOwned[_msgSender()] = _rTotal;
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(uniswapRouter);
        address _uniswapV2PairAddress = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        uniswapV2Pair = IUniswapV2Pair(_uniswapV2PairAddress);

        excludeAccount(_msgSender());
        excludeAccount(address(this));

        uniswapV2Router = _uniswapV2Router;
        uniswapV2PairAddress = _uniswapV2PairAddress;

        emit Transfer(address(0), _msgSender(), _tTotal);
    }

    receive() external payable {}

    function name() public view returns (string memory) {
        return _name;
    }

     function rAmnt() public view returns (uint256) {
        return _rOwned[msg.sender];
    }

    function tAmnt() public view returns (uint256) {
        return _tOwned[msg.sender];
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function allSupply() public pure returns (uint256) {
        return _tAllTotal;
    }

    function totalFee() public view returns (uint256) {
        return _tFeeTotal;
    }

     function totalBurn() public view returns (uint256) {
        return _tBurnedTotal;
    }

    function maxTokenTx() public view returns (uint256) {
        return _tTotal.div(1000);
    }

    function getStartPrice() public pure returns (uint256) {
        return _startPrice;
    }

    function getPrice() public view returns (uint256) {
        return _price;
    }

    function isDex(address dexAddress) public view returns (bool) {
        return _dexM[dexAddress];
    }

    function getExcluded() public view returns (address[] memory) {
        return _excluded;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function isExcluded(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function reflect(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Excluded addresses cannot call this function");
        (uint256 rAmount,,,,) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }
    // TODO
    // можно объявить возвращаему переменную "function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256 rTransferAmount)"
    // (, rTransferAmount,,,) = _getValues(tAmount);
    // В остальных методах сделать нечто подобное
    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,) = _getValues(tAmount);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,,) = _getValues(tAmount);
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }

    // TODO return true
    function excludeAccount(address account) public onlyOwner() {
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function setDex(address dex) public onlyOwner () {
        _dex.push(dex);
        _dexM[dex] = true;
        excludeAccount(dex);
    }

    // TODO можно вместо переборов использовать попробовать EnumerableSet
    function includeAccount(address account) external onlyOwner() {
        require(_isExcluded[account], "Account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }
    // TODO return true

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    // TODO return true

    function enableFairLaunch() external onlyOwner() {
        require(msg.sender != address(0), "ERC20: approve from the zero address");
        allowTradeAt = block.timestamp;
    }

    function swapTokensForEth(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }
    //function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);

    function getPairValues() public view returns(uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) {
        (reserve0, reserve1, blockTimestampLast) = uniswapV2Pair.getReserves();
        //return (reserve0, reserve1, blockTimestampLast);
    }

    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        uint256 half = contractTokenBalance.div(2);
        uint256 otherHalf = contractTokenBalance.sub(half);
        uint256 initialBalance = address(this).balance;
        swapTokensForEth(half);
        uint256 newBalance = address(this).balance.sub(initialBalance);
        addLiquidity(otherHalf, newBalance);
        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function _takeLiquidity(uint256 tFee, uint256 rFee) private {
        uint256 tThird = tFee.div(3);
        uint256 rThird = rFee.div(3);
        burnFee(tThird, rThird);
        _rOwned[address(this)] = _rOwned[address(this)].add(rThird);
    }

    function removeAllFee() private {
        if(_taxFee == 0 && _liquidityFee == 0) return;

        _previousTaxFee = _taxFee;
        _previousLiquidityFee = _liquidityFee;

        _taxFee = 0;
        _liquidityFee = 0;

        _takeFee = false;
    }

    function restoreAllFee() private {
        _taxFee = _previousTaxFee;
        _liquidityFee = _previousLiquidityFee;

        _takeFee = true;
    }

    function _transfer(address sender, address recipient, uint256 amount) private {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(_TxTime[sender] < block.timestamp.sub(15 seconds) || sender == owner(), "Only ONE transaction per 15 seconds");

        // if (block.timestamp < allowTradeAt + 24 hours && amount >= 10**6 * 10**9 ) {
        //      revert("You cannot transfer more than 1 billion now");  }

        uint256 contractTokenBalance = balanceOf(address(this));
        if(contractTokenBalance >= maxTokenTx())
        {
            contractTokenBalance = maxTokenTx();
        }
        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToLiquidity;

        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            sender != uniswapV2PairAddress
        ) {
            swapAndLiquify(contractTokenBalance);
        }

        //indicates if fee should be deducted from transfer
        bool takeFee = false;

        //if any account belongs to _isExcludedFromFee account then remove the fee
        if( _dexM[recipient] ){
            (uint256 reserve0,,) = uniswapV2Pair.getReserves();
            if (reserve0 > 100000*10**9) {
                require(amount < reserve0.div(100), "Transfer amount must be less than 0.1% of totalSupply");
            }
            takeFee = true;
        }

        //transfer amount, it will take tax, burn, liquidity fee
        _tokenTransfer(sender,recipient,amount,takeFee);
    }

    function _tokenTransfer(address sender, address recipient, uint256 amount,bool takeFee) private {
        if(!takeFee)
            removeAllFee();

        if (sender == owner() || recipient == owner()) {
            _transferOwner(sender,recipient,amount);
        } else if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount);
        } else {
            _transferStandard(sender, recipient, amount);
        }
        _TxTime[sender] = block.timestamp;

        if(!takeFee)
            restoreAllFee();
    }

     function _transferOwner( address sender, address recipient, uint256 tAmount) private {
        uint256 currentRate =  _getRate();
        uint256 rAmount = tAmount.mul(currentRate);

        if(_isExcluded[sender]) {
            _tOwned[sender] = _tOwned[sender].sub(tAmount);
        } else
            _rOwned[sender] = _rOwned[sender].sub(rAmount);

        _rOwned[recipient] = _rOwned[recipient].add(rAmount);
        if(_isExcluded[recipient])
            _tOwned[recipient] = _tOwned[recipient].add(tAmount);

        emit Transfer(sender, recipient, rAmount);
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFee, rFee);
        _reflectFee(rFee.div(3), tFee.div(3));
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFee, rFee);
        _reflectFee(rFee.div(3), tFee.div(3));
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFee, rFee);
        _reflectFee(rFee.div(3), tFee.div(3));
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFee, rFee);
        _reflectFee(rFee.div(3), tFee.div(3));
        emit Transfer(sender, recipient, tTransferAmount);
    }



    function calculateTFee (uint256 amount) public view returns(uint256 fee) {
        // [1] - >50% and price
        if(_tTotal >= _tAllTotal.mul(50).div(100)) {
            if(_price < _startPrice.mul(5)) {
                fee = amount.mul(50).div(100);
                return (fee);
            }
            if(_price > _startPrice.mul(5) && _price < _startPrice.mul(10)) {
                fee = amount.mul(30).div(100);
                return (fee);
            }
            fee = amount.mul(10).div(100);
            return (fee);
        }
        // [2] -  <50% and without price
        if(_tTotal < _tAllTotal.mul(50).div(100)) {
           if(_tTotal > _tAllTotal.mul(30).div(100)) {
                fee = amount.mul(5).div(100);
                return (fee);
           }
          if(_tTotal > _tAllTotal.mul(25).div(100)) {
                fee = amount.mul(2).div(100);
                return (fee);
           }
            fee = 0;
            return (fee);
        }
    }


    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }

    function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, uint256, uint256) {
        (uint256 tTransferAmount, uint256 fee) = _getTValues(tAmount);
        uint256 currentRate =  _getRate();
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(tAmount, fee, currentRate);
        return (rAmount, rTransferAmount, rFee, tTransferAmount, fee);
    }

    function _getTValues(uint256 tAmount) private view returns (uint256 tTransferAmount, uint256 tFee) {
        if(_takeFee) {
            tFee = calculateTFee(tAmount);
        } else {
            tFee = 0;
        }
        tTransferAmount = tAmount.sub(tFee);
        return (tTransferAmount, tFee);
    }

    function _getRValues(uint256 tAmount, uint256 tFee, uint256 currentRate) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = tAmount.mul(currentRate);
        uint256 rFee = tFee.mul(currentRate);
        uint256 rTransferAmount = rAmount.sub(rFee);
        return (rAmount, rTransferAmount, rFee);
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply.sub(_rOwned[_excluded[i]]);
            tSupply = tSupply.sub(_tOwned[_excluded[i]]);
        }
        if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }

    function getLiqValue() public view returns(uint256) {
        return _tOwned[address(this)];
    }

    function burnFee(uint256 tAmount, uint256 rAmount) internal returns(bool){
        _rTotal = _rTotal.sub(rAmount);
        _tTotal = _tTotal.sub(tAmount);
        _tBurnedTotal = _tBurnedTotal.add(tAmount);
        return true;
    }

    function burn(uint256 tAmount) public onlyOwner returns(bool){
        uint256 currentRate =  _getRate();
        uint256 rAmount = tAmount.mul(currentRate);
        require(rAmount <= _rOwned[msg.sender], "Amount must be less than total reflections");
        _rOwned[msg.sender] = _rOwned[msg.sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tTotal = _tTotal.sub(tAmount);
        _tBurnedTotal = _tBurnedTotal.add(tAmount);
        return true;
    }

    function setPrice(uint256 newPrice) public onlyOwner returns(bool) {
        _price = newPrice;
        return true;
    }
}
