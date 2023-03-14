import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { getMarket } from '.'
import { getHeroByTokenId } from './hero'
import { HeroWithPriceType, HeroWithPriceTypeWithMarket } from 'src/types/hero'
import { errorLog } from 'src/utils/log'


/**
 * @description 获取我的售卖列表
 */
export const getMySales = async (provider: Web3Provider, isSold = false): Promise<HeroWithPriceType[]> => {
  try {
    const market = getMarket(provider)
    const result = await market.mySales(isSold)
    const list: HeroWithPriceType[] = []
    for (let index = 0; index < result.length; index++) {
      const { tokenId, price, onSell, soldTime, sellNo } = result[index]
      const hero = await getHeroByTokenId(provider, tokenId.toHexString())
      list.push({
        ...hero,
        price: ethers.utils.formatEther(price),
        onSell,
        soldTime,
        sellNo
      })
    }
    return list
  } catch (error) {
    console.error('获取我的售卖列表:', error)
    return Promise.reject([])
  }

}


/**
 * @description 获取市场所有售卖信息
 */
export const getAllMarketHeroList = async (provider: Web3Provider) => {
  try {
    const market = getMarket(provider)
    const result = await market.allList()
    const list: HeroWithPriceTypeWithMarket[] = []
    for (let index = 0; index < result.length; index++) {
      const { price, onSell, soldTime, sellNo,
        strength,
        agility,
        stamina,
        will,
        intelligence,
        mind,
        tokenId,
        fatigue
      } = result[index]
      const hero = result[index]
      //
      if (parseInt(tokenId.toHexString())!==0){
        list.push({
          ...hero,
          tokenId: tokenId.toHexString(),
          total: strength + agility + stamina + will + intelligence + mind,
          buyer: hero.buyer,
          seller: hero.seller,
          price: ethers.utils.formatEther(price),
          onSell,
          soldTime,
          sellNo: sellNo,
          fatigue: (fatigue ).toNumber()
        })
      }
    }
    return list
  } catch (error) {

    return Promise.reject([])
  }

}


/**
 * @description 获取市场所有售卖信息
 */
const saleList = async (provider: Web3Provider, isSold: boolean, page: number): Promise<{
  tokenId: ethers.BigNumber
  price: ethers.BigNumber
  sellTime: ethers.BigNumber
  onSell: boolean
  [prop: string]: any
}[]> => {
  try {
    const market = getMarket(provider)
    return await market.saleList(isSold, page)
  } catch (error) {

    return Promise.reject({
      tokenId: 0,
      sellTime: 0,
      onSell: false

    })
  }

}

/**
 * @description 获取市场英雄列表
 */
export const getMarketHeroList = async (provider: Web3Provider, page: number, isSold = false) => {
  try {
    const market = getMarket(provider)
    const total: ethers.BigNumber = await market.saleListCount(isSold)
    const result = await saleList(provider, isSold, page)
    const list: HeroWithPriceType[] = []
    for (let index = 0; index < result.length; index++) {
      const { tokenId, price, onSell, soldTime, sellNo } = result[index]
      const hero = await getHeroByTokenId(provider, tokenId.toHexString())
      list.push({
        ...hero,
        price: ethers.utils.formatEther(price),
        onSell,
        soldTime,
        sellNo
      })
    }
    return {
      list,
      total: total.toNumber()
    }
  } catch (error) {

    return Promise.reject({
      list: [],
      total: 0
    })
  }

}

/**
 * @description 售卖英雄
 */
export const sellHero = async (
  provider: Web3Provider,
  tokenId: string,
  price: string
) => {
  const market = getMarket(provider)
  const value = ethers.utils.parseEther(price)
  const result = await market.sale(tokenId, value)
  return result.wait()
}

/**
 * @description 取消售卖
 */
export const stopSale = async (provider: Web3Provider, sellNo: ethers.BigNumber) => {
  const market = getMarket(provider)
  const result = await market.stopSale(sellNo)
  return result.wait()
}

/**
 * @description 购买英雄
 */
export const buy = async (provider: Web3Provider, sellNo: ethers.BigNumber) => {
  try {
    const market = getMarket(provider)
    const result = await market.buy(sellNo)
    return result.wait()
  } catch (error) {
    errorLog('购买英雄', error)
    return Promise.reject()
  }

}

/**
 * @description 获取购买的英雄
 */
export const getMyOrders = async (provider: Web3Provider) => {
  try {
    const market = getMarket(provider)
    const result = await market.myOrders()
    const list: HeroWithPriceType[] = []
    for (let index = 0; index < result.length; index++) {
      const { tokenId, price, onSell, soldTime, sellNo } = result[index]
      const hero = await getHeroByTokenId(provider, tokenId.toHexString())
      list.push({
        ...hero,
        price: ethers.utils.formatEther(price),
        onSell,
        soldTime,
        sellNo
      })
    }
    return list
  } catch (error) {

    return Promise.reject([])
  }

}
