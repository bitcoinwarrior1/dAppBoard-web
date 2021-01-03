const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
const request = require("superagent");
const serverQuery = "https://dApp-panel-api.herokuapp.com/ethereum-interactions";
let account = "";
const feeToAccessAPI = ethers.utils.formatUnits(0.00001, "ether");
const deploymentPrefix = "60606040";
const { getEtherscanAddressPage, getEtherScanContractPage } = require("./helpers");

$(() => {

    window.ethereum.enable().then((accounts) => {
        $("#loading").show();
        account = accounts[0];
        init();
    }).catch(console.error);

    //TODO form this dynamically according to the user's account
    function getPaywallPayload() {
        return "Transfer 0.001 ETH\n" +
            "To: 0xfe6d4bc2de2d0b0e6fe47f08a28ed52f9d052a02\n" +
            "Nonce: 2\n" +
            "Fee: 0.00000475 ETH\n" +
            "Account Id: 6084"; //TODO does this change via the recipient
    }

    function init() {
        provider.getNetwork().then((network) => {
            const paywallPayload = getPaywallPayload();
            ethers.connect(provider.getSigner()).sign(paywallPayload).then((signature) => {
                const paywallObj = {};
                paywallObj.payload = paywallPayload;
                paywallObj.signature = signature;
                const query = `${serverQuery}/${network.name}/${account}/${paywallObj}`;
                request.get(query).then((result) => {
                    render(result.body);
                }).catch(console.error);
            }).catch(alert("you must pay the paywall to access this service"));
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

