import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { getPresale } from '.'

/**
 * @description 查询状态
 * @param provider web3React Library
 * @returns Promise<number>
 */
export const getPresaleStatus = async (provider: Web3Provider): Promise<number> => {
  const presale = getPresale(provider)
  return await presale.status()
}

/**
 * @description 获取参与公募的人数
 * @param provider web3React Library
 * @returns Promise<ethers.BigNumber>
 */
export const getPresalePeoNum = async (provider: Web3Provider): Promise<ethers.BigNumber> => {
  const presale = getPresale(provider)
  return await presale.contributorsSize()
}

/**
 * @description 获取所有人购买的 BNB 数量
 * @param provider web3React Library
 * @returns Promise<ethers.BigNumber>
 */
export const saledBNB = async (provider: Web3Provider): Promise<ethers.BigNumber> => {
  const presale = getPresale(provider)
  return await presale.saledBNB()
}

/**
 * @description 购买公募BNB
 * @param provider web3React Library
 * @param num 购买的数量
 */
export const buy = async (provider: Web3Provider, num: string) => {
  const presale = getPresale(provider)
  const value = ethers.utils.parseEther(num)
  const tx = await presale.buy({ value })
  return await tx.wait()
}

/**
 * @description 提取 BNB
 * @param provider web3React Library
 */
export const claim = async (provider: Web3Provider) => {
  const presale = getPresale(provider)
  const tx = await presale.claim()
  return await tx.wait()
}

/**
 * @description 获取购买的总数量
 * @param provider web3React Library
 * @param account 账户
 * @returns Promise<ethers.BigNumber>
 */
export const buys = async (provider: Web3Provider, account: string): Promise<ethers.BigNumber> => {
  const presale = getPresale(provider)
  return await presale.buys(account)
}
