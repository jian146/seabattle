import { T_Hero } from '@/types/hero';
import styles from './workHero.less';
import NBIcon from '@/assets/images/home/coin@2x.png';
import addIcon from '@/assets/images/com/addIcon.png';
import { ethers } from 'ethers';
import { getHeroImgData } from '@/utils/hero';
import HeroLv from '@/components/hero/heroLv';
const WorkHero: React.FC<{
  hero?: T_Hero;
  reward?: string;
  activeColor?: number;
  onClick?: () => void;
}> = ({ hero, onClick, reward, activeColor = -1 }) => {
  const color = hero?.color ?? 1;
  const heroImgData = hero&&getHeroImgData(hero?.occupation ?? 1, hero?.color);
  const rewardStr = reward ? ethers.utils.formatEther(reward) : '';
  if (!hero)
    return (
      <div
        className={`${styles.workHero} ${styles['color' + 0]} ${activeColor >= 0 && color < activeColor&&styles.unActiveColor} workHeroClass`}
        onClick={onClick}
      >
        <img className={`${styles.addIcon} center`} src={addIcon} />
      </div>
    );
  return (
    <div
      className={`${styles.workHero} ${styles['color' + color]} ${activeColor >= 0 && color < activeColor&&styles.unActiveColor} workHeroClass`}
      onClick={onClick}
    >
      {/* {activeColor >= 0 && color < activeColor && (
        <div className={` ${styles.unActiveColor}`}></div>
      )} */}

      <HeroLv color={color} level={hero.level} />

      {/* 英雄头像 */}
      {hero&&heroImgData&&<img className={styles.heroHead} src={heroImgData.headImg} />}
      
      {reward && (
        <div className={styles.reward}>
          <img className={styles.NBIcon} src={NBIcon} />
          {parseFloat(rewardStr).toFixed(2)}
        </div>
      )}
    </div>
  );
};
export default WorkHero;
