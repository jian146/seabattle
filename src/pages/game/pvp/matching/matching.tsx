import BackBtn from '@/components/backBtn/backBtn'
import { useState } from 'react'
import { FormattedMessage } from 'umi'
import leftImg from '@/assets/images/pvp/match/left.png'
import rightImg from '@/assets/images/pvp/match/right.png'

import styles from './matching.less'
import Button from '@/components/Button/button'
import { mockHero } from '../../card/card'
import { getHeroImgData, getTotal } from '@/utils/hero'
const Matching = () => {
  const [loading, setLoading] = useState(false)
  const [leftHero, setLeftHero] = useState(mockHero)
  const [rightHero, setRightHero] = useState(mockHero)
  const leftHeroImgData = getHeroImgData(leftHero.occupation, leftHero.color)
  const rightHeroImgData = getHeroImgData(
    rightHero?.occupation ?? 1,
    rightHero?.color ?? 1,
  )
  return (
    <div className={`${styles.page}`}>
      <div className="topRow">
        <BackBtn />
        <span>
          <FormattedMessage id={'home.pvp'} />
        </span>
      </div>
      <div className={`center ${styles.content}`}>
        <div className={styles.leftContent}>
          <img className={styles.leftImg} src={leftImg} />
          {leftHero&&<img className={styles.heroImg} src={leftHeroImgData.img} />}
          
          <div className={styles.leftAttr}>
            <div className={styles.heroName}>
              <span className={styles.heroOcc}>
                {leftHero ? (
                  <FormattedMessage id={`${leftHeroImgData.name}`} />
                ) : (
                  '--'
                )}
              </span>
              <span className={styles.heroLv}>
                {leftHero ? 'LV' + leftHero.level : '--'}
              </span>
            </div>
            <div className={styles.heroAttr}>
              <div className={styles.attrBox}>
                <div className={styles.attrRow} style={{ marginBottom: 5 }}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`strength`} />
                    <span className={styles.attrValue}>
                      {leftHero.strength}
                    </span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`stamina`} />
                    <span className={styles.attrValue}>{leftHero.stamina}</span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`agility`} />
                    <span className={styles.attrValue}>{leftHero.agility}</span>
                  </div>
                </div>
                <div className={styles.attrRow}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`mind`} />
                    <span className={styles.attrValue}>{leftHero.mind}</span>/
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`intelligence`} />
                    <span className={styles.attrValue}>
                      {leftHero.intelligence}
                    </span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`will`} />
                    <span className={styles.attrValue}>{leftHero.will}</span>
                  </div>
                </div>
              </div>
              <div className={styles.toatl}>
                <div className={styles.value}>
                  {leftHero ? getTotal(leftHero) : '--'}
                </div>
                <div className={styles.label}>
                  <FormattedMessage id={`totalAttributes`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.centerBox}>
          <div className={styles.centerTop}>
            {/* <FormattedMessage id={'home.pvp'} /> */}
            迷宫竞技场
          </div>
          <div className={styles.vs}>
            <span className={styles.v}>V</span>
            <span className={styles.s}>S</span>
          </div>
          <div className={styles.match}>
            <FormattedMessage id={'pvp.matching'} />{' '}
          </div>
          <Button>
            <FormattedMessage id={'pvp.unmatch'} />
          </Button>
        </div>
        <div className={styles.rightContent}>
          <img className={styles.rightImg} src={rightImg} />
          {rightHero&&<img className={styles.heroImg} src={rightHeroImgData.img} />}
          <div className={styles.rightAttr}>
            <div className={styles.heroName}>
            <span className={styles.heroLv}>
                {rightHero ? 'LV' + rightHero.level : '--'}
              </span>
              <span className={styles.heroOcc}>
                {rightHero ? (
                  <FormattedMessage id={`${rightHeroImgData.name}`} />
                ) : (
                  '--'
                )}
              </span>

            </div>
            <div className={styles.heroAttr}>

              <div className={styles.attrBox}>
                <div className={styles.attrRow} style={{ marginBottom: 5 }}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`strength`} />
                    <span className={styles.attrValue}>
                      {rightHero ? rightHero.strength : '--'}
                    </span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`stamina`} />
                    <span className={styles.attrValue}>
                      {rightHero ? rightHero.stamina : '--'}
                    </span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`agility`} />
                    <span className={styles.attrValue}>
                      {rightHero ? rightHero.agility : '--'}
                    </span>
                  </div>
                </div>
                <div className={styles.attrRow}>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`mind`} />
                    <span className={styles.attrValue}>
                      {rightHero ? rightHero.mind : '--'}
                    </span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`intelligence`} />
                    <span className={styles.attrValue}>
                      {rightHero ? rightHero.intelligence : '--'}
                    </span>
                    /
                  </div>
                  <div className={styles.attrItem}>
                    <FormattedMessage id={`will`} />
                    <span className={styles.attrValue}>
                      {rightHero ? rightHero.will : '--'}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.toatl}>
                <div className={styles.value}>
                  {rightHero ? getTotal(rightHero) : '--'}
                </div>
                <div className={styles.label}>
                  <FormattedMessage id={`totalAttributes`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Matching
