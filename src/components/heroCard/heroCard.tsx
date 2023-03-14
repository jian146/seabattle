import { T_Hero } from '@/types/hero'
import { getHeroImgData } from '@/utils/hero'
import { FormattedMessage } from 'umi'
import MantleImg from '@/assets/images/hero/Mantle.png'
import styles from './heroCard.less'
import HeroLv from '../hero/heroLv'
interface I_heroCard {
  hero: T_Hero
}
const HeroCard: React.FC<I_heroCard> = ({ hero }) => {
  const heroImgData = getHeroImgData(hero.occupation, hero.color)
  const isPirate = hero.color === 6
  return (
    <div className={styles.heroCard}>
      {/* 职业 */}
      {/* <span className={styles.heroOccupation}>
        <FormattedMessage id={`${heroImgData.name}`} />
      </span> */}
      <div className={`${styles.occupationIcon} flexCenter`}>
        <img src={heroImgData.icon} />
      </div>
      {/* 等级 */}
      <HeroLv color={hero.color} level={hero.level} />

      {/* 图片 */}
      <div className={styles.heroImgBox}> <img className={styles.HeroImg} alt="heroImg" src={heroImgData.img} /></div>
     
      {/* 蒙层 */}
      {/* <img className={styles.MantleImg} alt="MantleImg" src={MantleImg} /> */}
      {/* 新蒙层 */}
      <div
        className={`${styles.Mantle} ${isPirate && styles.pirateMantle}`}
      ></div>

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
            <div className={styles.attrItem}>
              <FormattedMessage id={`sAgility`} />:
              {hero.agility ? hero.agility : '?'}
            </div>
          </div>
          <div className={styles.attrRow}>
            <div className={styles.attrItem}>
              <FormattedMessage id={`sMind`} />:{hero.mind ? hero.mind : '?'}
            </div>
            <div className={styles.attrItem}>
              <FormattedMessage id={`sIntelligence`} />:
              {hero.intelligence ? hero.intelligence : '?'}
            </div>
            <div className={styles.attrItem}>
              <FormattedMessage id={`sWill`} />:{hero.will ? hero.will : '?'}
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
    </div>
  )
}
export default HeroCard
