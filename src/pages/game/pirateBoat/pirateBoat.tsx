import BackBtn from '@/components/backBtn/backBtn'
import Button from '@/components/Button/button'
import { useCallback, useEffect, useState } from 'react'
import { FormattedMessage, history } from 'umi'
import styles from './pirateBoat.less'
import pirateBoat from '@/assets/images/heroIsland/pirateBoat.png'

import { getMyHeroApi } from '@/api/hero'
import { useWeb3React } from '@web3-react/core'
import { checkAccount } from '@/utils/account'

import { T_Hero } from '@/types/hero'
import {
  getClaimRewardApi,
  getMyJobsApi,
  getpirateshipTotalRewardsApi,
  getSignJobApi,
  harvestAllJobApi,
  I_JobInfo,
} from '@/api/job'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Page from '@/components/page/page'

import { BigNumber, ethers } from 'ethers'

import { getSigner, queryAndApprove } from '@/web3'
import { message, Spin, Tooltip } from 'antd'
import { claimRewardAbi } from '@/web3/job'
import WorkModel, {
  T_workModel_hero,
} from '../heroIsland/components/workModel/workModel'
import WorkHero from '../heroIsland/components/workHero/workHero'
import PageLoading from '@/components/loading/loading'
import { bigNumberStringToFloat } from '@/utils/BigNumberHelper'
const PirateBoatPage = () => {
  const { account, library } = useWeb3React()
  const pageSize = 9
  const [loading, setLoading] = useState(false)
  const [jobHeroList, setJobHeroList] = useState<I_JobInfo[]>([])
  const [heroList, setHeroList] = useState<T_Hero[]>([])
  const [currentColor, setCurrentColor] = useState(6)

  const [heroType, setHeroType] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isShowMode, setIsShowMode] = useState(false)
  const [selectHero, setSelectHero] = useState<T_workModel_hero>()
  const [claimReward, setClaimRewardData] = useState<{
    lastReward: string
    sig: string
    totalrewards: string
  }>()
  const [pirateshipTotalReward, setPirateshipTotalReward] = useState<{
    pirateshipTotalRewards: string
    totalRewardClaimed: string
    yourWeight: number
    totalWeight: number
  }>()
  const allReward = jobHeroList.reduce((a, b) => {
    return a + bigNumberStringToFloat(b.reward)
  }, 0)

  useEffect(() => {
    checkAccount(account, library)
    init()
  }, [library, account])
  const init = async (isloading = true) => {
    if (!(account && library)) return
    isloading && setLoading(true)
    try {
      const address = account ? account : await library.getSigner().getAddress()
      await getJobHero(address)
      await getClaimReward(address)
      await getMyHero(address)
      await getpirateshipTotalRewards(address)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getpirateshipTotalRewards = async (address: string) => {
    const res = await getpirateshipTotalRewardsApi(address)
    if (res) {
      setPirateshipTotalReward({
        pirateshipTotalRewards: ethers.utils.formatEther(
          res.pirateshipTotalRewards,
        ),
        totalRewardClaimed: ethers.utils.formatEther(res.totalRewardClaimed),
        yourWeight: res.yourWeight,
        totalWeight: res.totalWeight,
      })
    }
  }

  //获取可领取的奖励
  const getClaimReward = async (address: string) => {
    const res = await getClaimRewardApi(address, true)
    if (res) {
      setClaimRewardData({
        sig: res.sig,
        lastReward: ethers.utils.formatEther(res.lastReward),
        totalrewards: ethers.utils.formatEther(res.totalrewards),
      })
    }
  }
  //一键领取
  const getAlllaimReward = async () => {
    if (!account && library) return
    const address = account ? account : await library.getSigner().getAddress()
    try {
      const apiSign = await getSignJobApi(address)
      if (apiSign) {
        const abiSign = await getSigner(
          library,
          `harvestAll:${address}:${apiSign.sign}`,
        )
        const res = await harvestAllJobApi(address, abiSign, true)
        if (res && res.success) {
          message.success('success!')
        }
      }
      init()
    } catch (error) {
      setLoading(false)
    }
  }

  //获取打工的英雄
  const getJobHero = async (address: string) => {
    const res = await getMyJobsApi(address, true)
    res && setJobHeroList(res)
  }

  //提取到钱包
  const claimRewardToWallet = async () => {
    if (!account || !library || !claimReward) return
    setLoading(true)
    try {
      const abiRes = await claimRewardAbi(
        library,
        ethers.utils.parseEther(claimReward.totalrewards),
        claimReward.sig,
        true,
      )
      init()
    } catch (error) {
      setLoading(false)
    }
  }

  //获取我的英雄
  const getMyHero = async (address: string) => {
    const res = await getMyHeroApi(address)
    setHeroList(res)
  }
  const getCurrentHeroList = useCallback(
    (list: I_JobInfo[] | T_Hero[]): I_JobInfo[] | T_Hero[] => {
      // //过滤
      let filterList = (list as I_JobInfo[]).filter(
        (item: I_JobInfo | T_Hero) => {
          return (
            (item as T_Hero)?.color === currentColor ||
            (item as I_JobInfo)?.heroColor === currentColor
          )
        },
      )
      // //分页
      const allPage =
        parseInt((filterList.length / pageSize) as any) +
        (filterList.length % pageSize > 0 ? 1 : 0)
      if (currentPage === allPage) {
        //最后一页
        return filterList.slice(pageSize * (currentPage - 1), filterList.length)
      } else {
        return filterList.slice(
          pageSize * (currentPage - 1),
          pageSize * currentPage,
        )
      }
    },
    [heroList, currentPage, heroType, currentColor],
  )
  const jobHeroFilterData = getCurrentHeroList(jobHeroList)
  const heroFilterData = getCurrentHeroList(heroList)
  const vcDom=<span style={{marginLeft:5}}>VC</span>
  return (
    <div className={`${styles.page}`}>
      <PageLoading loading={loading}>
        <div className={styles.topRow}>
          <BackBtn
            onBack={() => {
              history.push('/')
            }}
          />
          <span>
            <FormattedMessage id={'home.pirateBoat'} />
          </span>
        </div>
        <div className={styles.content}>
          {/* 左页 */}
          <div className={styles.leftContent}>
            {/* 当前标题 */}
            <div className={styles.title}>
              <FormattedMessage id={`home.pirateBoat`} />
            </div>
            <div className={styles.priceContent}>
              <div className={styles.row1}>
                <span className={styles.pool}>
                  <span>
                    <FormattedMessage id={`heroIsland.currentAwardPool`} />
                    <span className={styles.iconBox} id="icon">
                      <Tooltip
                        trigger={['hover', 'click']}
                        getPopupContainer={() =>
                          document.getElementById('icon') ?? document.body
                        }
                        title={
                         <span className={styles.iconText}>
                            <FormattedMessage
                            id={`pirateBoat.currentAwardPoolDes`}
                          />
                         </span>
                        }
                        color={'rgb(225,201,162)'}
                        key={'rgb(225,201,162)'}
                      >
                        <QuestionCircleOutlined className={styles.icon} />
                      </Tooltip>
                    </span>
                  </span>
                  <span className={styles.allPool}>
                    <FormattedMessage id={`pirateBoat.accumulatedDividend`} />
                  </span>
                </span>

                <span className={styles.pool}>
                  <span className={styles.currentPool}>
                    {parseFloat(
                      pirateshipTotalReward?.pirateshipTotalRewards ?? '0',
                    ).toFixed(2)}
                     {vcDom}
                  </span>
                  <span className={styles.allPool}>
                    {parseFloat(
                      pirateshipTotalReward?.totalRewardClaimed ?? '0',
                    ).toFixed(2)}
                    {vcDom}
                  </span>
                </span>
              </div>
            </div>

            {/* 水晶图片 */}
            <img className={styles.crystalImg} src={pirateBoat} alt="crystal" />
            {/* 可领取收益 */}
            <div className={styles.available}>
              <span>
                <FormattedMessage id={`pirateBoat.currentTotalAvailable`} />
                <span className={styles.weight}>
                  (<FormattedMessage id={`pirateBoat.weight`} />:
                  {pirateshipTotalReward?.yourWeight ?? 0}/
                  {pirateshipTotalReward?.totalWeight ?? 0})
                </span>
              </span>
              <div className={styles.availableRight}>
                <span>
                  {parseFloat(claimReward?.lastReward ?? '0').toFixed(2)}
                </span>
                <span>
                  <Button
                    type={2}
                    onClick={claimRewardToWallet}
                    disabled={parseFloat(claimReward?.lastReward ?? '0') <= 0}
                  >
                    <FormattedMessage id={`heroIsland.receiveToWallet`} />
                  </Button>
                </span>
              </div>
            </div>
            {/* 按钮组 */}
            <div className={styles.btnRow}>
              <Button
                type={2}
                onClick={getAlllaimReward}
                disabled={allReward === 0}
              >
                {/* <FormattedMessage id={`pirateBoat.bonus`} /> */}
                {allReward === 0 ? (
                  <FormattedMessage id={`pirateBoat.refreshTime`} />
                ) : (
                  <FormattedMessage id={`pirateBoat.bonus`} />
                )}
              </Button>
            </div>
          </div>
          {/* 右页 */}

          <div className={styles.rightContent}>
            {/* 切换列表 */}
            <div className={styles.typeTag}>
              <div
                className={`${
                  heroType === 0 ? styles.restHero : styles.workHero
                }`}
                onClick={() => {
                  setHeroType(1)
                }}
              >
                <FormattedMessage id={'pirateBoat.heroesAtRest'} />
              </div>
              <div
                className={`${
                  heroType === 0 ? styles.workHero : styles.restHero
                }`}
                onClick={() => {
                  setHeroType(0)
                }}
              >
                <FormattedMessage id={'pirateBoat.heroesAtWork'} />
              </div>
            </div>

            {/* 英雄盒子 */}
            {heroType === 0 ? (
              <div className={styles.heroBox}>
                {(jobHeroFilterData as I_JobInfo[]).map((item) => {
                  return (
                    <div key={item.heroId} className={styles.heroItem}>
                      <WorkHero
                        hero={item.heroInfo}
                        reward={item.reward}
                        onClick={() => {
                          setSelectHero({
                            ...item.heroInfo,
                            workTime: item.time,
                            jopId: item.jobId,
                            reward: item.reward,
                          })
                          setIsShowMode(true)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={styles.heroBox}>
                {(heroFilterData as T_Hero[]).map((item) => {
                  return (
                    <div key={item.tokenId} className={styles.heroItem}>
                      <WorkHero
                        hero={item}
                        onClick={() => {
                          setSelectHero({
                            ...item,
                            workTime: 0,
                            jopId: 0,
                            reward: '0',
                          })
                          setIsShowMode(true)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* 分页组件 */}
            <div className={styles.paging}>
              <Page
                current={currentPage}
                total={
                  heroType === 0
                    ? jobHeroList.filter((item) => {
                        item.heroColor === 6
                      }).length
                    : heroList.filter((item) => item.color === 6).length
                }
                pageSize={9}
                currentChange={(val) => setCurrentPage(val)}
              />
            </div>
          </div>
        </div>

        {/* 英雄弹窗 */}
        {selectHero && (
          <WorkModel
            heroType={heroType}
            open={isShowMode}
            propsHero={selectHero}
            onClose={() => {
              init(false)
              setIsShowMode(false)
              setSelectHero(undefined)
            }}
          />
        )}
      </PageLoading>
    </div>
  )
}
export default PirateBoatPage
