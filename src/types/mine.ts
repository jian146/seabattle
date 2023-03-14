import { HeroType } from './hero'

/**
 * @description 挖矿地图名称
 * @param medicinal 采药
 * @param forging 锻造
 * @param enchanting 附魔
 * @param leather 制皮
 * @param parttime: 兼职工作
 * @param slmg 试炼迷宫
 * @param wrgc 瓦尔古城
 * @param tzzd 统治之殿
 * @param cqly 传奇领域
 */
export const enum WorkName {
  medicinal = 'medicinal',
  forging = 'forging',
  enchanting = 'enchanting',
  leather = 'leather',
  parttime = 'parttime',
  slmg = 'slmg',
  wrgc = 'wrgc',
  tzzd = 'tzzd',
  cqly = 'cqly'
}

/**
 * @description 工作英雄属性
 * @param blockN 开始区块
 * @param reward 收益
 */
export type WorkHeroType = HeroType & {
  blockN: string,
  reward: string,
}

/**
 * 挖矿地图
 */
export interface MineMapType extends Partial<Omit<HeroType, 'tokenId'|'will'>> {
  workHeroSize: number,
  // 地图名称
  name: WorkName,
  // 地图id
  mapId: number,
  // 图片地址
  img: string
  // 奖励
  reward: string[],
  // 限定中文
  cnLimit?: string,
  // 限定英文
  enLimit?: string,
  // 工作前面的图标
  delineation: string,
  // 状态
  state: 'pre' | 'started'
}
