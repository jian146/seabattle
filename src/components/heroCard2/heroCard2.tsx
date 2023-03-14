import { T_Hero } from '@/types/hero'
import { getHeroImgData } from '@/utils/hero'
import { FormattedMessage } from 'umi'

import styles from './heroCard2.less'
import { getRoundNumber } from './makeStar/mackStar'

interface I_heroCard {
  hero: T_Hero
  index: number
}
const HeroCard2: React.FC<I_heroCard> = ({ hero, index }) => {
  const heroImgData = getHeroImgData(hero.occupation, hero.color)
  const isPirate = hero.color === 6
  const bgColorClassName = styles['color' + hero.color]
  const bgMaskColorClassName = styles['colorMask' + hero.color]
  const colorSuppClassName = styles['colorSupp' + hero.color]
  const starColorClassName=styles['starColor' + hero.color]
  const starConfig={
    minSize: 1,
    maxSize: 10,
    minLeft: 15,
    maxLeft: 120,
  }
  const boxStyle = {
    '--i': index,
  }
  const topStarClass= `${styles.starTop} ${starColorClassName} ${styles.star}`
  const bottomStarClass= `${styles.starBottom} ${starColorClassName} ${styles.star}`
  const starList = [
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:topStarClass,
    },
    {
      className:bottomStarClass,
    },
    {
      className:bottomStarClass,
    },
    {
      className:bottomStarClass,
    },
    {
      className:bottomStarClass,
    },
    {
      className:bottomStarClass,
    },
    {
      className:bottomStarClass,
    },
    {
      className:bottomStarClass,
    },
  ]
  return (
    <div
      className={styles.heroCard}
      style={{ ...(boxStyle as React.CSSProperties) }}
    >
      {/* 稀有角色的光 */}
      <div className={`${styles.colorSupp} ${colorSuppClassName}`}>
        {starList.map((starItem, starIndex) => {
          const delay=getRoundNumber(0, 3000)/1000
          const blur=getRoundNumber(2, 20)/10
          const time=getRoundNumber(200,400)/100
          const starStyle={
            '--starIndex':starIndex,
            '--delay':delay,
            '--blur':blur,
            '--time':time,
          }
          const size=getRoundNumber(starConfig.minSize, starConfig.maxSize)
          const left=getRoundNumber(starConfig.minLeft, starConfig.maxLeft)
         
          return (
            <div
              className={starItem.className}
              key={starIndex}
              style={{
                width: size,
                height: size,
                left: left,
              ...(starStyle as React.CSSProperties)
              }}
            ></div>
          )
        })}
      </div>
      {/* 四个纯色背景的顶角 */}
      <div className={`${styles.leftTop} ${bgColorClassName}`}></div>
      <div className={`${styles.rightTop} ${bgColorClassName}`}></div>
      <div className={`${styles.leftBottom} ${bgColorClassName}`}></div>
      <div className={`${styles.rightBottom} ${bgColorClassName}`}></div>

      <div
        className={`${styles.heroImgBox} ${styles.bgColor} ${bgColorClassName}`}
      >
        {/* 图片 */}
        <img className={styles.HeroImg} alt="heroImg" src={heroImgData.img} />
        {/* 第一层蒙层--带渐变 */}
        <div className={`${styles.task1} ${bgMaskColorClassName}`}>
          <div className={`${styles.bg1} ${bgMaskColorClassName}`}></div>
          <div className={`${styles.bg2} ${bgColorClassName}`}></div>
          <div className={styles.info}>
            {!isPirate ? (
              <div className={styles.attrBox}>
                {/* 属性 */}
                <div className={styles.attrRow} style={{ marginBottom: 10 }}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`sStrength`} />:
                    {hero.strength ? hero.strength : '?'}
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`sStamina`} />:
                    {hero.stamina ? hero.stamina : '?'}
                  </div>
                </div>
                <div className={styles.attrRow} style={{ marginBottom: 10 }}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`sAgility`} />:
                    {hero.agility ? hero.agility : '?'}
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`sMind`} />:
                    {hero.mind ? hero.mind : '?'}
                  </div>
                </div>

                <div className={styles.attrRow}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`sIntelligence`} />:
                    {hero.intelligence ? hero.intelligence : '?'}
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`sWill`} />:
                    {hero.will ? hero.will : '?'}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.description}>
                <FormattedMessage id={`pirateDesc1`} />
                <span className={styles.lightingColor}>
                  <FormattedMessage id={`pirateDesc2`} />
                </span>
                <FormattedMessage id={`pirateDesc3`} />
              </div>
            )}
            <img className={styles.drawIcon} src={heroImgData.drawIcon} />
          </div>
        </div>
        {/* 第一层蒙层--底部蒙层 */}
      </div>
      <div className={styles.bottomTask}>
        <div className={`${styles.leftBottom} ${styles.bottomTaskColor}`}></div>
        <div
          className={`${styles.rightBottom} ${styles.bottomTaskColor}`}
        ></div>
      </div>
    </div>
  )
}
export default HeroCard2
