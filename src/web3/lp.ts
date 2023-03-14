import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { getLP } from '.'

/**
 * @description 获取我的lp余额
 * @param provider web3React Library
 *  @param myAddress 玩家地址
 * @returns Promise<ContractReceipt>
 */
export const getMyLP=async (provider: Web3Provider, myAddress:string) => {


  const Lp = getLP(provider)
  const count= await Lp.balanceOf(myAddress)

  return ethers.utils.formatEther(count)
}

