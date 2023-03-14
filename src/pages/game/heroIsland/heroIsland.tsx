import BackBtn from '@/components/backBtn/backBtn';
import Button from '@/components/Button/button';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage,getLocale,history } from 'umi';
import styles from './heroIsland.less';
import crystal1Img from '@/assets/images/heroIsland/crystal/1.png';
import crystal2Img from '@/assets/images/heroIsland/crystal/2.png';
import crystal3Img from '@/assets/images/heroIsland/crystal/3.png';
import crystal4Img from '@/assets/images/heroIsland/crystal/4.png';
import crystal5Img from '@/assets/images/heroIsland/crystal/5.png';
import { getMyHeroApi } from '@/api/hero';
import { useWeb3React } from '@web3-react/core';
import { checkAccount } from '@/utils/account';

import { T_Hero } from '@/types/hero';
import {
  endAllJobApi,
  getClaimRewardApi,
  getMyJobsApi,
  getSignJobApi,
  harvestAllJobApi,
  I_JobInfo,
} from '@/api/job';
import WorkHero from './components/workHero/workHero';
import Page from '@/components/page/page';
import WorkModel, { T_workModel_hero } from './components/workModel/workModel';
import { ethers } from 'ethers';

import { getSigner } from '@/web3';
import { message } from 'antd';
import { claimRewardAbi } from '@/web3/job';
import PageLoading from '@/components/loading/loading';

