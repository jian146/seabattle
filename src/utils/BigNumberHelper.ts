import { BigNumber, ethers } from "ethers"

export const BignumerToString=(number:BigNumber)=>{
    return ethers.utils.formatEther(number)
    
}
/**
 * bignumber字符串转成字符串
 * @param string 
 * @returns 
 */
export const stringToBigNumberString=(string:string)=>{
return ethers.utils.formatEther(string)
}
export const stringToBignumer=(string:string)=>{
    return ethers.utils.parseEther(string)
}
export const BignumerToNumber=(number:BigNumber)=>{
    return parseFloat(BignumerToString(number))
}
export const bigNumberStringToFloat=(string:string) => {

  return  parseFloat (stringToBigNumberString(string))
}