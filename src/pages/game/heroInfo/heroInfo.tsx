import BackBtn from '@/components/backBtn/backBtn';
import lockmg from '@/assets/images/heroInfo/lock.png';
import atkImg from '@/assets/images/hero/attr/atk.png';
import defImg from '@/assets/images/hero/attr/def.png';
import hpImg from '@/assets/images/hero/attr/hp.png';
import magImg from '@/assets/images/hero/attr/Mag.png';
import { FormattedMessage, getLocale, history, useParams } from 'umi';
import styles from './heroInfo.less';
import { getHeroImgData } from '@/utils/hero';
import { useEffect, useMemo, useState } from 'react';
import HeroLv from '@/components/hero/heroLv';
import { mockHero } from '../card/card';
import Button from '@/components/Button/button';
import { useWeb3React } from '@web3-react/core';
import { subTokenId } from '../../../utils/account';
import { getHeroInfoApi, transferHeroApi } from '@/api/hero';
import { T_Hero } from '@/types/hero';
import ChoseHeroModel from '@/components/Dialog/choseHeroModel/choseHeroModel';
import PageLoading from '@/components/loading/loading';
import TransferModel from './transferModel/transferModel';
import { getSigner } from '@/web3';
import { getSignJobApi } from '@/api/job';
import { message } from 'antd';


// export interface I_EquiqPosition{
//   "装备位置 equip
// [0]=左持// [1]=右持// [2]=头// [3]=护符// [4]=套装// [5]=手// [6,7]=戒指// [8]=腰带// [9]=鞋"

// "适用职业 class
// [0]=骑士// [1]=刺客// [2]=法师// [3]=猎人// [4]=其他// 多职可用如下 // [0,1]=骑士,刺客"
// "装备种类// 0=weapon// 1=sub-weapon// 2=helm// 3=amulet// 4=armor// 5=gloves// 6=ring// 7=belt// 8=boots"
/**
 * 装备
 */
 export interface I_Equip {
  //武器类别ID
  id: number
  // <10时表示为一个钥匙, 2^8-1时为一个装备
  key: number
  tokenId:string
  name: string
  en: string

  // 有ID时，可以固定属性
  //条件等级
  lv:number
  //职业
  class:number[]
  //装备位置
  equip:number
  //装备种类
  etype:number
  //稀有度
  rarity:number
  //可锻造等级
  forge:number
  //力量
  str:number
  //敏捷
  agi:number
  //体质
  con:number
  //智力
  inte:number
  //精神
  spt:number
  //意志
  wil:number
  //物伤攻击倍数,*100后的整数
  dbrk:number
  //法伤倍数
  rbrk:number
  //物攻
  dmg:number
  //法攻
  mag:number
  //生命
  hp:number
   //物防
  def:number
  //法防
  res:number
  //铸造等级
  castLv: number,
  //已经改变的属性
  casts: number[ ],
  //可以铸造的属性
  canForgeAttrs:string [ ]
  //冷却时间
  coldTime:number
  destory:boolean

}
export const initEquip:I_Equip={
  id: 999,
  // <10时表示为一个钥匙, 2^8-1时为一个装备
  key: 999,
  tokenId: 'initKey',
  name: '',
  en: '',
  destory: false,
  // 有ID时，可以固定属性
  //条件等级
  lv: 1,
  //职业
  class: [],
  //装备位置
  equip: 0,
  //装备种类
  etype: 0,
  //稀有度
  rarity: 1,
  //可锻造等级
  forge: 0,
  //力量
  str: 0,
  //敏捷
  agi: 0,
  //体质
  con: 0,
  //智力
  inte: 0,
  //精神
  spt: 0,
  //意志
  wil: 0,
  //物伤攻击倍数,*100后的整数
  dbrk: 0,
  //法伤倍数
  rbrk: 0,
  //物攻
  dmg: 0,
  //法攻
  mag: 0,
  //生命
  hp: 0,
  //物防
  def: 0,
  //法防
  res: 0,
  //铸造等级
  castLv: 0,
  //已经改变的属性
  casts: [],
  //可以铸造的属性
  canForgeAttrs: [],
  coldTime: 0
}

export interface I_Equip_position{
  position: number
  equip: I_Equip
}
export interface I_HeroEquip extends T_Hero {
  //10个孔位分别有什么装备
  equips:(I_Equip_position)[]

  //应用了装备后的属性
   //攻击伤害 (物攻或法攻)
  DMG:number
  //魔法伤害
  MAG:number
  //生命
  HP:number
  //物防
  DEF:number
  //法防
  RES:number
}
export interface I_Equip {
  //武器类别ID
  id: number;
  // <10时表示为一个钥匙, 2^8-1时为一个装备
  key: number;
  tokenId: string;
  name: string;
  en: string;

