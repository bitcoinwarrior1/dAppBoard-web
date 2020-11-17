const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
const request = require("superagent");
const serverQuery = "https://dApp-panel-api.herokuapp.com/ethereum-interactions"
let account = "";

$(() => {

    window.ethereum.enable().then((accounts) => {
        account = accounts[0];
        const _ = init();
    }).catch(console.error);

    async function init() {
        const network = await provider.getNetwork();
        const query = `${serverQuery}/${network}/${account}`;
        request.get(query).then((result) => {
            $("#ethTransfers").text(result.body.mostEthTransfersTo);
            $("#mostUsedContracts").text(result.body.mostUsedContracts);
            $("#contractsYouCreated").text(result.body.contractsYouCreated);
            $("#mostCalledFunctions").text(result.body.mostCalledFunctions);
        }).catch(console.error);
    }

});

