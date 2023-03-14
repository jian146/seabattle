import { I_Equip } from "@/pages/game/heroInfo/heroInfo"
import { I_BattleLog } from "@/pages/game/pve/pveFight/logModel/logModel"
import { axiosRequest } from "@/utils/request"
import { BigNumber } from "ethers"

/**
 * 获取pve数据
 * @param battleId 战斗id
 * @returns pve数据,
 */
 export const getBattleInfoApi = async (battleId: string) => {
    const res = await axiosRequest({
      method: 'get',
      url: `/pve/battleInfo?battleId=${battleId}`
    })
    if (res.status === 200) {
      return res.data
    }
  
  }

  /**
 * 获取pve 战斗记录
 * @param playerAddress 战斗id
 * @returns pve数据,
 */
export const getBattleLogListApi = async (playerAddress: string): Promise<I_BattleLog[]> => {
  const res = await axiosRequest({
    method: 'get',
    url: `/pve/battleList?player=${playerAddress}`
  })
  if (res.status === 200) {
    return res.data
  } else {
    return []
  }
}

/**
 * 获取pve 获取全部收益
 * @param playerAddress 玩家id
 * @returns pve数据,
 */
 export const getClaimObjectsApi = async (playerAddress: string): Promise<{  allGold: number, coldTime:number, equips:I_Equip[] }> => {
  const res = await axiosRequest({
    method: 'get',
    url: `/pve/getClaimObjects?player=${playerAddress}`
  })
  if (res.status === 200) {
    return res.data
  } else {
    return {
      allGold: 0,
      coldTime: 0,
      equips: []
    }
  }
}

export interface I_claimAllApi {
  allDlts: BigNumber,
  allGolds: BigNumber,
  battleIds: number[],
  sig: string,
  // equips:BigNumber[]
}
/**
 * 获取pve 领取收益
 * @param playerAddress 战斗id
 * @returns pve数据,
 */
 export const claimAllApi = async (playerAddress: string): Promise<I_claimAllApi> => {
  const res = await axiosRequest({
    method: 'get',
    url: `/pve/claimAll?player=${playerAddress}`
  })

  if (res.status === 200) {
    // const bigNumberArr=(res.data.equips as string[]).map((item)=>{
    //   return BigNumber.from(item)
    // })

    return {...res.data,
      // allDlts: BigNumber.from(res.data.allDlts),
      allGolds: BigNumber.from(res.data.allGolds),
      // equips: bigNumberArr
    }
  } else {
    return {
      allDlts: BigNumber.from('0'),
      allGolds: BigNumber.from('0'),
      battleIds: [],
      sig: '',
      // equips: []
    }
  }
}