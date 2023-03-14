import { ethers } from 'ethers'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector'
 
 
// 提供一个provider转成web3provider
 
export const getLibray = (provider: ExternalProvider | JsonRpcFetchFunc) => {
    const web3Provider = new ethers.providers.Web3Provider(provider)
    return web3Provider
}
 
export const InjectConnector = new InjectedConnector({ supportedChainIds: [56] })