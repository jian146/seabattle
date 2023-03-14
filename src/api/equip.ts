import { I_HeroEquip } from "@/pages/game/heroInfo/heroInfo"
import { axiosRequest } from "@/utils/request"

/**
 * 查看装备信息
 * @param heroId
 * @returns
 */
 export const queryHeroEquipApi=async ( heroId:string,): Promise<I_HeroEquip|null> => {
    const errorData=null
    try {
      const res = await axiosRequest({
        method: 'get',
        url: '/hero/queryHeroEquip',
        params: {
          heroId
        }
      })
      if (res.status === 200) {
        return res.data
      } else {
        return errorData
      }
    } catch (error) {
      console.error('获取我的装备失败')
      return errorData
    }
  
  }