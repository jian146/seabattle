import { Web3Provider } from '@ethersproject/providers'
import { notification } from 'antd'
import { ContractReceipt } from 'ethers'
import { getEquip } from '.'

/**
 * @description 开箱
 * @param provider web3React Library
 * @param tokenId 钥匙id
 * @returns 英雄 或者 null
 */
export const openBoxAbi = async (provider: Web3Provider, tokenId:string): Promise<ContractReceipt> => {

  try {
    const equipProvider = getEquip(provider)
    const res = await equipProvider.openBox(tokenId)
    return await res.wait()

  } catch (error) {
    console.error('开箱失败', error)

    notification.error({
      message: '开箱失败',
      duration: 1
    })
    return Promise.reject(error)
  }
}
/**
 * @description 获取我的钥匙列表
 * @param provider web3React Library
 * @param kind = 0 全部   1, 钥匙   2， 装备
 * @returns Promise 英雄列表
 */
export const getMyEquipsAbi = async (provider: Web3Provider, kind=1): Promise<any[]> => {
  const equipProvider = getEquip(provider)
  const res = await equipProvider.getMyEquips(kind)
  return res
}

export const getSigner=async (provider: Web3Provider, signerText:string)=>{
  // const equipProvider = getEquip(provider)
  const signer= provider.getSigner()
  const signature = await signer.signMessage(signerText)
  return signature
}
/**
 * 装备锻造
 * @param provider
 * @param tokenId
 * @param type  0基础 1大师 2殿堂
 * @returns
 */
export const recastAbi=async (provider: Web3Provider, type:number)=>{
  // const equipProvider = getEquip(provider)
  try {
    const equipProvider = getEquip(provider)
    const res = await equipProvider.recast( type)
    return res.wait()
  } catch (error) {
    console.error( type)
    return Promise.reject(error)
  }

}
