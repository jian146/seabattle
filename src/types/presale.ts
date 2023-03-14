/**
 * @description 公募的状态
 * @param Upcoming 未开始
 * @param SaleLive 正在公募
 * @param SaleEnded 公募结束
 * @param Claim 可以提币
 */
export enum SaleState {
  'Upcoming',
  'Sale Live',
  'Sale Ended',
  'Claim'
}

/**
 * @param Upcoming 未开始
 * @param SaleLive 正在公募
 * @param SaleEnded 公募结束
 * @param Claim 可以提币
 */
export type SaleStateType = keyof typeof SaleState
