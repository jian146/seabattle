import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { getJob } from '.'
import { errorLog } from '../utils/log';








/**
 * @description 提取工作收益
 * @param provider web3React Library
 * @param tokenId 英雄的tokenId
 * @returns Pormise<BigNumber>
 */
export const claimRewardAbi = async (
  provider: Web3Provider,
  totalrewards:BigNumber,
  signature: string,
  isPirate=false
) => {
  try {
    const job = getJob(provider)
    const tx =isPirate?  await job.claimRewardForPirateShip(totalrewards,signature):await job.claimReward(totalrewards,signature)
    return tx.wait()
  } catch (error) {
    errorLog('abi领取收益',error)
    return null
  }

}












