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
        const _ = init();
    }).catch(console.error);

    async function init() {
        const network = await provider.getNetwork();
        const query = `${serverQuery}/${network}/${account}`;
        request.get(query).then((result) => {
            render(result.body);
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
                $("#mostCommonlyCalledFunctions").append(`<a href="${getEtherScanPage(chainId) + func.contractAddress}"><strong>contract creation</strong> ${func.contractAddress}</a><br>`);
            } else {
                $("#mostCommonlyCalledFunctions").append(`<a href="${getEtherScanPage(chainId) + func.to}"><strong>${func.functionSignature}</strong> at ${func.to}</a><br>`);
            }
        });
    }

});

