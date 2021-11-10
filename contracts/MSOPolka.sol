// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SignData {
    constructor() {}

    function getSender(
        string memory productName,
        uint256 priceInUSD,
        uint256 period,
        uint256 conciergePrice,
        bytes32 r, bytes32 s, uint8 v
    ) external pure returns(address) {

        // bytes32 digest = getSignedMsgHash(productName, priceInUSD, period, conciergePrice);
        bytes32 msgHash = keccak256(abi.encodePacked(productName, priceInUSD, period, conciergePrice));
        // bytes32 msgHash = keccak256(abi.encodePacked(productName));
        // bytes32 msgHash = keccak256(abi.encodePacked(productName));
        bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash));
        // (bytes32 r, bytes32 s, uint8 v) = splitSignature(sig);
        address recoveredAddress = ecrecover(digest, v, r, s);
        return recoveredAddress;
    }
}
