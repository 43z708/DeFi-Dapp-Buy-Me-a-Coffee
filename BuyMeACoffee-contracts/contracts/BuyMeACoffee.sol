// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Example Contract Address on Goerli: 0xDBa03676a2fBb6711CB652beF5B7416A53c1421D

contract BuyMeACoffee {
  // Event to emit when a Memo is created.
    event NewMemo(
      address indexed from,
      uint256 timestamp,
      string name,
      string message
    );

    // Memo struct.
    struct Memo {
      address from;
      uint256 timestamp;
      string name;
      string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.

    address payable owner;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }
    /**
     * @dev fetches all stored memos
     */
     function getMemos() public view returns (Memo[] memory) {
      return memos;
     }
}
