import { ethers } from 'ethers'

type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * 英雄属性
 */
export const enum HeroAttrList {
  strength = 'strength',
  agility = 'agility',
  stamina = 'stamina',
  will = 'will',
  intelligence = 'intelligence',
  mind = 'mind'
}


/**
 * @description 英雄类型
 */
export interface HeroType extends Mutable<{ [key in keyof typeof HeroAttrList]: number }> {
  occupation: number,
  tokenId: string,
  level: number,
  fatigue: number,
  total: number,
  newbie: boolean,
  totalProperty?: number
}
export type pve_heroType=HeroType&{pveCount:number}
/**
 * @description 售卖类型
 */
export type SaleType = {
  price: string
  onSell: boolean
  sellNo: ethers.BigNumber
  soldTime: ethers.BigNumber
}
/**
 * 市场类型
 */
export type marketType = {
  buyer?: string
  seller?:string

}

export type HeroWithPriceTypeWithMarket= HeroType & SaleType &marketType

/**
 * @description 带价格的英雄类型
 */
export type HeroWithPriceType = HeroType & SaleType



/**
 * @description 英雄升级等级信息
 * @param gold 金币
 * @param dlt dlt
 * @param successRate 成功率
 * @param income 收益倍率
 */
export type UpgradeType = {
  gold: number,
  dlt: number,
  successRate: string,
  income: number
}

/**
 * 升级类型
 */
export type LevelType = 'lv2' | 'lv3' | 'lv4' | 'lv5' | 'lv6' | 'lv7' | 'lv8'
  | 'lv9' | 'lv10' | 'lv11' | 'lv12'


//英雄属性
// - 白绿蓝紫橙是英雄生产卡，有战斗数值，可以生产及PVP；                
// - 海盗卡，没有战斗数值，不能生产及PVP，但是可以抽税分红。                

export  enum HeroColor {
  White = 1,//
  Green,//2
  Blue,//3
  Purple,//4紫色
  Orange,//5橙色
  Red //6海盗卡
}

export enum Occupation {
  Warrior = 1,
  Mage,
  Hunter,
  Assassin
}

export type T_BaseProperty = {
  //力量
  strength: number
  //敏捷
  agility: number
  //体力    
  stamina: number
  //意志     
  will: number
  //智力     
  intelligence: number
  //精神
  mind: number
}


export type T_Hero = {
  tokenId: string
  level: number
  jobLastTime:number//寿命
  jobTimes:number//工作时长
  owner:string
  //出生日期,用于推算60天寿命
  bornTime: number

  color: HeroColor
  occupation: Occupation

} & T_BaseProperty

