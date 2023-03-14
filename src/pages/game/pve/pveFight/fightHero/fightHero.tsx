import styles from './fightHero.less'
import { T_Hero } from '../../../../../types/hero'
import { I_pveHeroType, t_renderInfo, t_roundHero } from '../pveFight'
import { I_HeroEquip } from '@/pages/game/heroInfo/heroInfo'
import { mockHero } from '@/pages/game/card/card'
import { getHeroImgData } from '../../../../../utils/hero'
import { FormattedMessage } from 'umi'
import './animation.less'
import { getMonsterData, I_monsterConfigData } from '../../monstersConfig'
export interface I_HeroBox {
  position: 'left' | 'right'

  roundHero?: t_roundHero
  hero?: I_pveHeroType
  roundInfo?: t_renderInfo
  heroAttr: I_HeroEquip
}

const FightHero = (props: I_HeroBox) => {
  const {
    position = 'left',
    hero = {
      color: 1,
      occupation: 0,
      agility: 0,
      strength: 0,
      will: 0,
      intelligence: 0,
      mind: 0,
      stamina: 0,
      level: 1,
      totalHp: 100,
    },
    roundHero,
    roundInfo,
    heroAttr,
  } = props
  const heroImgData = getHeroImgData(hero.occupation, hero.color)
  const monsterData =
    roundInfo?.rightHero.hero.name &&
    getMonsterData(roundInfo.rightHero.hero.name)
  //怪物图片
  const monsterImg = (monsterData as I_monsterConfigData)?.img ?? ''
  //怪物头像
  const monsterHeadImg = (monsterData as I_monsterConfigData)?.headImg ?? ''
  const getHeroAnimation = (): string => {
    if (!!roundInfo) {
      if (roundInfo.type === 'attack') {
        //攻击动画
        return roundInfo.attackedPosition !== position
          ? `heroImgHurt_${position as string} 0.5s 1 linear `
          : ''
      } else if (roundInfo.type === 'die') {
        //死亡动画
        return 'right' === position
          ? `heroImgDie_${position as string} 1s 1 linear `
          : ''
      }
    }
    return ''
  }
  return (
    <div className={styles.fightHero}>
      <div className={styles.hurtText}>
        {/* <div className={styles.hurt}>-44</div> */}
        {position === roundInfo?.attackedPosition &&
          roundInfo &&
          roundInfo.type !== 'onStage' && (
            <span className="hurtShowText">
              {roundInfo && roundInfo?.hurtValue === 0 ? (
                <div className={styles.miss}>Miss</div>
              ) : (
                <div className={styles.hurt}>-{roundInfo?.hurtValue}</div>
              )}
            </span>
          )}
      </div>
      {roundInfo && (
        <img
          className={`${styles.heroImg} ${
            position === 'right' && styles.rightHero
          }`}
          alt=""
          style={{
            animation: getHeroAnimation(),
          }}
          src={position === 'left' ? heroImgData.img : monsterImg}
        />
      )}

      <div className={`${styles.heroHead}  ${styles[position + 'heroHead']}`}>
        {roundInfo && (
          <img
            alt=""
            className={`${styles.headImg} ${
              position === 'right' && styles.rotateY
            }`}
            src={position === 'left' ? heroImgData.headImg : monsterHeadImg}
          />
        )}

        <div>
          <div className={styles.headName}>
            {position === 'left' ? (
              <FormattedMessage id={`${heroImgData.name}`} />
            ) : (
              roundHero?.name
            )}
          </div>
          <div className={styles.hpMax}>
            <div
              className={styles.hp}
              style={{
                width:
                  (roundHero ? (roundHero.hp / roundHero.totalHp) * 100 : 100) +
                  '%',
                transition: 'width .3s linear',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FightHero
