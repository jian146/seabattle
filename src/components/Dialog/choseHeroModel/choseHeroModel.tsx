import { getMyHeroApi } from '@/api/hero';
import { ColdTime } from '@/components/ColdTime/coldTime';
import modalClosImg from '@/assets/images/heroIsland/modalClose.png';
import { T_Hero } from '@/types/hero';
import { subTokenId } from '@/utils/account';
import { getHeroImgData, getTotal } from '@/utils/hero';
import { useWeb3React } from '@web3-react/core';
import checkIcon from '@/assets/images/com/check.png';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';
import ComModal from '../com';
import styles from './choseHeroModel.less';
import WorkHero from '@/pages/game/heroIsland/components/workHero/workHero';
import { CaretDownOutlined } from '@ant-design/icons';
const ChoseHeroModel: React.FC<{
  onClose: () => void;
  open: boolean;
  hideList?:string[]
  onChoseHero: (hero: T_Hero) => void;
}> = ({ open, onClose, onChoseHero,hideList=[] }) => {
  const { account, library } = useWeb3React();
  const sortOptions = [
    {
      value: '0',
      label: <FormattedMessage id={`heroUpload.sortAttr`} />,
    },
  ];
  const [sortValue, setSortValue] = useState('0');
  const [heroList, setHeroList] = useState<T_Hero[]>([]);
  const filterList=heroList.sort((a,b)=>{
    const aTotal=getTotal(a)
    const bTotal=getTotal(b)
    return bTotal-aTotal

  }).filter((item)=>{return hideList.findIndex((fItem)=>item.tokenId==fItem)<0})
  useEffect(() => {
    if(open){
      init();
    }
   
  }, [open,account, library]);
  const init = async () => {
    if (!(account && library)) return;
    const address = account ? account : await library.getSigner().getAddress();

    getMyHero(address);
  };
  //获取我的英雄
  const getMyHero = async (address: string) => {
    const res = await getMyHeroApi(address);
    setHeroList(res);
  };
  return (
    <div className={styles.choseHeroModel}>
      <ComModal
        open={open}
        // bodyStyle={{display:'none'}}
      >
        <div className={styles.content}>
          <div className={styles.head}>
            <div className={styles.select}>
              <Select
                value={sortValue}
                options={sortOptions}
                suffixIcon={<CaretDownOutlined className={styles.selectIcon} />}
              />
            </div>
            {/* 关闭图标 */}
            <img
              onClick={onClose}
              className={styles.closeImg}
              src={modalClosImg}
              alt="closeImg"
            />
          </div>
          {/* 英雄列表 */}
          <div className={styles.heroBox}>
            {filterList.map((hero) => {
              const heroImgData = getHeroImgData(hero.occupation,hero.color);
              return (
                <div
                  className={styles.heroRow}
                  key={hero.tokenId}
                  onClick={() => {
                    onChoseHero(hero);
                  }}
                >
                  <div className={styles.heroContent}>
                    <WorkHero hero={hero} onClick={() => {}} />
                    <div className={styles.heroAttr}>
                      <div className={styles.row}>
                        <div>
                          <span className={styles.heroName}>
                            <FormattedMessage id={`${heroImgData.name}`} />
                          </span>
                        </div>
                        <div className={styles.life}>
                          <span>
                            <FormattedMessage id={`heroIsland.life`} />:
                          </span>
                          <ColdTime PropsTime={hero.jobLastTime} type="hour" />
                        </div>
                      </div>
                      {/* 属性 */}
                      <div className={styles.attrRow}>
                        <div className={styles.attrItem}>
                          <FormattedMessage id={`sStrength`} />
                          {hero.strength}/
                        </div>
                        <div className={styles.attrItem}>
                          <FormattedMessage id={`sStamina`} />
                          {hero.stamina}/
                        </div>
                        <div className={styles.attrItem}>
                          <FormattedMessage id={`sAgility`} />
                          {hero.agility}/
                        </div>
                        <div className={styles.attrItem}>
                          <FormattedMessage id={`sMind`} />
                          {hero.mind}/
                        </div>
                        <div className={styles.attrItem}>
                          <FormattedMessage id={`sIntelligence`} />
                          {hero.intelligence}/
                        </div>
                        <div className={styles.attrItem}>
                          <FormattedMessage id={`sWill`} />
                          {hero.will}
                        </div>
                      </div>
                      <div className={styles.token}>
                        TOKENID:{subTokenId(hero.tokenId)}
                      </div>
                    </div>
                  </div>
                  <img className={styles.checkIcon} src={checkIcon} />
                </div>
              );
            })}
          </div>
        </div>
      </ComModal>
    </div>
  );
};
export default ChoseHeroModel;
