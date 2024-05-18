//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Multisend{
    function send(
        address payable[] calldata recipients,
        uint[] calldata amounts    
    ) external payable {
        require(
            recipients.length == amounts.length,
            "Recipients and Amounts should have same length"
        );

        for(uint i=0;i<recipients.length;i++){
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }
    }
}