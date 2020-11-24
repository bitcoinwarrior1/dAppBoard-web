const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
const request = require("superagent");
const serverQuery = "https://dApp-panel-api.herokuapp.com/ethereum-interactions";
let account = "";
const deploymentPrefix = "60606040";
const { getEtherscanAddressPage, getEtherScanContractPage } = require("./helpers");

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
            $("#ethTransfers").append(`<a href="${getEtherscanAddressPage(chainId, recipient)}">${recipient}</a><br>`);
        });
        body.mostUsedContracts.map((contract) => {
            getContractName(contract).then((contractName) => {
                $("#mostUsedContracts").append(`<a href="${getEtherscanAddressPage(chainId, contract)}">${contractName + " (" + contract + ")"}</a><br>`);
            }).catch((e) => {
                $("#mostUsedContracts").append(`<a href="${getEtherscanAddressPage(chainId, contract)}">${"(" + contract + ")"}</a><br>`);
            });
        });
        body.contractsYouCreated.map((contract) => {
            getContractName(contract).then((contractName) => {
                $("#contractsYouCreated").append(`<a href="${getEtherscanAddressPage(chainId, contract)}">${contractName + " (" + contract + ")"}</a><br>`);
            }).catch((e) => {
                $("#contractsYouCreated").append(`<a href="${getEtherscanAddressPage(chainId, contract)}">${"(" + contract + ")"}</a><br>`);
            });
        });
        body.mostCalledFunctions.map((func) => {
            if(func.functionSignature === deploymentPrefix) {
                getContractName(func.contractAddress).then((contractName) => {
                    $("#mostCommonlyCalledFunctions").append(`<strong>contract creation</strong> <a href="${getEtherscanAddressPage(chainId, func.contractAddress)}"> ${contractName + " (" + func.contractAddress} + ")</a><br>`);
                }).catch((e) => {
                    $("#mostCommonlyCalledFunctions").append(`<strong>contract creation</strong> <a href="${getEtherscanAddressPage(chainId, func.contractAddress)}">${"(" + func.contractAddress} + ")</a><br>`);
                });
            } else {
                getContractName(func.to).then((contractName) => {
                    $("#mostCommonlyCalledFunctions").append(`<strong>${func.functionSignature}</strong> at <a href="${getEtherScanContractPage(chainId, func.to)}">${contractName + " (" + func.to + ")"}</a><br>`);
                }).catch((e) => {
                    $("#mostCommonlyCalledFunctions").append(`<strong>${func.functionSignature}</strong> at <a href="${getEtherScanContractPage(chainId, func.to)}">${" (" + func.to + ")"}</a><br>`);
                });
            }
        });
    }

    async function getContractName(contractAddress) {
        const contract = new Ethers.Contract(contractAddress, ERC20, provider);
        return await contract.name.call();
    }

});

