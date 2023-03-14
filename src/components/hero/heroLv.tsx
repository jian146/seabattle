import lvColorImg1 from '@/assets/images/com/lvColor1.png';
import lvColorImg2 from '@/assets/images/com/lvColor2.png';
import lvColorImg3 from '@/assets/images/com/lvColor3.png';
import lvColorImg4 from '@/assets/images/com/lvColor4.png';
import lvColorImg5 from '@/assets/images/com/lvColor5.png';
import lvColorImg6 from '@/assets/images/com/lvColor6.png';
import styles from './heroLv.less';
interface I_HeroLv {
  color: number;
  level: number;
}
const HeroLv: React.FC<I_HeroLv> = ({ color=0, level }) => {
  const colorData = [
    {
      lvColor: lvColorImg1,
    },
    {
      lvColor: lvColorImg1,
    },
    {
      lvColor: lvColorImg2,
    },
    {
      lvColor: lvColorImg3,
    },
    {
      lvColor: lvColorImg4,
    },
    {
      lvColor: lvColorImg5,
    },
    {
      lvColor: lvColorImg6,
    },
  ];
  return (
    <div
      className={`${styles.lvTag} comLvTag`}
      style={{
        backgroundImage: `url(${colorData[color].lvColor})`,
      }}
    >
      {level}
    </div>
  );
};
export default HeroLv;
