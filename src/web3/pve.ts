import { I_claimAllApi } from '@/api/pve'
import { TransactionResponse, Web3Provider } from '@ethersproject/providers'
import { ContractReceipt } from 'ethers'
import { HeroType, pve_heroType } from 'src/types/hero'

import { getHero, getPve } from '.'


/**
 * @description 获取pve英雄列表
 * @param provider web3React Library
 * @param isOld 是否是老英雄
 * @returns Promise 英雄列表
 */
export const getPveHeroList = async (provider: Web3Provider, isOld = false): Promise<pve_heroType[]> => {

  const hero = getHero(provider)
  const pveProvider = getPve(provider)
  const res = await hero.getMyHeros()
  const tokenIds: string[] = []
  const list = res.map((hero: HeroType) => {
    tokenIds.push(hero.tokenId)
    const {
      strength,
      agility,
      stamina,
      will,
      intelligence,
      mind,
      tokenId,
      fatigue
    } = hero
    return {
      ...hero,
      tokenId: (tokenId as any).toHexString(),
      fatigue: (fatigue as any).toNumber(),
      total: strength + agility + stamina + will + intelligence + mind
    }
  })

  const listCount = await pveProvider.getAvailableGameTimes(tokenIds)
  if (listCount.length === list.length) {
    list.map((heroItem: pve_heroType, index: number) => {
      heroItem.pveCount = listCount[index].toNumber()
      return heroItem
    })
  }
  return list.filter((item: pve_heroType) => item.newbie === false)
}

/**
 * @description 获取pve
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const battle = async (provider: Web3Provider, mapId: number, lv: number, tokenId: string): Promise<ContractReceipt> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.battle(tokenId, mapId + 1, lv, { gasLimit: 4000000 })
    return await res.wait()
  } catch (error) {
    console.error('pve异常', error)
    return Promise.reject(error)

  }

}

/**
 * @description 获取pve
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const abiBattle = async (provider: Web3Provider, mapId: number, lv: number, tokenId: string): Promise<ContractReceipt> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.battle(tokenId, mapId + 1, lv, { gasLimit: 1000000 })
    return await res.wait(2)
  } catch (error) {
    console.error('新英雄pve异常', error)
    return Promise.reject(error)
  }

}
/**
 * @description 获取pve v1老英雄
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const newBattleV1Abi = async (provider: Web3Provider, mapId: number, lv: number, tokenId: string): Promise<ContractReceipt> => {
  const pveProvider = getPve(provider)
  try {
    const res: TransactionResponse = await pveProvider.newBattleV1(mapId + 1, lv, tokenId, { gasLimit: 1000000 })
    return await res.wait(2)
  } catch (error) {
    console.error('老英雄pve异常', tokenId, error)
    return Promise.reject(error)
  }

}


/**
 * @description 获取pve英雄列表
 * @param provider web3React Library
 * @returns Promise 英雄列表
 */
export const getBattleList = async (provider: Web3Provider): Promise<pve_heroType[]> => {
  const hero = getHero(provider)
  const pveProvider = getPve(provider)
  const res = await hero.getMyHeros()
  const tokenIds: string[] = []
  const list = res.map((hero: HeroType) => {
    tokenIds.push(hero.tokenId)
    const {
      strength,
      agility,
      stamina,
      will,
      intelligence,
      mind,
      tokenId,
      fatigue
    } = hero
    return {
      ...hero,
      tokenId: (tokenId as any).toHexString(),
      fatigue: (fatigue as any).toNumber(),
      total: strength + agility + stamina + will + intelligence + mind
    }
  })

  const listCount = await pveProvider.getAvailableGameTimes(tokenIds)
  if (listCount.length === list.length) {
    list.map((heroItem: pve_heroType, index: number) => {
      heroItem.pveCount = listCount[index].toNumber()
      return heroItem
    })
  }
  return list.filter((item: pve_heroType) => item.newbie === false)
}


/**
 * 获取pve 领取全部收益
  * @param provider web3React Library
 * @returns
 */
export const claimAllBattleAbi = async (provider: Web3Provider, backData: I_claimAllApi): Promise<null> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.claimAllBattle(backData.battleIds, backData.allGolds, backData.sig)
    return await res.wait()
  } catch (error) {
    
    return Promise.reject(error)
  }
}

/**
 * 获取pve 取消此条pve
  * @param provider web3React Library
 * @returns
 */
export const cancelBattleAbi = async (provider: Web3Provider, battleId: number): Promise<null> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.cancelBattle(battleId)
    return await res.wait()
  } catch (error) {

    return Promise.reject(error)
  }
}