const HeroIslandPage = () => {
  const { account, library } = useWeb3React();
  const pageSize = 9;
  const [jobHeroList, setJobHeroList] = useState<I_JobInfo[]>([]);
  const [heroList, setHeroList] = useState<T_Hero[]>([]);
  const [currentColor, setCurrentColor] = useState(1);
  const [loading, setLoading] = useState(false);
  const [heroType, setHeroType] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowMode, setIsShowMode] = useState(false);
  const [selectHero, setSelectHero] = useState<T_workModel_hero>();
  const [claimReward, setClaimRewardData] = useState<{
    lastReward: string;
    sig: string;
    totalrewards: string;
  }>();
  const colorTagList = [
    {
      color: 1,
      img: crystal1Img,
    },
    {
      color: 2,
      img: crystal2Img,
    },
    {
      color: 3,
      img: crystal3Img,
    },
    {
      color: 4,
      img: crystal4Img,
    },
    {
      color: 5,
      img: crystal5Img,
    },
  ];
  const isEn=getLocale() === 'en-US' 

  useEffect(() => {
    checkAccount(account, library);
    init();
  }, [library, account]);
  const init = async (isloading = true) => {
    if (!(account && library)) return;
    try {
      isloading && setLoading(true);
      const address = account ? account : await library.getSigner().getAddress();
      await getJobHero(address);
      await getClaimReward(address);
      await getMyHero(address);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }

  };

  //获取可领取的奖励
  const getClaimReward = async (address: string) => {
    const res = await getClaimRewardApi(address);
    if (res) {
      setClaimRewardData({
        sig: res.sig,
        lastReward: ethers.utils.formatEther(res.lastReward),
        totalrewards: ethers.utils.formatEther(res.totalrewards),
      });
    }
  };
  //一键领取
  const getAlllaimReward = async () => {
    if (!account && library) return;
    setLoading(true)
    const address = account ? account : await library.getSigner().getAddress();
    try {
      const apiSign = await getSignJobApi(address);
      if (apiSign) {
        const abiSign = await getSigner(
          library,
          `harvestAll:${address}:${apiSign.sign}`,
        );
        const res = await harvestAllJobApi(address, abiSign);
        if (res && res.success) {
          message.success('success!');
        }
      }
      init();
    } catch (error) {
      setLoading(false)
    }
  };
  //一键退出
  const exitAllWork = async () => {
    if (!account || !library) return;
    setLoading(true)
    const address = account ? account : await library.getSigner().getAddress();
    try {
      const apiSign = await getSignJobApi(address);
      if (apiSign) {
        const abiSign = await getSigner(
          library,
          `endAllJob:${address}:${apiSign.sign}`,
        );
        const res = await endAllJobApi(address, abiSign);
        if (res && res.success) {
          message.success('success!');
        }
      }
      init();
    } catch (error) {
      setLoading(false)
    }
  };
  //获取打工的英雄
  const getJobHero = async (address: string) => {
    const res = await getMyJobsApi(address);
    res && setJobHeroList(res);
  };

  //提取到钱包
  const claimRewardToWallet = async () => {
    if (!account || !library || !claimReward) return;

    
    setLoading(true)
    try {
      const abiRes = await claimRewardAbi(
        library,
        ethers.utils.parseEther(claimReward.totalrewards),
        claimReward.sig,
      );
      init();
    } catch (error) {
      setLoading(false)
    }

    
  };

  //获取我的英雄
  const getMyHero = async (address: string) => {
    const res = await getMyHeroApi(address);
    setHeroList(res);
  };
  const getCurrentHeroList = useCallback(
    (list: I_JobInfo[] | T_Hero[]): I_JobInfo[] | T_Hero[] => {
      // //过滤
      let filterList = (list as I_JobInfo[])
        .filter((item: I_JobInfo | T_Hero) => {
          const color =
            (item as T_Hero)?.color ?? (item as I_JobInfo)?.heroColor;
          return color !== 6&&color==currentColor;
        }) 
        //    .filter(
        //   (item: I_JobInfo | T_Hero) => {
        //     return (
        //       (item as T_Hero)?.color === currentColor ||
        //       (item as I_JobInfo)?.heroColor === currentColor
        //     );
        //   },
        // )
        .sort((a: I_JobInfo | T_Hero, b: I_JobInfo | T_Hero) => {
          const aLv = (a as I_JobInfo)?.heroLv ?? (a as T_Hero).level;
          const bLv = (b as I_JobInfo)?.heroLv ?? (b as T_Hero).level;
          return bLv - aLv;
        })
        .sort((a: I_JobInfo | T_Hero, b: I_JobInfo | T_Hero) => {
          const aColor = (a as I_JobInfo)?.heroColor ?? (a as T_Hero).color;
          const bColor = (b as I_JobInfo)?.heroColor ?? (b as T_Hero).color;
          return bColor - aColor;
        });
  
      // //分页
      const allPage =
        parseInt((filterList.length / pageSize) as any) +
        (filterList.length % pageSize > 0 ? 1 : 0);
      if (currentPage === allPage) {
        //最后一页
        return filterList.slice(
          pageSize * (currentPage - 1),
          filterList.length,
        );
      } else {
        return filterList.slice(
          pageSize * (currentPage - 1),
          pageSize * currentPage,
        );
      }
    },
    [heroList, currentPage, heroType, currentColor],
  );
  const jobHeroFilterData = getCurrentHeroList(jobHeroList);
  const heroFilterData = getCurrentHeroList(heroList);
  return (
    <div className={`${styles.page}`}>
      <PageLoading loading={loading}>
        <div className={styles.topRow}>
        <BackBtn onBack={()=>{history.push('/')}} />
          <span>
            <FormattedMessage id={'home.heroIsland'} />
          </span>
        </div>
        <div className={styles.content}>
          {/* 等级分类 */}
          <div className={`${styles.gradeTag} ${isEn&&styles.gradeTagEn}`}>
            {colorTagList.map((item) => {
              const isActive = currentColor === item.color;
              return (
                <div
                  key={item.color}
                  className={`${styles.gradeTagItem} ${
                    isActive ? styles.activeTag : ''
                  }`}
                  onClick={() => {setCurrentColor(item.color);setCurrentPage(1)}}
            
                >
                  <span>
                  <FormattedMessage
                    id={`heroIsland.color${item.color}${isActive ? '' : '-s'}`}
                  />
                  </span>
                </div>
              );
            })}
          </div>
          {/* 左页 */}
          <div className={styles.leftContent}>
            {/* 当前标题 */}
            <div className={styles.title}>
              <FormattedMessage id={`heroIsland.color${currentColor}-s`} />
              <FormattedMessage id={`heroIsland.crystal`} />
            </div>
            {/* 水晶图片 */}
            <img
              className={styles.crystalImg}
              src={colorTagList[currentColor - 1].img}
              alt="crystal"
            />
            {/* 可领取收益 */}
            <div className={styles.available}>
              <span>
                <FormattedMessage id={`heroIsland.currentTotalAvailable`} />
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
              <Button type={2} onClick={exitAllWork} disabled={jobHeroList.filter(item=>item.heroColor!==6).length===0}>
                <FormattedMessage id={`heroIsland.exitJob`} />
              </Button>
              <Button type={2} onClick={getAlllaimReward}>
                <FormattedMessage id={`heroIsland.receive`} />
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
                  setHeroType(1);
                }}
              >
                <FormattedMessage id={'heroIsland.heroesAtRest'} />
              </div>
              <div
                className={`${
                  heroType === 0 ? styles.workHero : styles.restHero
                }`}
                onClick={() => {
                  setHeroType(0);
                }}
              >
                <FormattedMessage id={'heroIsland.heroesAtWork'} />
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
                        // activeColor={currentColor}
                        onClick={async () => {
                         
                          setSelectHero({
                            ...item.heroInfo,
                            workTime: item.time,
                            reward: item.reward,
                            jopId: item.jobId,
                          });
                          setIsShowMode(true);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.heroBox}>
                {(heroFilterData as T_Hero[]).map((item) => {
                  return (
                    <div key={item.tokenId} className={`${styles.heroItem} `}>
                      <WorkHero
                        hero={item}
                        activeColor={currentColor}
                        onClick={() => {
                          setSelectHero({
                            ...item,
                            workTime: 0,
                            jopId: 0,
                            reward: '0',
                          });
                          setIsShowMode(true);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {/* 分页组件 */}
            <div className={styles.paging}>


              <Page
                current={currentPage}
                total={
                  heroType === 0
                    ? jobHeroList.filter(item=>item.heroColor!==6&&item.heroColor===currentColor).length
                    :  heroList.filter((item)=>item.color!==6&&item.color===currentColor).length
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
              init(false);
              setSelectHero(undefined)
              setIsShowMode(false);
            }}
          />
        )}
      </PageLoading>
    </div>
  );
};
export default HeroIslandPage;
