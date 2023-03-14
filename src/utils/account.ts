import { Web3Provider } from '@ethersproject/providers'
import {history} from 'umi'
/**
 * @description 简化 tokenId 显示
 * @param tokeId tokenId
 * @returns string
 */
 export const subTokenId = (tokeId: string, point = 4,count=4) => {
     let str='*'
     for (let i = 0; i < count; i++) {
        str+='*'
     }
    return `${tokeId.substring(0, point)}${str}${tokeId.substring(tokeId.length - point)}`

 }
 export const checkAccount=async (account:string|undefined|null,library:Web3Provider ) => {
    if(!account&&library){
      const myAddress =await library.getSigner().getAddress()
      if(myAddress){
         
         // history.push('/home')
      }
       
    }

 }