import { getHeroImgData } from '@/utils/hero'
import { useEffect, useState } from 'react'
import styles from './tagInfo.less'
import { FormattedMessage } from 'umi'
import { awaitFun } from '@/utils/timeHelper'
import './animation.less'
const TagInfo: React.FC<{ type: string,count:number }> = ({ type,count }) => {
  const showTime = 10 //显示时间
  const awaitTime = 20 //间隔时间
  const isShowModel=true
  let timer: NodeJS.Timeout
  const occupation = type == 'hero' ? 1 : 6
  const heroImgData = getHeroImgData(1, occupation)
  const [isShow, setIsShow] = useState(false)
  let isStart=true
  useEffect(() => {
    init()
    return () => {
      clearTimer()
      isStart=false
    }
  }, [])
  /**
   * 清除计时器
   */
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
    }
  }
  const init=async() => {
    if(!isShowModel){
      if(type == 'hero'){
        await awaitFun(10 * 1000)
      
      }
      countDown() 
    }else{
      setIsShow(true)
    }
  
  }
  //倒计时
  const countDown = async () => {
    //防止内存泄漏
    if(!isStart) return
    setIsShow(true)
    await awaitFun(showTime * 1000)
    setIsShow(false)
    await awaitFun(awaitTime * 1000)
    countDown()

  }

  return     isShow?<div className={styles.tagInfo}
  
  // style={{

  //   animationFillMode:'forwards,forwards',
  //   animationName:'show,hide',
  //   animationDuration:'3s,3s',
  //   animationDelay:`0s,${showTime-3}s`,
  //   animationTimingFunction:'ease-in-out,ease-in-out',

  // }}
  >
  <img className={styles.heroHead} src={heroImgData.headImg} />
  <span>
    {occupation === 1 ? (
      <FormattedMessage id="home.tagInfo1" />
    ) : (
      <FormattedMessage id="home.tagInfo2" />
    )}
    {count}
  </span>
</div>:<></>
}
export default TagInfo
