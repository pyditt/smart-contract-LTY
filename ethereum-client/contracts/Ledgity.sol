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

    uint256 public constant tAllTotal = 10e26;
    string public name = 'Ledgity';
    string public symbol = 'LTY';
    uint8 public decimals = 9;
    uint256 public allowTradeAt;
    uint256  public constant startPrice = 1;
    uint256 public numTokensSellToAddToLiquidity = 5000 * 10e9;
    bool public inSwapAndLiquify;

    uint256 private  _tTotal = 10e26;
    uint256 private _rTotal = (MAX - (MAX % _tTotal));
    uint256 private constant MAX = ~uint256(0);
    uint256 private _tBurnedTotal;
    uint256 private _rBurnedTotal;
    uint256 private _tFeeTotal;
    uint256 private _price = 7;
    bool private _takeFee = false;

    IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Pair public uniswapV2Pair;
    address public uniswapV2PairAddress;

    address[] private _dex;
    address[] private _excluded;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;
    mapping (address => uint256) private _TxTime;
    mapping (address => bool) private _dexM;
    mapping (address => bool) private _isExcluded;
    mapping (address => bool) private _ExcludedFromFee;

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

    // [+] TODO replace expressions of multiplication and reduction of powers
    // [+] TODO переменные которые являются константными сделать публичными и без подчеркиваний(для публичнык нет _), упорядочить структуру переменных
    // [+] 1 library using, 2.Структуры, 3. паблик переменные, 4. приват 5.сложные структуры, массивы (паблик)
    // [+] 6 сложные структуры, массивы (приват), 7. Паблик view 8. Приват view, 9. Events, 10. Конструктор, 11.
    // [+] Внутри функций не дорлжно быть пустых строк
    // [+] Require message указывать в формате "Ledgity: mesdss hkfkdhd dsf" не более 5 слов
    // [+] Внутри функций убрать комментарии

    constructor () public {
        _rOwned[_msgSender()] = _rTotal;
        excludeAccount(_msgSender());
        excludeAccount(address(this));
        _ExcludedFromFee[address(this)]=true;
        _ExcludedFromFee[_msgSender()]=true;
        /*_ExcludedFromFee[RESERVE]=true;*/
        emit Transfer(address(0), _msgSender(), _tTotal);
    }

    receive() external payable {}
    
    function initPair(address routerAddress) public onlyOwner {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(routerAddress);
        address _uniswapV2PairAddress = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        uniswapV2Pair = IUniswapV2Pair(_uniswapV2PairAddress);
        uniswapV2Router = _uniswapV2Router;
        uniswapV2PairAddress = _uniswapV2PairAddress;
        setDex(uniswapV2PairAddress);
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function totalFee() public view returns (uint256) {
        return _tFeeTotal;
    }

    function maxTokenTx() public view returns (uint256) {
        return _tTotal.div(1000);
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
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "Ledgity: decreased allowance below zero"));
        return true;
    }

    function isExcluded(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function reflect(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Ledgity: excluded addresses cannot call reflect");
        (uint256 rAmount,,,,,,) = _getValues(tAmount, sender, address(0));
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }
    // [+] TODO
    // можно объявить возвращаему переменную "function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256 rTransferAmount)" 
    // (, rTransferAmount,,,) = _getValues(tAmount);
    // В остальных методах сделать нечто подобное

    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256 rTransferAmount) {
        require(tAmount <= _tTotal, "Ledgity: amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,,,) = _getValues(tAmount, address(0), address(0));
            return rAmount;
        } else {
            (,rTransferAmount,,,,,) = _getValues(tAmount, address(0), address(0));
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Ledgity: amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }

    // [+] TODO return true
    function excludeAccount(address account) public onlyOwner() returns (bool){
        require(!_isExcluded[account], "Ledgity: account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
        return true;
    }

    function setDex(address dex) public onlyOwner () {
        _dex.push(dex);
        _dexM[dex] = true;
        excludeAccount(dex);
    }

    // TODO можно вместо переборов использовать попробовать EnumerableSet
    function includeAccount(address account) external onlyOwner() returns(bool){
        require(_isExcluded[account], "Ledgity: account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) private returns(bool){
        require(owner != address(0), "Ledgity: approve from the zero address");
        require(spender != address(0), "Ledgity: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    // [+] TODO return true

    function enableFairLaunch() external onlyOwner() returns(bool){
        require(msg.sender != address(0), "Ledgity: approve from the zero address");
        allowTradeAt = block.timestamp;
        return true;
    }

    function swapTokensForEth(uint256 tokenAmount) private{
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

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private{
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

    function getPairValues() public view returns(uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) {
        (reserve0, reserve1, blockTimestampLast) = uniswapV2Pair.getReserves();
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

    function _takeLiquidity(uint256 tFee/*, uint256 rFee*/) private {
        _tOwned[address(this)] = _tOwned[address(this)].add(tFee);
    }

    function removeAllFee() private {
        if(!_takeFee) return;
        _takeFee = false;
    }
    
    function restoreAllFee() private {
        if(_takeFee) return;
        _takeFee = true;
    }

    function _transfer(address sender, address recipient, uint256 amount) private {
        require(sender != address(0), "Ledgity: transfer from the zero address");
        require(recipient != address(0), "Ledgity: transfer to the zero address");
        require(amount > 0, "Ledgity: transfer amount must be greater than zero");
        require(_TxTime[sender] < block.timestamp.sub(15 seconds) || sender == owner(), "Ledgity: only ONE transaction per 15 seconds");
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
        bool takeFee = false;
        if((!_ExcludedFromFee[sender] || !_ExcludedFromFee[recipient]) && (_dexM[recipient] || _dexM[sender])){
            (uint256 reserve0,,) = uniswapV2Pair.getReserves();
            if (reserve0 > 100000*10e9) {
                require(amount < reserve0.div(100), "Ledgity: transfer amount must be less than 0.1% of totalSupply");
            }
            takeFee = true;
        }
        _tokenTransfer(sender,recipient,amount,takeFee);
    }

    function _tokenTransfer(address sender, address recipient, uint256 amount,bool takeFee) private {
        if(!takeFee)
            removeAllFee();
        if (_isExcluded[sender] && !_isExcluded[recipient]) {
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
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFeeLiquid, uint256 rFeeReflect, uint256 tTransferAmount, uint256 tFeeLiquid, uint256 tFeeReflect) = _getValues(tAmount, sender, recipient);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFeeLiquid/*, rFeeLiquid*/);
        _reflectFee(rFeeReflect, tFeeReflect);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFeeLiquid, uint256 rFeeReflect, uint256 tTransferAmount, uint256 tFeeLiquid, uint256 tFeeReflect) = _getValues(tAmount, sender, recipient);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFeeLiquid/*, rFeeLiquid*/);
        _reflectFee(rFeeReflect, tFeeReflect);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFeeLiquid, uint256 rFeeReflect, uint256 tTransferAmount, uint256 tFeeLiquid, uint256 tFeeReflect) = _getValues(tAmount, sender, recipient);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFeeLiquid/*, rFeeLiquid*/);
        _reflectFee(rFeeReflect, tFeeReflect);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFeeLiquid, uint256 rFeeReflect, uint256 tTransferAmount, uint256 tFeeLiquid, uint256 tFeeReflect) = _getValues(tAmount, sender, recipient);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tFeeLiquid/*, rFeeLiquid*/);
        _reflectFee(rFeeReflect, tFeeReflect);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }

    function _getValues(uint256 tAmount, address sender, address recipient) private view returns (uint256 rAmount, uint256 rTransferAmount, uint256 rFeeLiquid, uint256 rFeeReflect, uint256 tTransferAmount, uint256 tFeeLiquid, uint256 tFeeReflect) {
        (tTransferAmount, tFeeLiquid, tFeeReflect) = _getTValues(tAmount, sender, recipient);
        uint256 currentRate =  _getRate();
        ( rAmount, rTransferAmount, rFeeLiquid, rFeeReflect) = _getRValues(tAmount, tFeeLiquid, tFeeReflect, currentRate);
    }

    function _getTValues(uint256 tAmount, address sender, address recipient) private view returns (uint256 tTransferAmount, uint256 tFeeLiquid, uint256 tFeeReflect) {
        if(_takeFee) {
                if(_dexM[recipient]){
                    tFeeLiquid = tAmount.mul(6).div(100);
                        if(_price < startPrice.mul(10))
                            tFeeLiquid = tAmount.mul(21).div(100);
                } else  {
                    tFeeLiquid = 0;
                }
            tFeeReflect = tAmount.mul(4).div(100);
        } else {
            tFeeReflect = 0;
            tFeeLiquid = 0;
        }
        tTransferAmount = tAmount.sub(tFeeLiquid).sub(tFeeReflect);
    }

    function _getRValues(uint256 tAmount, uint256 tFeeLiquid, uint256 tFeeReflect, uint256 currentRate) private pure returns (uint256 rAmount, uint256 rTransferAmount, uint256 rFeeLiquid, uint256 rFeeReflect) {
        rAmount = tAmount.mul(currentRate);
        rFeeLiquid = tFeeLiquid.mul(currentRate);
        rFeeReflect = tFeeReflect.mul(currentRate);
        rTransferAmount = rAmount.sub(rFeeLiquid).sub(tFeeReflect);
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


    function burn(uint256 tAmount) public onlyOwner returns(bool){
        uint256 currentRate =  _getRate();
        uint256 rAmount = tAmount.mul(currentRate);
        require(rAmount <= _rOwned[msg.sender], "Ledgity: amount must be less than your balance");
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
