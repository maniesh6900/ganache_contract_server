// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract MainClass {
    address public owner;
    uint price = 1000 wei;
    mapping(address => uint256) public balances;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function pay() external payable {
        require(msg.value == price, "Wrong amount");
        balances[msg.sender] += msg.value;
    } 

    function release() external onlyOwner {
        uint amount = balances[owner];
        balances[owner] = 0;

        (bool success, ) = owner.call{value: amount}("");
        require(success);
    }

    function refund() external {
        uint amount = balances[msg.sender];
        require(amount > 0, "No balance");

        balances[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }

    
}


  // function PayToPostImageOnFacebookPage(
    //     address payable yourAddress
    // ) public payable returns (bool) {
    //     if (msg.value == price) {
    //         // oldbalance = getBalance();
    //         bool success = payable(yourAddress).send(msg.value);
    //         require(success, "Failed to send Ether");
    //         // newbalance = getBalance();
    //         // require(oldbalance - newbalance == price, "didnt recived the Eth");
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    // function getBalance() private view returns (uint) {
    //     return owner.balance;
    // } 