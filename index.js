const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
const request = require("superagent");

$(() => {
    window.ethereum.enable().then((accounts) => {
        account = accounts[0];
        chainId = parseInt(window.ethereum.chainId);
    }).catch(console.error);
});

