import ComModal from '@/components/Dialog/com'
import { T_Hero } from '@/types/hero'
import { message, Modal, ModalProps } from 'antd'
import modalClosImg from '@/assets/images/heroIsland/modalClose.png'
import modalMaskImg from '@/assets/images/heroIsland/modalMask.png'
import closeHeroImg from '@/assets/images/heroIsland/closeHero.png'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './logModel.less'
import { getHeroImgData } from '@/utils/hero'

import { FormattedMessage, getLocale, history } from 'umi'
import Button from '@/components/Button/button'
import { useWeb3React } from '@web3-react/core'
import WorkHero from '@/pages/game/heroIsland/components/workHero/workHero'
import { mockHero } from '../../../card/card'
import { I_Equip } from '@/pages/game/heroInfo/heroInfo'
import { claimAllApi, getBattleLogListApi, getClaimObjectsApi } from '@/api/pve'
import Page from '@/components/page/page'
import { pveMap } from '../../pve'

import { getMonsterData } from '../../monstersConfig'
import { getSignJobApi } from '@/api/job'
import { getSigner } from '@/web3'
import { claimAllBattleAbi } from '@/web3/pve'
import AllLoading from '@/components/loading/allLoading'

export type T_workModel_hero = T_Hero & {
  workTime: number
  jopId: number
  reward: string
}
interface I_pveLogModel {
  onClose: () => void
}
export interface I_BattleLog {
  allDlt: number
  allGold: number
  claimed: boolean
  finish: boolean
  level: number
  heroColor: number
  mapId: number
  mapLv: number
  monsters: string[]
  occupation: number
  time: number
  tokenId: string
  win: boolean
  battleId: number

  equips: I_Equip[]
}
const PveLogModel: React.FC<ModalProps & I_pveLogModel> = (props) => {
  const { open, onClose } = props
  const pageSize = 5
  const { account, library } = useWeb3React()

  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [battleList, setBattleList] = useState<I_BattleLog[]>([])
  const [profit, setProfit] = useState({
    gold: 0,
    equipList: [] as I_Equip[],
  })

  useEffect(() => {
    if (open) {
      init()
    }
  }, [open])
  const init = async () => {
    setLoading(true)
    const address = account ? account : await library.getSigner().getAddress()
    await getLogList(address)
    await getClaimObjects(address)
    setLoading(false)
  }

  //获取可以领取的dlt和金币
  const getClaimObjects = async (myAddress: string) => {
    const res = await getClaimObjectsApi(myAddress)

    if (res) {
      setProfit({
        gold: res.allGold,
        equipList: res.equips,
      })
      // if (res.coldTime){
      //   countDown(res.coldTime)
      // }
    }
  }
  const getLogList = async (myAddress: string) => {
    const res = await getBattleLogListApi(myAddress)
    setBattleList(
      res.sort((a, b) => {
        return b.time - a.time
      }),
    )
    setLoading(false)
    // const reqBattles=battleList.slice((page-1)*pageSize, page*pageSize)
  }
  const showPageList = (page: number) => {
    return battleList.slice((page - 1) * pageSize, page * pageSize)
  }
  //获取怪物名称
  const getMonsterName = (logItem: I_BattleLog): string => {
    try {
      if (!logItem?.monsters) {
        return ''
      }
      if (getLocale() === 'en-US') {
        let str = ''
        logItem.monsters.map((monsterName: string) => {
          str += getMonsterData(monsterName, 'name')
          return monsterName
        })
        return str
      }
      return logItem.monsters.join(',')
    } catch (error) {
      return ''
    }
  }

  const getClaimAll=async ()=>{
    try {
      setLoading(true)
      const address = account ? account : await library.getSigner().getAddress()
      const res= await claimAllApi(address)

      if (res){
        await claimAllBattleAbi(library, res)
        message.success('success!')
        init()

      }
      
    } catch (error) {
      setLoading(false)
    }


  }
  return (
    <div>
          <AllLoading loading={loading} />
      {open && (
        <ComModal
          open={open}
          width={1364}
          // bodyStyle={{display:'none'}}
        >
          <div className={styles.content}>
            {/* 关闭图标 */}
            <img
              onClick={onClose}
              className={styles.closeImg}
              src={modalClosImg}
              alt="closeImg"
            />
            <div className={styles.title}>
              <FormattedMessage id={'pve.combatRecord'} />
            </div>
            <div className={styles.tableBox}>
              <table className={styles.logTable}>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id={'pve.log.heroesInBattle'} />
                    </th>
                    <th>
                      <FormattedMessage id={'pve.log.copyMap'} />
                    </th>
                    <th>
                      <FormattedMessage id={'pve.log.killMonsters'} />
                    </th>
                    <th>
                      <FormattedMessage id={'pve.log.drop'} />
                    </th>
                    <th>
                      <FormattedMessage id={'pve.log.state'} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showPageList(currentPage).map((logItem, index) => {
                    return (
                      <tr key={logItem.time + logItem.tokenId}>
                        <td className={styles.heroHead}>
                          <WorkHero
                            hero={{
                              ...mockHero,
                              occupation: logItem.occupation,
                              level: logItem.level,
                              color: logItem.heroColor,
                            }}
                            // activeColor={currentColor}
                            onClick={() => {}}
                          />
                        </td>
                        <td>
                          <FormattedMessage
                            id={`pve.map.${pveMap[logItem.mapId - 1].title}`}
                          />
                          LV{logItem.mapLv}
                        </td>
                        <td className={styles.most}>
                          {getMonsterName(logItem)}
                        </td>
                        <td className={styles.get}>
                          {logItem.allGold}VC
                          {/* 12600NB、木制钥匙*1、大宝剑*1、 盔甲*1、盾牌*1、 */}
                        </td>
                        <td className={styles.stateTd}>
                          {logItem.win ? (
                            <div className={styles.win}>WIN</div>
                          ) : (
                            <div className={styles.fail}>FAIL</div>
                          )}

                          {!logItem.claimed && (
                            <div className={styles.tag}>
                              <span className={styles.text}><FormattedMessage id='pve.unclaimed' /></span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 分页组件 */}
            <div className={styles.paging}>
              <Page
                current={currentPage}
                total={battleList.length}
                pageSize={pageSize}
                currentChange={(val) => setCurrentPage(val)}
              />
            </div>
            <div className={styles.VCtext}><FormattedMessage id={'pve.receive'} />:{profit.gold}</div>
            <div className={styles.btnRow}>
              <Button type={2} onClick={getClaimAll} disabled={profit.gold==0}>
                <FormattedMessage id={'pve.canReceiveRewards'} />
              </Button>
            </div>
          </div>
        </ComModal>
      )}
    </div>
  )
}
export default PveLogModel
