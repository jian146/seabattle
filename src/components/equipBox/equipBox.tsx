import styles from './equipBox.less'
import goldImg from '@/assets/images/com/coin.png'

const EquipBox: React.FC<{ type: 'VC'; count?: number,isShowName?:boolean }> = ({count,isShowName=true}) => {
  return (
    <div className={`equipBox ${styles.equipBox}`}>
      <div className={`content ${styles.content}`}>
        <img className={styles.equipImg} src={goldImg} />
      </div>
      {
        isShowName&&  <div className={styles.text}>{count??''} VC</div>
      }
    
    </div>
  )
}
export default EquipBox
