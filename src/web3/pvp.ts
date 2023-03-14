import { Web3Provider } from '@ethersproject/providers'
import { BigNumber, ContractReceipt } from 'ethers'
import { getHero, getPvp, Pvp_ADDRESS } from '.'


/**
 * @description pvp 授权
 * @param provider Web3React Library
 * // 授权失败链上应该会报错
 */
export const pveAuthorize = async (provider: Web3Provider) => {
  const hero = getHero(provider)
  const tx = await hero.setApprovalForAll(Pvp_ADDRESS, true)
  return await tx.wait()
}

/**
 * @description 查询 pvp 授权
 * @param provider Web3React Library
 */
export const getPveAuthorize = async (
  provider: Web3Provider
): Promise<boolean> => {
  const hero = getHero(provider)
  return await hero.isApprovedForAll(
    await provider.getSigner().getAddress(),
    Pvp_ADDRESS
  )
}

/**
 * @description 查询英雄对 pvp 授权，如果未授权则授权
 * @param provider Web3React Library
 */
export const queryAndApproveHeroForPvp = async (
  provider: Web3Provider
): Promise<boolean> => {
  try {
    const queryRes=await getPveAuthorize(provider)
    if (queryRes){
      return true
    } else {
      try {
        const approveRes=await pveAuthorize(provider)
        if (approveRes){
          return true
        } else {
          return false
        }

      } catch (error) {
        return false
      }


    }
  } catch (error) {
    return false
  }

}

/**
 * @description 报名参加
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const joinPvp = async (provider: Web3Provider, mapId:number, lv:number, tokenId:string): Promise<ContractReceipt> => {
  const pvpProvider = getPvp(provider)

  try {
    const res = await pvpProvider.Join( BigNumber.from(mapId), BigNumber.from(lv), BigNumber.from(tokenId))
    // return res
    return await res.wait()
  } catch (error) {
    console.error('pvpAbi异常', error)
    return Promise.reject(error)
  }

}

/**
 * @description 重新挑战
 * @param provider web3React Library
 * @returns Promise 事件
 */
export const onRematchAbi = async (provider: Web3Provider, joinId:string): Promise<ContractReceipt> => {
  const pvpProvider = getPvp(provider)

  try {
    const res = await pvpProvider.Join( joinId)
    // return res
    return await res.wait()
  } catch (error) {
    console.error('pvpAbi异常', error)
    return Promise.reject(error)
  }

}
/**
 * 获取pvp 取消此条pvp
  * @param provider web3React Library
 * @returns
 */
export const cancelPvpAbi = async (provider: Web3Provider, joinId:string, signature:string):Promise<ContractReceipt> => {
  const pvpProvider = getPvp(provider)
  try {
    const res = await pvpProvider.Cancel(joinId, signature)
    return await res.wait()
  } catch (error) {

    return Promise.reject(error)
  }
}


/**
 * 获取pvp 领取全部收益
  * @param provider web3React Library
 * @returns
 */
export const pvpClaimAllAbi = async (provider: Web3Provider, joinIds:string[], allDlt:number, allGold:number, signature:string):Promise<null> => {
  const pvpProvider = getPvp(provider)

  try {
    const res = await pvpProvider.claimAll(joinIds, allDlt, allGold, signature)
    return await res.wait()
  } catch (error) {
    return Promise.reject(error)
  }
}


// //取消
// //这里需要有服务端签名验证，可以取消才能取消
// function Cancel(uint joinId, bytes memory signature) public

// //结算
// function claimAll(uint[] calldata joinIds, uint allDlt, uint allGold, bytes memory signature) public
