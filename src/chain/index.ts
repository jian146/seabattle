// 支持的链
export const SuportChain = {
    eth: {
        chanId: 1,
        name: 'eth'
    },
    bsc: {
        chainId: 56,
        name: 'bsc'
    },
    polygon: {
        chainId: 56,
        name: 'polygon'
    }
}
 
// 链id 网络id
export enum NetworkID {
    // 主网
    Mainnet = 56,
    // 测试网
    Testnet = 97
}
 
export enum SUPPORT_CHAIN {
    BSC = 56,
    BSCTEST = 97
}
 
// 当前链ID
export const CURRENT_CHAIN = 56
 
// MetaMask 中 request 请求中的 methods 方法
export enum MetaMaskRequestMethods {
    // 添加在metamask中不存在的链
    addEthereumChain = "wallet_addEthereumChain",
    // 吧Token代币添加到钱包中
    watchAsset = 'wallet_watchAsset',
    // 获取当前链接的网络Id
    chainId = 'eth_chainId',
    // eth_requestAccunts 获取账号（可以理解为链接钱包）
    requestAccount = 'eth_requestAccounts',
    // 获取账户地址
    accounts = 'eth_accounts',
    // 获取最新区块编号
    blockNumber = 'eth_blockNumber'
}
// 添加一条链到metamask上时请求网络参数
export const AddEthereumChainParams: { [key: number]: any } = {
    8: {
        chainId: '0x8',
        chainName: 'Ubiq',
        chativeCurrency: {
            name: 'Ubiq Ether',
            symbol: 'BUQ',
            decimals: 18,
        },
        rpcUrl: ['https://rpc.octano.dev/'],
        blockExplorerUrls: ['https://ubiqscan.io/']
    },
    56: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'bnb',
            decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed1.defibit.io', 'https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com/'],
    }
}
 