import { Web3Provider } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { getVC, getNBPool } from "."



/**
 * 用金币换BNB
 * @param provider 
 * @param amount 
 */
export const swapBNBAbi= async (provider: Web3Provider, vc: BigNumber): Promise<void> => {    
    const vcPool = getNBPool(provider)
    const res=await vcPool.swapBNB(vc)
    return res.wait()

}
/**
 * 用BNB换金币NB
 * @param provider 
 * @param amount 
 */
 export const swapTokenAbi= async (provider: Web3Provider, bnb: BigNumber): Promise<void> => {
    const nbPool = getNBPool(provider)
    const res=await nbPool.swapToken({value:bnb})
    return res.wait()

}
/**
 * 获取池子中的bnb余额
 * @param provider 
 */
 export const getPoolBNB= async (provider: Web3Provider): Promise<BigNumber> => {
    const nbPool = getNBPool(provider)
    const res=await nbPool.bnbBalance()
    return res

}
/**
 * 获取池子中的nb余额
 * @param provider 
 */
 export const getPoolNB= async (provider: Web3Provider): Promise<BigNumber> => {
    const nbPool = getNBPool(provider)
    const res=await nbPool.tokenBalance()
    return res

}