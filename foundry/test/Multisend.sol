// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Multisend} from "../src/Multisend.sol";

contract MultisendTest is Test {
    Multisend public multisend;

    function setUp() public{
        multisend = new Multisend();
    }

    function test_send () public{
        address payable[] memory recipients = new address payable[](2);
        uint[] memory amounts = new uint[](2);
        recipients[0] = payable(0x91D8A0aa8942ff8785b434816C5CbF521b57F8c8);
        recipients[1] = payable(0xeD507E248c53C7AAC20F29B378C7c032350d5e02);
        amounts[0] = 50;
        amounts[1] = 100;
        multisend.send{value:150}(recipients, amounts);
        assertEq(address(recipients[0]).balance , amounts[0]);
        assertEq(address(recipients[1]).balance , amounts[1]);
    }
}
