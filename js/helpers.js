function getEtherScanPage(chainId) {
    switch (chainId) {
        case 1:
            return "https://etherscan.io/address/";
        case 3:
            return "https://ropsten.etherscan.io/address/";
        case 4:
            return "https://rinkeby.etherscan.io/address/";
        case 42:
            return "https://kovan.etherscan.io/address/";
        default:
            return "";
    }
}

module.exports = { getEtherScanPage };
