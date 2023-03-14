import { Web3Provider } from '@ethersproject/providers'
import { ContractReceipt, ethers} from 'ethers'
import { HeroType, pve_heroType } from 'src/types/hero'
import { getHero, getPve } from '.'


/**
 * @description 获取pve英雄列表
 * @param provider web3React Library
 * @returns Promise 英雄列表
 */
export const getPveHeroList = async (provider: Web3Provider): Promise<pve_heroType[]> => {
  const hero = getHero(provider)
  const pveProvider = getPve(provider)
  const res = await hero.getMyHeros()
  const tokenIds:string[]=[]
  const list= res.map((hero:HeroType)=>{
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

  const listCount=await pveProvider.getAvailableGameTimes(tokenIds)
  if (listCount.length===list.length){
    list.map((heroItem:pve_heroType, index:number)=>{
      heroItem.pveCount=listCount[index].toNumber()
      return heroItem
    })
  }
  return list
}

/**
 * @description 获取pve
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const battle = async (provider: Web3Provider, mapId:number, lv:number, tokenId:string): Promise<ContractReceipt> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.battle(mapId+1, lv, tokenId, {gasLimit: 4000000})
    return await res.wait()
  } catch (error) {

    return Promise.reject(error)

  }

}

/**
 * @description 获取pve
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const newBattle = async (provider: Web3Provider, mapId:number, lv:number, tokenId:string): Promise<ContractReceipt> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.newBattle(mapId+1, lv, tokenId)
    return await res.wait()
  } catch (error) {
    console.error('pve异常222', error)
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
  const tokenIds:string[]=[]
  const list= res.map((hero:HeroType)=>{
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

  const listCount=await pveProvider.getAvailableGameTimes(tokenIds)
  if (listCount.length===list.length){
    list.map((heroItem:pve_heroType, index:number)=>{
      heroItem.pveCount=listCount[index].toNumber()
      return heroItem
    })
  }
  return list
}

/**
 * 获取pve 可以领取的金币和dlt
  * @param provider web3React Library
 * @returns 金币和dlt,
 */
export const getClaimObjectsAbi = async (provider: Web3Provider):Promise<ethers.BigNumber[]> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.getClaimObjects()
    return await res
  } catch (error) {

    return Promise.reject(error)
  }

}

/**
 * 获取pve 领取金币和dlt
  * @param provider web3React Library
 * @returns
 */
export const claimAllAbi = async (provider: Web3Provider):Promise<null> => {
  const pveProvider = getPve(provider)
  try {
    const res = await pveProvider.claimAll()
    return await res.wait()
  } catch (error) {
    console.error('pve领取金币和dlt异常', error)
    return Promise.reject(error)
  }
}
