import { getHeroInfoApi, upgradeApi } from '@/api/hero';
import BackBtn from '@/components/backBtn/backBtn';
import { getHeroImgData } from '@/utils/hero';
import { comCheck, getMyVC, queryAndApprove } from '@/web3';
import { getUploadPrice, uploadHeroAbi } from '@/web3/hero';
import { useWeb3React } from '@web3-react/core';
import { message } from 'antd';
import { FormattedMessage, useParams, history, getLocale } from 'umi';
import { mockHero } from '../card/card';
import styles from './heroUpload.less';
import clearImg from '@/assets/images/heroUpload/clear.png';
import WorkHero from '../heroIsland/components/workHero/workHero';
import { useEffect, useMemo, useState } from 'react';
import { T_Hero } from '@/types/hero';
import Button from '@/components/Button/button';
import UploadResultModal from './uploadResultModal/uploadResultModal';
import ChoseHeroModel from '@/components/Dialog/choseHeroModel/choseHeroModel';
import PageLoading from '@/components/loading/loading';
import { BigNumber } from 'ethers';
import Balance from '@/components/balance/balance';

export interface I_uploadResultModal {
  open: boolean;
  isSuccess: boolean;
  level: number;
}
const HeroUpload: React.FC = () => {
  const { account, library } = useWeb3React();
  const inituploadResult: I_uploadResultModal = {
    open: false,
    level: 1,
    isSuccess: false,
  };
  const [loading, setLoading] = useState(false);
  const [hero, setHero] = useState<T_Hero>();
  const [isShowHeroList, setIsShowHeroList] = useState(false);
  const [hero2, setHero2] = useState<T_Hero>();
  const [position, setPosition] = useState(0);
  const params: { heroId: string } = useParams();
  const heroImgData = getHeroImgData(hero?.occupation??1, hero?.color??1);
  const [myVC, setMyVC] = useState<BigNumber>();
  const [isLoad,setIsLoad]=useState(false)
  
  const [player, setPlayer] = useState('');
  const [uploadResult, setUploadResult] =
    useState<I_uploadResultModal>(inituploadResult);

  const [isDisabled, setIsDisabled] = useState(false);
  const isEn=getLocale() === 'en-US' 
  useEffect(() => {
    getHero();
  }, [account, library]);

  const getHero = async (heroId?: string) => {
    setLoading(true);
    heroId ? heroId : (heroId = params.heroId);
    const heroRes = await getHeroInfoApi(heroId);
    heroRes && setHero({ ...heroRes });

    await initHero(heroRes);
    setLoading(false);
  };
  const getBlance=async (address:string)=>{
    const myNBRes = await getMyVC(library, address);
    setMyVC(myNBRes);
  }
  const initHero = async (hero: T_Hero | undefined | null) => {
    if (!hero || !library) return setIsDisabled(true);
    const address = account ? account : await library.getSigner().getAddress();
    setPlayer(address);
    await getBlance(address)
    history.replace(`/game/heroUpload/${hero?.tokenId}`);
    hero.owner !== address ? setIsDisabled(true) : setIsDisabled(false);
  };
  const uplaodHeroLv = async () => {    

    if (account) {
      if(!hero)return
      setLoading(true);
      if (hero2) {
        if (hero2.color !== 5) {
          //不是海盗卡
          if (
            hero.level - 1 !== hero2.level&&hero.level !== 1 ||
            (hero.level === 1 && hero2.level !== 1)
          ) {
            //等级不符合要求
            setLoading(false);
            return message.info('祭品卡牌必须为海盗卡或者等级小于主卡一级');
          }
        }
      }
      const isPass = await queryAndApprove(library, account, 'hero', 'NB');
      if (!isPass || !hero) {
        //授权失败
        message.warn('授权失败');
        setLoading(false);
        return false;
      }
      //比较余额
      const price= getUploadPrice(hero?.level??1)

      const isOk=await comCheck(library,price,2)
      if(!isOk){
        return message.info("Sorry, your credit is running low !")

      }

      const destoryHeroId = hero2 && hero2.tokenId;

      try {
        const abiRes = await uploadHeroAbi(library, hero?.tokenId, hero.level);
        if (!abiRes) {
          setLoading(false);
          return message.error('fail');
        }
        setIsLoad(!isLoad)
        const apiRes = await upgradeApi(abiRes, destoryHeroId);
        if (apiRes) {
          setHero2(undefined);
          setUploadResult({
            open: true,
            isSuccess: apiRes.success,
            level: apiRes.heroInfo.level,
          });
        } else {
          message.error('fail');
        }
        await getHero(hero.tokenId);
        setLoading(false);
  
      } catch (error) {
        setLoading(false);
      }


    }
  };

  const heroImgDom= useMemo(() => hero?<img className={styles.heroImg} src={heroImgData?.img} />:<div className={styles.noHero}></div>, [hero,heroImgData.img])

  return (
    <div className={ `${styles.page} ${isEn&&styles.pageEn}`}>
      <div className="topRow">
        <BackBtn />
        <span>
          <FormattedMessage id={'hero'} />
          <FormattedMessage id={'upgrade'} />
        </span>
      </div>
            {/* 余额和充值入口 */}
            <div className={styles.blancesBox}>
        <Balance isLoad={isLoad} />
      </div>
      <PageLoading loading={loading}>
        <div className={`${styles.content} center flexCenter`}>
          {heroImgDom}
          <div className={styles.rightBox}>
            <div className={styles.heroSelect}>
              <div className={styles.heroBox}>
                <WorkHero
                  hero={hero}
                  onClick={() => {
                    setPosition(0);
                    setIsShowHeroList(true);
                  }}
                />
                <div>
                  <FormattedMessage id={'heroUpload.masterCard'} />
                </div>
              </div>
              <div className={styles.heroBox}>
                {hero2 && (
                  <img
                    className={styles.clearImg}
                    src={clearImg}
                    onClick={() => {
                      setHero2(undefined);
                    }}
                  />
                )}

                <WorkHero
                  hero={hero2}
                  onClick={() => {
                    setPosition(1);
                    setIsShowHeroList(true);
                  }}
                />
                <div>
                  <FormattedMessage id={'heroUpload.sacrificialCard'} />
                </div>
              </div>
            </div>
            <div className={styles.info}>
              <p>
                <FormattedMessage id={'heroUpload.info1'} />
              </p>
              <p>
                <FormattedMessage id={'heroUpload.info2'} />
              </p>
            </div>
            <div className={styles.btnRow}>
              <Button
                type={2}
                className={styles.againBtn}
                onClick={uplaodHeroLv}
                disabled={isDisabled}
              >
                <div className={styles.btnBox}>
                  <span>
                    <FormattedMessage id={'upgrade'} />
                  </span>
                  <span className={styles.price}>
                    {hero ? getUploadPrice(hero.level) : '1000'} VC
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </PageLoading>

      <UploadResultModal
        uploadResult={uploadResult}
        onClose={() => {
          setUploadResult({ ...inituploadResult });
        }}
      />
      <ChoseHeroModel
        open={isShowHeroList}
        hideList={[hero?.tokenId??'']}
        onClose={() => {
          setIsShowHeroList(false);
        }}
        onChoseHero={(selectHero) => {
          const newHero = { ...selectHero, owner: player };
          position === 0 ? setHero({ ...newHero }) : setHero2({ ...newHero });
          if (position === 0) {
            initHero(newHero);
          }
          setIsShowHeroList(false);
        }}
      />
    </div>
  );
};
export default HeroUpload;
