const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
const request = require("superagent");
const serverQuery = "https://dApp-panel-api.herokuapp.com/ethereum-interactions"
let account = "";
const deploymentPrefix = "60606040";
const { getEtherScanPage } = require("./helpers");

$(() => {

    window.ethereum.enable().then((accounts) => {
        $("#loading").show();
        account = accounts[0];
        init();
    }).catch(console.error);

    function init() {
        provider.getNetwork().then((network) => {
            const query = `${serverQuery}/${network.name}/${account}`;
            request.get(query).then((result) => {
                render(result.body);
            }).catch(console.error);
        }).catch(console.error);
    }

    function render(body) {
        $("#loading").hide();
        $("#information").show();
        const chainId = provider._network.chainId;
        body.mostEthTransfersTo.map((recipient) => {
            $("#ethTransfers").append(`<a href="${getEtherScanPage(chainId) + recipient}">${recipient}</a><br>`);
        });
        body.mostUsedContracts.map((contract) => {
            $("#mostUsedContracts").append(`<a href="${getEtherScanPage(chainId) + contract}">${contract}</a><br>`);
        });
        body.contractsYouCreated.map((contract) => {
            $("#contractsYouCreated").append(`<a href="${getEtherScanPage(chainId) + contract}">${contract}</a><br>`);
        });
        body.mostCalledFunctions.map((func) => {
            if(func.functionSignature === deploymentPrefix) {
                $("#mostCommonlyCalledFunctions").append(`<strong>contract creation</strong> <a href="${getEtherScanPage(chainId) + func.contractAddress}"> ${func.contractAddress}</a><br>`);
            } else {
                $("#mostCommonlyCalledFunctions").append(`<strong>${func.functionSignature}</strong> at <a href="${getEtherScanPage(chainId) + func.to}">${func.to}</a><br>`);
            }
        });
    }

});