  // 有ID时，可以固定属性
  //条件等级
  lv: number;
  //职业
  class: number[];
  //装备位置
  equip: number;
  //装备种类
  etype: number;
  //稀有度
  rarity: number;
  //可锻造等级
  forge: number;
  //力量
  str: number;
  //敏捷
  agi: number;
  //体质
  con: number;
  //智力
  inte: number;
  //精神
  spt: number;
  //意志
  wil: number;
  //物伤攻击倍数,* ??后的整数
  dbrk: number;
  //法伤倍数
  rbrk: number;
  //物攻
  dmg: number;
  //法攻
  mag: number;
  //生命
  hp: number;
  //物防
  def: number;
  //法防
  res: number;
  //铸造等级
  castLv: number;
  //已经改变的属性
  casts: number[];
  //可以铸造的属性
  canForgeAttrs: string[];
  //冷却时间
  coldTime: number;
  destory: boolean;
}
const HeroInfo = () => {
  const { account, library } = useWeb3React();
  const params: { heroId: string } = useParams();
  const [tagType, setTagType] = useState(0);
  const [hero, setHero] = useState<T_Hero>();
  const [isShowHeroList, setIsShowHeroList] = useState(false);
  const [player, setPlayer] = useState('');
  const isEn=getLocale() === 'en-US' 

  const getEquipImg = (name: string) => {
    return null;
  };

  const heroImgData = getHeroImgData(hero?.occupation ?? 1, hero?.color??1);

  const [myEquipList, setMyEquipList] = useState<I_Equip[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  useEffect(() => {
    console.log('params', params);
    getHero(params.heroId);
  }, [account, library]);

  const getHero = async (heroId: string) => {
    setLoading(true);
    const heroRes = await getHeroInfoApi(heroId);

    heroRes && setHero({ ...heroRes });
    await initHero(heroRes);
    setLoading(false);
  };

  const initHero = async (hero: T_Hero | undefined | null) => {
    if (!hero || !library) return setIsDisabled(true);
    const address = account ? account : await library.getSigner().getAddress();
    setPlayer(address);
    history.replace(`/game/heroInfo/${hero?.tokenId}`);
    hero.owner !== address ? setIsDisabled(true) : setIsDisabled(false);
  };
  //渲染装备
  const renderBox = useMemo(
    () => () => {
      const filterList = myEquipList;

      const dataLength = filterList.length;
      const rowCount = 4;
      const initCount = 20;
      //保持是7的倍数,一行以7个数字为准
      const allCount =
        dataLength < initCount
          ? initCount
          : (Math.floor(dataLength / rowCount) +
              (dataLength % rowCount === 0 ? 0 : 1)) *
            rowCount;
      const getInitDom = (equip: I_Equip | null, key: string | number) => {
        const url = equip ? getEquipImg(equip.name) : '';

        const triggerOpenModal = () => {
          if (!equip) {
            return;
          }
          //   setIsShowDetail(true)
          //   setSelectEquip(equip)
          //   setModelbtnType('on')
        };

        return (
          <div className={styles.equipBox} key={key + 'hero_equip'}>
            <div
              className={`raritySupperCom raritySupper${equip?.rarity}`}
              onClick={(e) => {
                triggerOpenModal();
                e.stopPropagation();
              }}
            ></div>
            {equip && (
              <>
                {/* 锻造等级 */}
                {equip.castLv > 0 && (
                  <div className="forgeLv">+{equip.castLv}</div>
                )}
                {/* {equip.coldTime>0&&<ColdTimeDom equip={equip} />} */}
                {url && (
                  <img
                    src={url}
                    alt=""
                    // onR={()=>{ triggerOpenModal() }}
                    // onDoubleClick={()=>{

                    // }}
                    onContextMenu={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      triggerOpenModal();
                      return false;
                    }}
                    onClick={() => {
                      triggerOpenModal();
                    }}
                  />
                )}
              </>
            )}
          </div>
        );
      };
      const domArr: React.ReactNode[] = [];
      filterList.forEach((element) => {
        domArr.push(getInitDom(element, element.tokenId));
      });
      //渲染空白行
      const nullCount =
        allCount >= dataLength ? allCount - dataLength : allCount;
      for (let index = 0; index < nullCount; index++) {
        domArr.push(getInitDom(null, index));
      }
      return domArr;
    },
    [myEquipList],
  );
  const onTansfer = async (toPlayer: string) => {
    setLoading(true);
    const address = account ? account : await library.getSigner().getAddress();

    const serverSing = await getSignJobApi(address);
    const abiSign = await getSigner(
      library,
      `transfer:${serverSing?.sign}:${hero.tokenId}`,
    );
    const res = await transferHeroApi(address, hero.tokenId, toPlayer, abiSign);
    if (res && res.success) {
      setLoading(false);
      getHero(hero.tokenId);
      message.success(`success!`);
      // history.goBack()
    } else {
      message.error(`fail!`);
    }
    setTransferOpen(false);
  };
  return (
    <div className={`${styles.page}`}>
      <PageLoading loading={loading}>
        <div className="topRow">
          <BackBtn />
          <span>
            <FormattedMessage id={'home.heroInfo'} />
          </span>
        </div>
        <div className={`center ${styles.content}`}>
          {/* 左边内容 */}
          <div className={styles.leftBox}>
            <div className={styles.equipList}>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
            </div>
            <div className={styles.heroImgBox}>
              {hero? <img className={styles.heroImg} src={heroImgData.img} />:<div className={styles.heroImg}></div>}
             
              <div className={styles.token}>
                <span>TOKEN:{subTokenId(hero?.tokenId??mockHero.tokenId)}</span>
                <span
                  className={styles.label}
                  onClick={() => {
                    setIsShowHeroList(true);
                  }}
                >
                  <FormattedMessage id={'switch'} />
                  <span className={styles.gt}>&gt;</span>
                </span>
              </div>
            </div>

            <div className={styles.equipList}>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
              <div className={styles.equipBox}>
                <img className={styles.lockImg} src={lockmg} />
              </div>
            </div>
          </div>
          {/* 右边内容 */}
          <div className={styles.rightBox}>
            {/* 切换标签 */}
            <div className={styles.tagRow}>
              <div
                className={`${styles.tagItem} ${
                  tagType === 0 && styles.activeTag
                } flexCenter`}
                onClick={() => {
                  setTagType(0);
                }}
              >
                <FormattedMessage id={'heroInfo.attribute'} />
              </div>
              <div
                className={`${styles.tagItem} ${styles.rightTag} ${
                  tagType === 1 && styles.activeTag
                } flexCenter`}
                onClick={() => {
                  setTagType(1);
                }}
              >
                <FormattedMessage id={'heroInfo.knapsack'} />
              </div>
            </div>
            {tagType === 0 ? (
              /* 英雄属性*/
              <div className={`${styles.attr } ${isEn&&styles.attrEn}`}>
                <div className={styles.row1}>
                  <span className={styles.heroName}>
                    <FormattedMessage id={`${heroImgData.name}`} />
                  </span>
                  <HeroLv color={hero?.color ?? 1} level={hero?.level ?? 1} />
                </div>
                <div className={styles.attr1Box}>
                  <div className={styles.attr1Row}>
                    <div className={styles.attr1Item}>
                      <img src={atkImg} />
                      <span className={styles.label}>
                        <FormattedMessage id={'Attack'} />
                      </span>
                      {'??'}
                    </div>
                    <div className={styles.attr1Item}>
                      <img src={defImg} />
                      <span className={styles.label}>
                        <FormattedMessage id={'Defense'} />
                      </span>
                      {'??'}
                    </div>
                  </div>
                  <div className={styles.attr1Row}>
                    <div className={styles.attr1Item}>
                      <img src={hpImg} />
                      <span className={styles.label}>
                        <FormattedMessage id={'HP'} />
                      </span>
                      {'??'}
                    </div>
                    <div className={styles.attr1Item}>
                      <img src={magImg} />
                      <span className={styles.label}>
                        <FormattedMessage id={'Resistance'} />
                      </span>
                      {'??'}
                    </div>
                  </div>
                </div>
                <div className={styles.attrBox}>
                  <div className={styles.attrRow} style={{ marginBottom: 5 }}>
                    <div className={styles.attrItem}>
                      <FormattedMessage id={`strength`} />
                      <span>{hero?.strength?hero?.strength:'?'}</span>
                    </div>
                    <div className={styles.attrItem}>
                      <FormattedMessage id={`stamina`} />
                      <span>{hero?.stamina?hero?.stamina:'?'}</span>
                    </div>
                  </div>
                  <div className={styles.attrRow} style={{ marginBottom: 5 }}>
                    <div className={styles.attrItem}>
                      <FormattedMessage id={`agility`} />
                      <span>{hero?.agility?hero.agility:'?'}</span>
                    </div>
                    <div className={styles.attrItem}>
                      <FormattedMessage id={`mind`} />
                      <span>{hero?.mind?hero.mind:'?'}</span>
                    </div>
                  </div>
                  <div className={styles.attrRow}>
                    <div className={styles.attrItem}>
                      <FormattedMessage id={`intelligence`} />
                      <span>{hero?.intelligence?hero.intelligence:'?'}</span>
                    </div>
                    <div className={styles.attrItem}>
                      <FormattedMessage id={`will`} />
                      <span>{hero?.will?hero.will:'?'}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <Button
                    disabled={isDisabled}
                    type={2}
                    onClick={() => {
                      history.push('/game/heroUpload/' + hero?.tokenId);
                    }}
                  >
                    <FormattedMessage id={`upgrade`} />
                  </Button>
                  <Button
                    type={3}
                    disabled={isDisabled}
                    onClick={() => {
                      setTransferOpen(true);
                    }}
                  >
                    <FormattedMessage id={`transfer`} />
                  </Button>
                </div>
              </div>
            ) : (
              //背包
              <div className={styles.backpack}>{renderBox()}</div>
            )}
          </div>
        </div>
        <ChoseHeroModel
          open={isShowHeroList}
          onClose={() => {
            setIsShowHeroList(false);
          }}
          onChoseHero={(hero) => {
            const newHero = { ...hero, owner: player };
            setHero({ ...newHero });
            initHero(newHero);
            setIsShowHeroList(false);
          }}
        />
        <TransferModel
          open={transferOpen}
          onClose={() => {
            setTransferOpen(false);
          }}
          onInputPlayer={onTansfer}
        />
      </PageLoading>
    </div>
  );
};
export default HeroInfo;
