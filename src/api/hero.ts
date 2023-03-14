import { T_Hero } from "@/types/hero";
import { axiosRequest } from "@/utils/request";
import {BigNumber} from 'ethers'

/**
 *  获取抽卡数据
 * @returns 获取抽卡数据,
 */
 export const buyCardApi = async (tradeId:string): Promise<T_Hero[]|null> => {
    const res = await axiosRequest({
      method: 'post',
      url: '/hero/buy',
      data:{tradeId}
    });
    if (res.status === 200) {
      return res.data;
    } else {
      return null;
    }
  };

  // upgradeNo: string
  // destoryHeroId?: string
  // sign: string
  // player: string
/**
 *  升级英雄
 * @returns 升级英雄,
 */
 export const upgradeApi = async (upgradeNo:string,destoryHeroId?:string): Promise<null|{success:boolean,heroInfo:T_Hero}> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/hero/upgrade',
    data:{upgradeNo,destoryHeroId}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};
  
/**
 *  转移英雄
 * @returns ,
 */
 export const transferHeroApi = async (ownerAddress:string,heroId:string,toAddress:string,sign:string): Promise<null|{success:boolean,heroInfo:T_Hero}> => {
  const res = await axiosRequest({
    method: 'post',
    url: '/hero//transfer',
    data:{ownerAddress,heroId,toAddress,sign}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};
/**
 *  获取我的英雄
 * @returns 获取抽卡数据,
 */
 export const getMyHeroApi = async (player:string): Promise<T_Hero[]> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/hero/list',
    params:{player}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return [];
  }
};

/**
 *  获取英雄详情
 * @returns 获取英雄详情,
 */
 export const getHeroInfoApi = async (heroId: string): Promise<T_Hero|null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/hero/info',
    params:{heroId}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};
/**
 *  获取英雄统计数量
 * @returns 获取英雄统计数量,
 */
 export const getHeroCountApi = async (): Promise<{normal_num:number,pirate_num:number}|null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/hero/stat ',
    params:{}
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};

export interface I_inviteInfo{
  inviteCount: BigNumber; //邀请人数
  inviteFee: BigNumber //已获得返佣
}
/**
 *  获取抽卡数据
 * @returns 获取抽卡数据,
 */
 export const getInviteInfoApi = async (player:string): Promise<I_inviteInfo|null> => {
  const res = await axiosRequest({
    method: 'get',
    url: '/hero/inviteInfo',
    params:{player}
 
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return null;
  }
};

