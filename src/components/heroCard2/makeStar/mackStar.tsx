import styles from './makeStar.less'
import { useEffect, useState } from 'react'
import { awaitFun } from '@/utils/timeHelper'

interface I_Round {
  size: number
  left: number
  top: number
  speedTime: number
  opacity:number
  delay:number
}
/**
 * 获取x和y之间随机数  ra  >=x   <=y
 * @param x
 * @param y
 */
export const getRoundNumber = (x: number, y: number) => {
  return Math.round(Math.random() * (y - x) + x)
}

const MakeStar: React.FC<{
  colorStyle: number
  position: 'top' | 'bottom'
}> = ({ colorStyle, position }) => {
  const [round, setRound] = useState<I_Round>()
  const config = {
    time: 120, //存在时间
    deleteSize: 15,
    minSize: 1,
    maxSize: 10,
    minGrowSize: 1,
    maxGrowSize: 3,
    minSpeedSize: 10, //每一步的大小
    maxSpeedSize: 50,
    minSpeedTime: 1500, //走每一步的时间
    maxSpeedTime: 4000,
    minDelay:0,
    maxDelay:1500,
    bottom: {
      startPosition: 'bottom',
      minTop: 600, //出生点
      maxTop: 800,
      minLeft: 15,
      maxLeft: 120,
      hideTop: 25,
    },
    top: {
      startPosition: 'top', //移动方向
      minTop: 125, //出生点
      maxTop: 25,
      minLeft: 15,
      maxLeft: 120,
      hideTop: 750,
    },
  }
  useEffect(() => {
    makeRound()
  }, [])
  const makeRound = () => {
    let newRoundList: I_Round[] = []
    const size = getRoundNumber(config.minSize, config.maxSize)
    let initLeft = getRoundNumber(
      config[position].minLeft,
      config[position].maxLeft,
    )
    let initTop = getRoundNumber(
      config[position].minTop,
      config[position].maxTop,
    )

    const speedTime = getRoundNumber(config.minSpeedTime, config.maxSpeedTime)
    const delay = getRoundNumber(config.minDelay, config.maxDelay)
  
    newRoundList.push({
      size: size,
      top: initTop,
      left: initLeft,
      speedTime: speedTime,
      opacity:1,
      delay:delay
      
    })
    newRoundList.push({
      size: size,
      top: config[position].maxTop,
      left: initLeft,
      speedTime: speedTime,
      opacity:0,
      delay:delay,
    })
    // for (let i = 0; i < config.time; i++) {
    //     if(position=='top'&&initTop<config[position].hideTop){
    //         newRoundList.push({
    //             size:size,
    //             top: initTop,
    //             left: initLeft,
    //             speedTime:speedTime
    //           })
    //           initTop+=(!topIsAdd ? spendTop : -1 * spendTop)
    //     }else if(position=='bottom'&&initTop>config[position].hideTop){
    //         newRoundList.push({
    //             size:size,
    //             top: initTop,
    //             left: initLeft,
    //             speedTime:speedTime
    //           })
    //           initTop+=(!topIsAdd ? spendTop : -1 * spendTop)
    //     }else{
    //         break;
    //     }

    // }
    console.log('newRoundList1', newRoundList)
    initDom(newRoundList)
  }

  const initDom = async (roundList: I_Round[]) => {
    //执行动画效果
    const upDateDom = async (dataList: I_Round[], index: number) => {
      if (index < dataList.length) {
        setRound(undefined)
        setRound({ ...dataList[index] })
        setTimeout(() => {
          upDateDom(dataList, index + 1)
        }, 500)
      } else {
        // makeRound()
        // await awaitFun(10000+dataList[0].delay)
        // makeRound()
      }
    }
    upDateDom(roundList, 0)
  }

  return (
    <div
      className={`${styles.flowerItem} ${styles['colorStyle' + colorStyle]}`}
      style={{
        width: round?.size,
        height: round?.size,
        top: round?.top,
        left: round?.left,
        opacity:round?.opacity,
        // transitionDelay:round?.delay+'s'
        // transitionDuration:round?.speedTime+'s',


      }}
    ></div>
  )
}
export default MakeStar
