pragma solidity >=0.4.21 <0.7.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';


contract TestToken is ERC20 {
    constructor() public ERC20("TestToken", "DF") {
        _mint(msg.sender, 1000000);
    }
}
