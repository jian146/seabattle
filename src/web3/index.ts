import { BigNumber, Contract, ethers } from 'ethers'
import {HERO_ABI} from '@/abis/hero'
import { Pve_ABI } from '@/abis/pve'
import { DLT_ABI } from '@/abis/dlt'
import { NB_ABI } from '@/abis/nb'
import { Presale_ABI } from '@/abis/presale'
import { Web3Provider } from '@ethersproject/providers'
import { JOB_ABI } from '@/abis/job'
import { MARKET_ABI } from '@/abis/market'
import { Key_ABI } from '@/abis/key'


import { Equip_ABI } from '@/abis/equip'

import { InjectedConnector } from '@web3-react/injected-connector'
import { NB_Pool_ABI } from '@/abis/nbPool'



const id = process.env.REACT_APP_CHAIN_ID
// 后台本地测试端口，用户测试
const localId = process.env.REACT_APP_LOCAL_CHAIN_ID
const chainId = id ? localId ? [parseInt(localId), parseInt(id)] : [parseInt(id)] : []

export const injected = new InjectedConnector({
  supportedChainIds: chainId
})
//--目前使用的合约
export const HERO_ADDRESS = process.env.REACT_APP_HERO_ADDR || ''
export const VC_ADDRESS = process.env.REACT_APP_VC_ADDR || ''
export const NB_Pool_ADDRESS = process.env.REACT_APP_VC_POOL_ADDR || ''
export const JOB_ADDRESS = process.env.REACT_APP_JOB_ADDR || ''


export const DLT_ADDRESS = process.env.REACT_APP_DLT_ADDR || ''
export const Presale_ADDR = process.env.REACT_APP_PRESALE_ADDR || ''




export const MARKET_ADDRESS = process.env.REACT_APP_MARKET_ADDR || ''
export const MARKET_EQUIP_ADDRESS = process.env.REACT_APP_MARKET_EQUIP_ADDR || ''
export const Pve_ADDRESS = process.env.REACT_APP_PVE_ADDR || ''

export const Key_ADDRESS = process.env.REACT_APP_KEY_ADDR || ''
export const DLTFarm_ADDRESS = process.env.REACT_APP_DLTFarm_ADDR || ''
export const LP_ADDRESS=process.env.REACT_APP_DLT_YTSD_LP || ''

export const Equip_ADDRESS= process.env.REACT_APP_EQUIP_ADDR || ''

export const getDlt = (provider: Web3Provider): Contract => (
  new ethers.Contract(DLT_ADDRESS, DLT_ABI, provider.getSigner())
)

export const getHero = (provider: Web3Provider): Contract => (
  
  new ethers.Contract(HERO_ADDRESS, HERO_ABI, provider.getSigner())
)

export const getPresale = (provider: Web3Provider): Contract => (
  new ethers.Contract(Presale_ADDR, Presale_ABI, provider.getSigner())
)

export const getVC = (provider: Web3Provider): Contract => (
  new ethers.Contract(VC_ADDRESS, NB_ABI, provider.getSigner())
)

export const getNBPool = (provider: Web3Provider): Contract => (
  new ethers.Contract(NB_Pool_ADDRESS, NB_Pool_ABI, provider.getSigner())
)

export const getJob = (provider: Web3Provider): Contract => (
  new ethers.Contract(JOB_ADDRESS, JOB_ABI, provider.getSigner())
)

export const getMarket = (provider: Web3Provider): Contract => (
  new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider.getSigner())
)


export const getPve= (provider: Web3Provider): Contract => (
  new ethers.Contract(Pve_ADDRESS, Pve_ABI, provider.getSigner())
)

export const getKey= (provider: Web3Provider): Contract => (
  new ethers.Contract(Key_ADDRESS, Key_ABI, provider.getSigner())
)

export const getLP= (provider: Web3Provider): Contract => (
  new ethers.Contract(LP_ADDRESS, NB_ABI, provider.getSigner())
)
export const getEquip= (provider: Web3Provider): Contract => (
  new ethers.Contract(Equip_ADDRESS, Equip_ABI, provider.getSigner())
)

export const getMyBNB=async (provider: Web3Provider,address:string): Promise<BigNumber> => {
  const bnb =provider.getBalance(address)
  return bnb

}
export const getMyVC=async (provider: Web3Provider,address:string): Promise<BigNumber> => {
  const vc =getVC(provider).balanceOf(address)
  return vc

}
type T_approvTarget='hero' | 'market'|'pve' |'key'|'equip'|'marketEquip'|'job'|'nb_pool'
const getAddressByTarge=(target:T_approvTarget)=>{
  let addr=HERO_ADDRESS
  if (target === 'hero' ){
    addr=HERO_ADDRESS
  }else if (target === 'job'){
    addr=JOB_ADDRESS
  } else if (target === 'market'){
    addr=MARKET_ADDRESS
  } else if (target === 'pve'){
    addr=Pve_ADDRESS
  } else if (target === 'nb_pool'){
    addr=NB_Pool_ADDRESS
  } else if (target === 'equip'){
    addr=Equip_ADDRESS
  } else if (target === 'marketEquip'){
    addr=MARKET_EQUIP_ADDRESS
  }  else {
    addr=HERO_ADDRESS
  }
  return addr
}

/**
 * @description 查询 dlt 授权
 * @param provider web3React Library
 * @param account 账户
 * @param target 授权对象
 * @returns Promise<ethers.BigNumber>
 */
