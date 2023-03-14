import { BigNumber, ContractReceipt, ethers } from 'ethers'

import { HeroType } from 'src/types/hero'
import { Web3Provider } from '@ethersproject/providers'
import { getDlt, getHero, getPve } from '.'
import { errorLog } from '@/utils/log'
import { BignumerToNumber } from '@/utils/BigNumberHelper'

/**
 * @description 获取抽卡信息
 * @param provider web3React Library
 * @returns 抽卡信息
 */
 export const getCardInfoAbi = async (provider: Web3Provider): Promise<{maxCount:number,drawCount:number} | undefined> => {


  const hero = getHero(provider)
  try {

    const tx:BigNumber[] = await hero.getTodayBuyInfo()
    if(tx&&tx?.length>=2){
      const maxCount= tx[0].toNumber()
      const drawCount=tx[1].toNumber()
      return {maxCount,drawCount}
    }else{
      return undefined
    }

    
  } catch (error) {
    errorLog('获取抽卡信息失败', error)
  } 
}

/**
 * @description 抽卡
 * @param provider web3React Library
 * @param count 数量
 * @returns 英雄 或者 null
 */
export const buyHeroAbi = async (provider: Web3Provider, count: number,address:string): Promise<string | undefined> => {


  const hero = getHero(provider)
  try {
    //这里会去调用合约
    const basePrice=(0.1*count)+''

    const tx = await hero.publicMint(count,address,{value:ethers.utils.parseEther(basePrice)})
    const receipt: ContractReceipt = await tx.wait()
    let tradeNo: string | undefined = undefined
    if (receipt.events) {

      for (const event of receipt.events) {
        if (event.event === 'onPublicMint') {
          //从1开始,0是不存在
          if (event.args?.tradeNo) {
            tradeNo = (event.args?.tradeNo as BigNumber).toHexString()
            // tradeNo = event.args?.tradeNo
          }

        }
      }
    }
    return tradeNo
  } catch (error) {
    errorLog('抽取英雄失败', error)
  } 
}

export const priceList=[0,2500,6250,12000,20000,33250] 
/**
 * 获取升级所需要的费用
 * @param currentLv 当前等级
 * @returns 
 */
export const getUploadPrice=(currentLv: number)=>{

  return priceList[currentLv]
}

/**
 * 
 * @param provider 
 * @param heroId 要升级英雄的id
 * @param currentLv 英雄此时的等级
 * @returns 
 */
export const uploadHeroAbi= async (provider: Web3Provider, heroId: string,currentLv: number): Promise<string | undefined> => {
  const hero = getHero(provider)
  try {
    //这里会去调用合约
    
    const basePrice=getUploadPrice(currentLv)+''
    const bigNumberPirce=ethers.utils.parseEther(basePrice)
    const tx = await hero.upgrade(heroId,bigNumberPirce)
    const receipt: ContractReceipt = await tx.wait()
    let upgradeNo: string | undefined = undefined
    if (receipt.events) {

      for (const event of receipt.events) {
        if (event.event === 'onUpgrade') {
          //从1开始,0是不存在
          if (event.args?.upgradeNo) {
            upgradeNo = (event.args?.upgradeNo as BigNumber).toHexString()
          }

        }
      }
    }
    return upgradeNo
  } catch (error) {
    errorLog('升级英雄失败', error)
  } 
}