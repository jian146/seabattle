import BackBtn from '@/components/backBtn/backBtn'
import { FormattedMessage, getLocale, useIntl } from 'umi'
import styles from './pveFight.less'
import { T_Hero } from '../../../../types/hero'
import { I_Equip, I_HeroEquip } from '../../heroInfo/heroInfo'
import { useRef, useState, useEffect, useMemo } from 'react'

import FightHero from './fightHero/fightHero'
import { getBattleInfoApi } from '@/api/pve'
import { message, notification } from 'antd'
import { getMonsterData, imgMap, I_monsterConfigData } from '../monstersConfig'

import { queryHeroEquipApi } from '@/api/equip'
import PveResultModal from './pveResultModal/pveResultModal'
import { getHeroImgData, heroOccupationsList } from '../../../../utils/hero';

export interface I_Pve {
  battleId: string
  selectHero?: T_Hero
  backCall?:()=>void
}
export type I_pveHeroType = {
  name?: string
  id: number
  agility: number
  intelligence: number
  mind: number
  stamina: number
  strength: number
  will: number
  color:number
  occupation: number
  level: number
  totalHp: number
  imgUrl?: string
  isBoss?: boolean
  bossIcon?: string
}
export type t_roundHero = {
  name: string
  hp: number
  totalHp: number
  occupation: number
  level: number
  hero: I_pveHeroType
  imgUrl?: string
}
export type t_renderInfo = {
  tagertA: string
  targetB: string
  round: number
  hurtValue: number
  attackedPosition: 'left' | 'right' | ''
  leftHero: t_roundHero
  rightHero: t_roundHero
  gold: number
  dlt: number
  info: string
  type: 'attack' | 'die' | 'onStage'
  equip: I_Equip[]
  priorityAttack: 'left' | 'right'
}
const initHeroAttr: I_HeroEquip = {
  strength: 0,
  agility: 0,
  stamina: 0,
  will: 0,
  intelligence: 0,
  mind: 0,
  //
  occupation: 0,
  tokenId: '',
  level: 1,
  jobLastTime: 0,
  jobTimes: 0,
  owner: '',
  bornTime: 0,
  color: 1,
  //物攻
  DMG: 0,
  MAG: 0,
  //生命
  HP: 0,
  //物防
  DEF: 0,
  //法防
  RES: 0,
  equips: [],
}
const PveFight = (props: I_Pve) => {
  const { selectHero, battleId,backCall=()=>{} } = props
  const { formatMessage } = useIntl()
  const attackAudioRef: any = useRef(null)
  const missAudioRef: any = useRef(null)
  const [heroAttr, setHeroAttr] = useState<I_HeroEquip>(initHeroAttr)
  //获取英雄血量
  const getTotalHp = (hero: T_Hero | I_pveHeroType) => {
    return 5 * hero.stamina * (1 + 0.2 * (hero.level - 1))
  }

  const [playerHero,setPlayerHero]=useState<I_pveHeroType>({
    totalHp: heroAttr.HP,
    color:selectHero?.color??1,
    id: 0,
    occupation: selectHero ? selectHero.occupation : 0,
    level: heroAttr.level,
    strength: heroAttr.strength,
    agility: heroAttr.agility,
    stamina: heroAttr.stamina,
    will: heroAttr.will,
    intelligence: heroAttr.intelligence,
    mind: heroAttr.mind,
  }) 

  const [round, setRound] = useState<t_renderInfo | undefined>(undefined)

  //结果最终收益
  const [allProfit, setAllProfit] = useState({
    gold: 0,
    dlt: 0,
    type: 'fail' as 'win' | 'fail',
    equipList: [] as I_Equip[],
  })
  const [isShowResult, setIsShowResult] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initData()
  }, [])

  const initData = async (isMock = false, isTest = false) => {
    setLoading(true)
    const heroAttrRes = await getHeroEquipList()

    try {
      //怪物列表
      const { prepareInfo, rounds, settle, error } = await getBattleData(
        battleId,
      )

      renderRoundData(prepareInfo, rounds, settle, heroAttrRes)
    } catch (error) {
      setLoading(false)
      notification.error({
        message: 'Error',
        description: (error as Error).message,
        duration: 2,
      })
    }
  }

  const getHeroEquipList = async () => {
    if (!selectHero) return

    // setHeroEquipList([])
    const res = await queryHeroEquipApi(selectHero.tokenId)
    if (res) {
      setHeroAttr(res)
      return res
    }
  }
  //获取对战数据
  const getBattleData = async (battleId: string) => {
    const apiRes = await getBattleInfoApi(battleId)
    return apiRes
  }
  //渲染回合数据
  const renderRoundData = (
    prepareInfo: any,
    rounds: (number | boolean)[][],
    settle: {
      allDlt: number
      allGold: number
      win: boolean
      winEquips: I_Equip[]
    },
    heroAttrRes = heroAttr,
  ) => {
    if (!prepareInfo || !rounds || !settle) {
      message.error(formatMessage({ id: 'pve.FailedToGetData' }))
      setLoading(false)
      return []
    }
    const monsterHeroList: I_pveHeroType[] = Array.from(
      prepareInfo.monsters,
      (item: I_pveHeroType) => {
        const monsterData = getMonsterData(item.name as string)
        item.name =
          getLocale() === 'en-US'
            ? (monsterData as I_monsterConfigData)?.enName ?? ''
            : item.name

        //是否是boss

        item.isBoss = (monsterData as I_monsterConfigData)?.isBoss ?? false
        item.bossIcon = (monsterData as I_monsterConfigData)?.isBoss
          ? (monsterData as I_monsterConfigData).bossIcon
          : ''

        return item
      },
    )
    const roundList: t_renderInfo[] = []
    const newHero={...playerHero,color:prepareInfo.hero.color,level:prepareInfo.hero.level,occupation:prepareInfo.hero.occupation}
    setPlayerHero({...newHero})

    rounds.map((roundItem: (number | boolean | string[])[], index: number) => {
      //回合数0
      const roundCount: number = roundItem[0] as number
      //怪物
      const monster = monsterHeroList[roundCount - 1]
      //回合数
      const isAttack = roundItem[1] as boolean
      //伤害  DMG 物理伤害:2,  MAG 魔法伤害:3,HP1
      const hurtValue = (roundItem[2] as number) + (roundItem[3] as number)
      //英雄血量:4
      const heroHp = roundItem[4] as number
      //英雄最大血量
      const heroMaxHp = prepareInfo.hero.hp ?? heroAttrRes.HP
      //英雄职业
      const heroOccupation= getHeroImgData(newHero.occupation, newHero.color)
      //怪物血量:5
      const monsterHp = roundItem[5] as number
      const gold = roundItem[6] as number
      const dlt = roundItem[7] as number
      const monsterTotalHp = getTotalHp(monster)

      //优先攻击标志---第一回合判断
      let priorityAttack: 'left' | 'right' = isAttack ? 'left' : 'right'
      //8 掉落列表
      const renderEquip: I_Equip[] = []
      settle.winEquips.forEach((item) => {
        if ((roundItem[8] as string[]).indexOf(item.tokenId) >= 0) {
          renderEquip.push(item)
        }
        // (roundItem[8] as string[]).indexOf(item.tokenId)>=0?renderEquip.push(item):null
      })
      //日志中怪物名称
      const getLogName = (name: string | undefined) => {
        if (name) {
          return getLocale() === 'en-US'
            ? name?.split('(')[0].split('（')[0]
            : name
        }
        return ''
      }
      //回合数据
      const newRound: t_renderInfo = {
        tagertA: isAttack
          ? formatMessage({
              id: `${heroOccupation.name}`,
            })
          : getLogName(monster.name) ?? 'pve.appear',
        targetB: !isAttack
          ? formatMessage({
              id: `${heroOccupation.name}`,
            })
          : getLogName(monster.name) ?? 'pve.appear',
        round: roundCount,
        hurtValue: hurtValue,
        attackedPosition: !isAttack ? 'left' : 'right',
        priorityAttack: priorityAttack,
        equip: renderEquip,
        info: '',
        type: 'attack',
        leftHero: {
          name: formatMessage({
            id: `${heroOccupation.name}`,
          }),
          hp: heroHp,
          totalHp: heroMaxHp,
          occupation: newHero.occupation,
          level: newHero.level,
          hero: newHero,
        },
        rightHero: {
          name: monster?.name ?? '',
          hp: monsterHp,
          totalHp: monsterTotalHp,
          occupation: monster.occupation,
          level: monster.level,
          hero: monster,
        },
        gold: gold,
        dlt: dlt,
      }

      //第一回合,怪物登场,让怪物图片预先加载出来
      if (roundList.length === 0) {
        const firstRound: t_renderInfo = {
          ...newRound,
          info: `${getLogName(monster.name) ?? ''}${formatMessage({
            id: 'pve.appear',
          })}`,
          type: 'onStage',
          rightHero:{
            ...newRound.rightHero,
            hp:monsterTotalHp
          }
        }

        roundList.push(firstRound)
      }

      //判断怪物是否死亡,增加怪物死亡回合和怪物登场回合
      //不是第一回合并且回合更改
      if (
        roundCount !== 1 &&
        roundCount !== roundList[roundList.length - 1].round
      ) {
        const lastRound = roundList[roundList.length - 1]
        priorityAttack = isAttack ? 'left' : 'right'
        //死亡回合
        const dieRound: t_renderInfo = {
          ...lastRound,
          attackedPosition: '',
          info: `${getLogName(lastRound.rightHero.name)} ${formatMessage({
            id: 'pve.die',
          })}`,
          type: 'die',
        }
        dieRound.rightHero.hp = 0
        roundList.push(dieRound)
        //登场回合
        roundList.push({
          tagertA: isAttack
            ? formatMessage({
                id: `${heroOccupation.name}`,
              })
            : getLogName(monster?.name) ?? 'pve.appear',
          targetB: !isAttack
            ? formatMessage({
                id: `${heroOccupation.name}`,
              })
            : getLogName(monster?.name) ?? 'pve.appear',
          round: roundCount,
          hurtValue: hurtValue,
          attackedPosition: !isAttack ? 'left' : 'right',
          info: `${getLogName(monster?.name) ?? ''}${formatMessage({
            id: 'pve.appear',
          })}`,
          priorityAttack: priorityAttack,
          equip: lastRound.equip,
          type: 'onStage',
          leftHero: {
            name: formatMessage({
              id: `${heroOccupation.name}`,
            }),
            hp: lastRound.leftHero.hp,
            totalHp: heroMaxHp,
            occupation: newHero.occupation,
            level: newHero.level,
            hero: newHero,
          },
          rightHero: {
            name: monster?.name ?? '',
            hp: monsterTotalHp,
            totalHp: monsterTotalHp,
            occupation: monster.occupation,
            level: monster.level,
            hero: monster,
            imgUrl: monster.imgUrl,
          },
          gold: gold,
          dlt: dlt,
        })
      } else {
        if (roundList.length !== 0) {
          const lastRound = roundList[roundList.length - 1]
          priorityAttack = lastRound.priorityAttack
        }
      }
      newRound.priorityAttack = priorityAttack
      roundList.push(newRound)
      return roundItem
    })

    setAllProfit({
      gold: settle.allGold ?? 0,
      dlt: settle.allDlt ?? 0,
      equipList: settle.winEquips,
      type: settle.win ? 'win' : 'fail',
    })
    setLoading(false)
    initDom(roundList)
    console.log('回合数据',roundList)
    return roundList
  }

  const initDom = async (roundList: t_renderInfo[]) => {
    //执行动画效果
    const upDateDom = async (dataList: t_renderInfo[], index: number) => {
      if (index < dataList.length) {
        setRound(undefined)
        setRound({ ...dataList[index] })
        // if (dataList[index].type === 'attack') {
        //   if (dataList[index].hurtValue === 0) {
        //     if (missAudioRef) {
        //       missAudioRef &&
        //         missAudioRef.current &&
        //         missAudioRef.current.play()
        //     }
        //   } else {
        //     if (attackAudioRef) {
        //       attackAudioRef &&
        //         attackAudioRef.current &&
        //         attackAudioRef.current.play()
        //     }
        //   }
        // }
        setTimeout(() => {
          upDateDom(dataList, index + 1)
        }, 1200)
      } else {
        if (!isShowResult) {
          setTimeout(() => {
            setIsShowResult(true)
          }, 1000)
        }
      }
    }
    upDateDom(roundList, 0)
  }

  const renderTextCom = useMemo(
    () => () => {
      return round ? (
        <div className={styles.centerHead}>
          {round.type !== 'attack' ? (
            <div className={styles.messageContent}>
              <div className={styles.textRow}>
                {round?.info}
              </div>
              <div className={styles.textRow}>
              </div>
            </div>
          ) : (
            <div className={styles.messageContent}>
              <div className={styles.textRow}>
                <span className={styles.leftHeroName}>{round?.tagertA} </span>
                <span className={styles.centerText}>
                  <FormattedMessage id="pve.triedToAttackThe" />{' '}
                </span>
                <span>{round?.targetB}</span>
              </div>
              <div className={styles.textRow}>
                <FormattedMessage id="pve.caused" />
                <span className={styles.hurt}>{round?.hurtValue}</span>
                <FormattedMessage id="pve.damage" />
              </div>
            </div>
          )}
        </div>
      ) : (
        // <div className={styles.centerHead}>
        //   {
        //     round.type!=='attack'?<div className='messageContent'>
        //       <p style={{paddingBottom: 5}}>{round?.info}</p>

        //     </div>
        //       :<div className='messageContent'>
        //         <p style={{paddingBottom: 5}}>{round?.tagertA} {formatMessage({id:'pve.triedToAttackThe'})} {round?.targetB}</p>
        //         <p>{round?.hurtValue===0?formatMessage({id:'pve.miss'}):`${formatMessage({id:'pve.caused'})}${round.hurtValue}${formatMessage({id:'pve.damage'})}`}</p>

        //       </div>
        //   }

        // </div>
        <></>
      )
    },
    [round],
  )

  return (
    <div className={`${styles.page}`}>
      <div className={styles.topRow}>
        <BackBtn onBack={backCall} />
        <span>
          <FormattedMessage id={'pve'} />
        </span>
      </div>
      <div className={styles.content}>
        {/* 顶部 */}
        <div className={styles.head}>
          <div className={styles.leftHead}>1</div>
          {renderTextCom()}
          <div className={styles.rightHead}>{round?.round}</div>
        </div>
        {/* 英雄 */}
        <div className={styles.main}>
          <FightHero
            position="left"
            roundHero={round?.leftHero}
            hero={playerHero}
            roundInfo={round}
            heroAttr={heroAttr}
          />
          <FightHero
            position="right"
            roundHero={round?.rightHero}
            hero={round?.rightHero.hero}
            roundInfo={round}
            heroAttr={heroAttr}
          />
        </div>
        {/* 打斗音乐播放器 */}
        <audio
          ref={attackAudioRef}
          className={styles.attackedAudio}
          controls
          src={`/voice/attacked.mp3`}
        ></audio>
        {/* miss音乐播放器 */}
        <audio
          ref={missAudioRef}
          className={styles.attackedAudio}
          controls
          src={`/voice/miss.wav`}
        ></audio>
      </div>

      {/* 结果弹窗 */}
      <PveResultModal
        onOk={()=>{ setIsShowResult(false);backCall() }}
        onClose={()=>{ setIsShowResult(false);backCall() }}
        open={isShowResult}
        isSuccess={allProfit.type!="fail"}
        vc={allProfit.gold}
        // keyList={getKeyPackage(keyList)}
        // equipList={equipList}
      />
    </div>
  )
}

export default PveFight
