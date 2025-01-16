// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FactoryDMed is Ownable {
    mapping(uint => address) allContracts; 
    uint current = 0;
    
    constructor() Ownable(msg.sender){
        
    }

    function createNFTContract(string memory name, string memory symbol) public onlyOwner returns(address){
        address newContract = address(new NFT(name, symbol));
        allContracts[current] = newContract;
        current++;
        return address(newContract);
    }

    function getContract(uint index) public onlyOwner view returns(address) {
        require(index >= 0 && index < current, "index out of bound");
        return allContracts[index];
    }
}

contract NFT is ERC721URIStorage, Ownable {

    struct prescription {
        uint cost;
        address patient;
    }

    uint256 private _tokenId;
    mapping(uint => prescription) private prescriptionMap;
    
    constructor (string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender){
        _tokenId = 0;
    }


    function generatePrescription(string memory tokenURI, uint cost, address patient) public returns(uint256) {
        uint256 newTokenId = _tokenId;
        _mint(owner(), newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        prescriptionMap[newTokenId].patient = patient;
        prescriptionMap[newTokenId].cost = cost;
        _tokenId += 1;
        return newTokenId;
    }

    function costOf(uint tokenId) public view returns(uint256) {
        return prescriptionMap[tokenId].cost;
    }

    function patientOf(uint tokenId) public view returns(address) {
        return prescriptionMap[tokenId].patient;
    }

    function transferPrescription(uint tokenId) public payable {
        require(prescriptionMap[tokenId].patient == msg.sender, "sender is not patient");
        require(prescriptionMap[tokenId].cost <= msg.value, "amount is invalid");
        _safeTransfer(ownerOf(tokenId), msg.sender , tokenId);
        (bool send,) = address(msg.sender).call{value: prescriptionMap[tokenId].cost}("");
    }

}