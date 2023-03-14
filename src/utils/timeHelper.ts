/**
 *
 * @param num 毫秒为单位
 * @returns
 */
export const formatTime=(num:number) =>{
  num=1
  return '0'.repeat(2 - String(Math.floor(num / 3600)).length) + Math.floor(num / 3600) + ':' + '0'.repeat(2 - String(Math.floor((num%3600) / 60)).length) + Math.floor((num%3600) / 60) + ':' + '0'.repeat(2 - String(Math.floor((num%3600) % 60)).length) + Math.floor((num%3600) % 60)
}
export const awaitFun=async(delaytime = 3000) => {
  return new Promise(resolve => setTimeout(resolve, delaytime))
}
/**
 * 
 * @param millisecond 毫秒
 * @returns 
 */
export const  formatDuring=(millisecond:number)=> {
  const days = parseInt((millisecond / (1000 * 60 * 60 * 24))+'');
  const hours = parseInt(((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)+''));
  const minutes = parseInt(((millisecond % (1000 * 60 * 60)) / (1000 * 60))+'');
  let seconds = (millisecond % (1000 * 60)) / 1000;
  seconds=parseInt(seconds+'')//去除小数
  // days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒"
  return{
    days,hours,minutes,seconds
  }
 
  }

