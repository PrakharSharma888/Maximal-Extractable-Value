// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FakeNFT is ERC721{
    constructor() ERC721("FakeNFT", "FNFT"){}

    uint256 tokenId = 1;
    uint256 constant price = 0.01 ether;

    function mint() public payable {
        require(msg.value == price,"Price Incorrect!");
        _mint(msg.sender, tokenId);
        tokenId += 1;
    }
}