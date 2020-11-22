function getEtherscanAddressPage(chainId, address) {
    switch (chainId) {
        case 1:
            return `https://etherscan.io/address/${address}`;
        case 3:
            return `https://ropsten.etherscan.io/address/${address}`;
        case 4:
            return `https://rinkeby.etherscan.io/address/${address}`;
        case 42:
            return `https://kovan.etherscan.io/address/${address}`;
        default:
            return "";
    }
}

function getEtherScanContractPage(chainId, address) {
    return getEtherscanAddressPage(chainId, address) + "#code";
}

module.exports = { getEtherscanAddressPage, getEtherScanContractPage };
