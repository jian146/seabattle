import ComModal from '@/components/Dialog/com';
import { T_Hero } from '@/types/hero';
import { message, Modal, ModalProps, Popconfirm } from 'antd';
import modalClosImg from '@/assets/images/heroIsland/modalClose.png';
import modalMaskImg from '@/assets/images/heroIsland/modalMask.png';
import closeHeroImg from '@/assets/images/heroIsland/closeHero.png';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './workModel.less';
import { getHeroImgData } from '@/utils/hero';
import { subTokenId } from '../../../../../utils/account';
import { FormattedMessage, history } from 'umi';
import Button from '@/components/Button/button';
import { useWeb3React } from '@web3-react/core';
import { endJobApi, getJobHeroInfoApi, getSignJobApi, I_JobInfo, startJobApi } from '@/api/job';
import { getSigner } from '@/web3';
import { ColdTime } from '@/components/ColdTime/coldTime';
import { getHeroInfoApi } from '@/api/hero';
import { ethers } from 'ethers';

export type T_workModel_hero = T_Hero & {
  workTime: number;
  jopId: number;
  reward: string;
};
interface I_workModel {
  heroType: number; //1闲置英雄 0打工英雄
  propsHero: T_workModel_hero;
  onClose: () => void;
}
const WorkModel: React.FC<ModalProps & I_workModel> = (props) => {
  const { open, heroType = 0, propsHero, onClose } = props;
  const rewardStr = propsHero.reward
    ? ethers.utils.formatEther(propsHero.reward)
    : '';

  const { account, library } = useWeb3React();

  const [isShowClosePage, setIsShowClosePage] = useState(false);
  const [hero, setHero] = useState<T_Hero>();
  const heroImgData = getHeroImgData(hero?.occupation ?? 0, hero?.color);
  useEffect(() => {
    setIsShowClosePage(false);
    getHero();
  }, [open]);
  const getHero = async () => {
    const heroRes =heroType===0?await getJobHeroInfoApi(propsHero.jopId) :await getHeroInfoApi(propsHero.tokenId);
    if(heroRes){
      heroType===0?setHero({ ...(heroRes as I_JobInfo ).heroInfo }):setHero({ ...(heroRes as T_Hero) })
    }

  };
  const startWork = async () => {
    if ((!account && library) || !hero) return;
    if(hero.jobLastTime<=0) return message.info('')
    const address = account ? account : await library.getSigner().getAddress();
    try {
      const apiSign = await getSignJobApi(address);
      if (apiSign) {
        const abiSign = await getSigner(
          library,
          `startjob:${hero.tokenId}:${apiSign.sign}`,
        );
        const res = await startJobApi(
          hero.tokenId,
          address,
          abiSign,
          hero.color === 6,
        );
        if (res && res.success) {
          message.success('success!');
          
          onClose();
        }
      }
    } catch (error) {}
  };
  const endWork = async () => {
    if (!account && library) return;
    const address = account ? account : await library.getSigner().getAddress();
    try {
      const apiSign = await getSignJobApi(address);
      if (apiSign) {
        const abiSign = await getSigner(
          library,
          `endjob:${propsHero?.jopId}:${apiSign.sign}`,
        );
        const res = await endJobApi(propsHero?.jopId, address, abiSign);
        if (res) {
          message.success('success!');
          onClose();
        }
      }
    } catch (error) {
      message.error(JSON.stringify(error));
    }
  };
  const jobTimesDom = useMemo(() => {
    return hero ? <ColdTime PropsTime={hero.jobTimes} /> : '';
  }, [hero]);
  const jobLastTimeDom = useMemo(() => {
    return hero&&hero.jobLastTime>0 ? <ColdTime isActive={heroType === 0} PropsTime={hero.jobLastTime} /> : <span style={{marginLeft:5}}>0</span>;
  }, [hero]);
  if (!hero) return <></>;

  // console.log('英雄id:',hero.tokenId,hero.)
  return (
    <div>
      {open && (
        <ComModal
          open={open}
          width={1040}
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
            {isShowClosePage ? (
              <div className={styles.closeContent}>
                <img className={styles.closeHeroImg} src={closeHeroImg} />
                <div className={styles.message}>
                  {hero.color === 6 ? (
                    <FormattedMessage id={`pirateBoat.exitMes1`} />
                  ) : (
                    <FormattedMessage id={`heroIsland.exitMes1`} />
                  )}
                  {jobTimesDom}
                  <FormattedMessage id={`heroIsland.exitMes2`} />
                  {parseFloat(rewardStr).toFixed(2)}VC，
                  <FormattedMessage id={`heroIsland.exitMes3`} />
                  {jobLastTimeDom}
                  {hero.color === 6 ? (
                    <FormattedMessage id={`pirateBoat.exitMes4`} />
                  ) : (
                    <FormattedMessage id={`heroIsland.exitMes4`} />
                  )}
                </div>
                <div className={styles.btnRow}>
                  <Button
                    type={4}
                    onClick={endWork}
                    disabled={hero.color === 6 && hero.jobLastTime > 0}
                  >
                    {hero.color === 6 ? (
                      <FormattedMessage id={`pirateBoat.endstaking`} />
                    ) : (
                      <FormattedMessage id={`heroIsland.exitMining`} />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* 挖矿内容部分 */}
                {/* 英雄图片 */}
                {hero && (
                  <img
                    className={styles.HeroImg}
                    alt="heroImg"
                    src={heroImgData.img}
                  />
                )}

                <img
                  className={styles.modalMaskImg}
                  alt="heroImg"
                  src={modalMaskImg}
                />
                <div className={styles.token}>
                  TOKENDID:{subTokenId(hero.tokenId)}
                </div>
                {/* 右边属性 */}
                <div className={styles.rightInfo}>
                  <div className={styles.row1}>
                    <span className={styles.occupation}>
                      <FormattedMessage id={`${heroImgData.name}`} />
                    </span>
                    <span className={styles.lv}>LV {hero.level}</span>
                    <span className={styles.bornTime}>
                      <FormattedMessage id={`heroIsland.life`} />:
                      {heroType === 0}
                      {jobLastTimeDom}
                      
                    </span>
                  </div>
                  <div className={styles.row2}>
                    <FormattedMessage id={`heroIsland.workingHours`} />:
                    {heroType === 1 ? '--' :  jobTimesDom}
                  </div>
                  <div className={styles.attrBox}>
                    <div className={styles.attrRow} style={{ marginBottom: 5 }}>
                      <div className={styles.attrItem}>
                        <FormattedMessage id={`strength`} />
                        <span>{hero.strength}</span>
                      </div>
                      <div className={styles.attrItem}>
                        <FormattedMessage id={`stamina`} />
                        <span>{hero.stamina}</span>
                      </div>
                    </div>
                    <div className={styles.attrRow} style={{ marginBottom: 5 }}>
                      <div className={styles.attrItem}>
                        <FormattedMessage id={`agility`} />
                        <span>{hero.agility}</span>
                      </div>
                      <div className={styles.attrItem}>
                        <FormattedMessage id={`mind`} />
                        <span>{hero.mind}</span>
                      </div>
                    </div>
                    <div className={styles.attrRow}>
                      <div className={styles.attrItem}>
                        <FormattedMessage id={`intelligence`} />
                        <span>{hero.intelligence}</span>
                      </div>
                      <div className={styles.attrItem}>
                        <FormattedMessage id={`will`} />
                        <span>{hero.will}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.btnRow}>
                    <Button
                      onClick={() => {
                        history.push('/game/heroInfo/' + hero.tokenId);
                      }}
                    >
                      <FormattedMessage id={hero.color === 6 ?`pirateBoat.more`:`heroIsland.more`} />
                    </Button>
                    {heroType === 1 ? (
                      <>
                       {hero.color === 6 ? (

                                <Popconfirm
                                  placement="top"
                                  title={<FormattedMessage id={`pirateBoat.onJopQuestion`} />}
                                  okText={<FormattedMessage id={`pirateBoat.onJopQuestionYes`} />}
                                  cancelText={<FormattedMessage id={`pirateBoat.onJopQuestionNo`} />}
                                  color={'rgb(225,201,162)'}
                                  // description={<div>
                                  //   我是内容
                                  // </div>}
                                  onConfirm={startWork}
                          
                                >
                                        <Button type={2} 
                                disabled={hero.jobLastTime<=0}
                                >
                                <FormattedMessage id={`pirateBoat.staking`} />
                                </Button>
                                </Popconfirm>
                         
                        ) : (
                          <Button type={2} onClick={startWork}
                           disabled={hero.jobLastTime<=0}
                           >
                         <span className={styles.startMining}><FormattedMessage id={`heroIsland.startMining`} /></span>
                         </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        type={2}
                        onClick={() => {
                          setIsShowClosePage(true);
                        }}
                      >
                        {hero.color === 6 ? (
                          <FormattedMessage id={`pirateBoat.endstaking`} />
                        ) : (
                          <FormattedMessage id={`heroIsland.exitMining`} />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ComModal>
      )}
    </div>
  );
};
export default WorkModel;