export const queryApproveDLT = async (
  provider: Web3Provider,
  account: string,
  target: T_approvTarget= 'hero'
): Promise<ethers.BigNumber> => {
  const dlt = getDlt(provider)
  const addr = getAddressByTarge(target)
  const allowValue = await dlt.allowance(account, addr)
  return allowValue
}




/**
 * @description 授权 dlt
 * @param provider web3React Library
 * @param target 授权对象
 * @param amount 授权 BNB 的数量
 */
export const approveDLT = async (
  provider: Web3Provider,
  target: T_approvTarget = 'hero',
  amount: ethers.BigNumber = BigNumber.from(ethers.constants.MaxUint256),
) => {
  const dlt = getDlt(provider)
  const addr = getAddressByTarge(target)
  const tx= await dlt.approve(addr, amount)
  return await tx.wait()
}



/**
 * @description 查询vc 授权
 * @param provider web3React Library
 * @param account 账户
 * @returns Promise<ethers.BigNumber>
 */
export const queryApproveVC = async (provider: Web3Provider, account: string, target: T_approvTarget = 'hero'): Promise<ethers.BigNumber> => {
  const vc = getVC(provider)

  const addr = getAddressByTarge(target)
  try {
    return await vc.allowance(account, addr)
  } catch (error) {
    console.error('授权'+target+'金币失败', error)
    return Promise.reject(error)
  }

}
/**
 * @description 查询 vc 并授权
 * @param provider web3React Library
 * @param account 账户
 * @returns Promise<ethers.BigNumber>
 */
export const queryAndApprove = async (provider: Web3Provider, account: string, target: T_approvTarget = 'hero', type='VC'): Promise<boolean> => {

  try {
    let res
    if (type==='NB'||type==='VC'){
      res= await queryApproveVC(provider, account, target)
    } else {
      res= await queryApproveDLT(provider, account, target)
    }

    if (res.lte(ethers.utils.parseEther('1'))) {
      //未授权
      let backRes
      if (type==='NB'||type==='VC'){
        backRes= await approveVC(provider, target)
      }  else {
        backRes= await approveDLT(provider, target)
      }
      if (backRes){
        return true
      }
      return false
    } else {
      //已授权
      return true
    }

  } catch (error) {
    console.error('查询并授权'+(target+type==='NB'?'金币':'dlt')+'失败', error)
    return false
  }

}
/**
 * @description 授权金币
 * @param provider web3React Library
 * @param amount 授权 vc 的数量
 */
export const approveVC = async (
  provider: Web3Provider,
  target: T_approvTarget= 'hero',
  amount: ethers.BigNumber = BigNumber.from(ethers.constants.MaxUint256)
) => {
  const vc = getVC(provider)
  const addr = getAddressByTarge(target)
  const tx= await vc.approve(addr, amount)
  return await tx.wait()
}
/**
 * @description 授权lp给DltFarm
 * @param provider web3React Library
 * @param amount 授权 vc 的数量
 */
export const approveDltFarm= async (
  provider: Web3Provider,
  amount: ethers.BigNumber = BigNumber.from(ethers.constants.MaxUint256)
) => {
  const Lp = getLP(provider)
  const addr = DLTFarm_ADDRESS
  return await Lp.approve(addr, amount)

}

/**
 * @description 查询 LP 授权
 * @param provider web3React Library
 * @param account account
 */
export const queryLp= async (
  provider: Web3Provider,
  account: string
) => {
  const Lp = getLP(provider)
  return await Lp.allowance(account, DLTFarm_ADDRESS)
}


/**
 * @description 查询 dlt 授权
 * @param provider web3React Library
 * @param account 账户
 * @param target 授权对象
 * @returns Promise<ethers.BigNumber>
 */


/**
 * @description 查询 NFT 授权
 * @param provider web3React Library
 * @param account account
 */
export const queryApproveNft = async (
  provider: Web3Provider,
  account: string
): Promise<boolean> => {
  const hero = getHero(provider)
  return await hero.isApprovedForAll(account, MARKET_ADDRESS)
}

/**
 * @description 授权 NFT
 * @param provider web3React Library
 */
export const approveNtf = async (provider: Web3Provider) => {
  const hero = getHero(provider)
  await hero.setApprovalForAll(MARKET_ADDRESS, true)
}

export const checkDlt=async (provider: Web3Provider, c_dlt:number): Promise<boolean> => {
  return await comCheck(provider, c_dlt, 1)
}
export const checkNB=async (provider: Web3Provider, c_gold:number): Promise<boolean> => {
  return await comCheck(provider, c_gold, 2)
}

/**
 * glt和gold余额对比
 * @param provider 授权
 * @param checkPrice 要对比的价格
 * @param type 类别 1:Dlt  2:vc 
 * @returns 大小 ture为余额充足
 */
export const comCheck=async (provider: Web3Provider, checkPrice:number, type=1): Promise<boolean> => {
  try {
    const address =await provider.getSigner().getAddress()
    let providerObj
    if (type===1){
      providerObj=getDlt(provider)
    } else if (type===2){
      providerObj= getVC(provider)
    }  else {
      providerObj= getDlt(provider)
    }
    const priceBalance=await providerObj.balanceOf(address)
    const bignumber_checkPrice=ethers.utils.parseEther(`${checkPrice}`)
    return priceBalance.gte(bignumber_checkPrice)
  } catch (error) {
    console.error('检查数量'+checkPrice+'检查类型:'+type, ' 1:Dlt  2:vc' )
    return Promise.reject(error)
  }

}
export const getSigner=async (provider: Web3Provider, signerText:string)=>{
  // const equipProvider = getEquip(provider)
  const signer= provider.getSigner()
  const signature = await signer.signMessage(signerText)
  return signature
}