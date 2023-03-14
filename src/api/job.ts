import { HeroColor, T_Hero } from "@/types/hero";
import { axiosRequest } from "@/utils/request";

/**
 *  获取工作中英雄详情
 * @returns 获取工作中英雄详情,
 */
 export const getJobHeroInfoApi = async (jobId: number): Promise<I_JobInfo|null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/job/info',
    params:{ jobId}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};
/**
 *  开始打工
 * @returns 获取抽卡数据,
 */
export const startJobApi = async (heroId: string, player: string, sign: string,isPirate=false): Promise<{ jobId: number, success: boolean } | null> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/job/startJob',
    data: { heroId, player, sign,
      isPirate: isPirate?1:0
     }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};


/**
*  结束打工
* @returns 获取抽卡数据,
*/
export const endJobApi = async (jobId: number, player: string, sign: string): Promise<any> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/job/endJob',
    data: { jobId, player, sign }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return [];
  }
};

/**
*  收菜
* @returns 收菜,
*/
export const harvestJobApi = async (jobId: number, player: string, sign: string): Promise<any> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/job/harvestJob',
    data: { jobId, player, sign }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return [];
  }
};

/**
*  一键收菜
#### 签名格式 
endAllJob:${player}:${signNumber}
* @returns 一键收菜,
*/
export const harvestAllJobApi = async ( player: string, sign: string,isPirate=false): Promise<{success:boolean}|null> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/job/harvestAll',
    data: {  player, sign, isPirate: isPirate?1:0 }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};

/**
*  一键退出
#### 签名格式 
harvestAll:${player}:${signNumber}
* @returns 一键退出,
*/
export const endAllJobApi = async ( player: string, sign: string): Promise<{success:boolean}|null> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/job/endAllJob',
    data: {  player, sign }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};
export interface I_JobInfo {
  jobId: number
  heroId: string
  heroLv: number
  reward:string
  heroColor: HeroColor
  time: number
  owner: string
  finished: boolean
  heroInfo:T_Hero
}
/**
*  获取我的工作英雄列表
* @returns 获取我的工作英雄列表,
*/
export const getMyJobsApi = async (player: string,isPirate=false): Promise<I_JobInfo[] | null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/job/myJobs',
    params: { player, isPirate: isPirate?1:0 }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};
/**
*  获取可领取的收益
* @returns 获取可领取的收益,
*/
export const getClaimRewardApi = async (player: string,isPirate=false): Promise<{
  lastReward: string, sig: string, totalrewards: string
} | null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/job/claimReward',
    params: { player, isPirate: isPirate?1:0 }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};

/**
*  获取服务器签名
* @returns 获取抽卡数据,
*/
export const getSignJobApi = async (player: string): Promise<{ sign: number } | null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/job/getSignKey',
    params: { player }
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};

/**
 *  获取海盗船可领取分红
 * @returns 获取海盗船可领取分红,
 */
 export const getpirateshipTotalRewardsApi = async (player: string): Promise<{
   pirateshipTotalRewards:string,
   totalRewardClaimed:string
   yourWeight:number
   totalWeight:number
  }|null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/job/stat',
    params:{player}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};