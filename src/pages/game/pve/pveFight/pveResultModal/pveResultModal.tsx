import ComModal from '@/components/Dialog/com';

import modalClosImg from '@/assets/images/heroUpload/closeIcon.png';
import rightIcon from '@/assets/images/heroUpload/rightIcon.png';
import topIcon from '@/assets/images/heroUpload/topIcon.png';

import img1 from '@/assets/images/heroUpload/1.png';
import img2 from '@/assets/images/heroUpload/2.png';
import img3 from '@/assets/images/heroUpload/3.png';
import simg1 from '@/assets/images/heroUpload/success1.png';
import simg2 from '@/assets/images/heroUpload/success2.png';
import simg3 from '@/assets/images/heroUpload/success3.png';
import simg4 from '@/assets/images/heroUpload/success4.png';
import simg5 from '@/assets/images/heroUpload/success5.png';
import styles from './pveResultModal.less';
import EquipBox from '@/components/equipBox/equipBox';


export interface I_PveResultModal {
  open: boolean;
  isSuccess: boolean;
  vc:number;
  onOk:()=>void;
  onClose: () => void
}
const PveResultModal: React.FC<
I_PveResultModal
> = ({ open, isSuccess , onClose,vc }) => {

  return (
    <div className={styles.modal}>
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
            {isSuccess ? (
              <div className={styles.success}>
                <div className={styles.resultBox}>
                  <img className={styles.img1} src={simg1} />
                  <img className={styles.img2} src={simg2} />
                  <img className={`${styles.img2} ${styles.img2Left}`} src={simg2} />
                  <img className={styles.img3} src={simg3} />
                  <img className={styles.img4} src={simg4} />
                  <img className={styles.img5} src={simg5} />
                  
                  <span >victory</span>
                </div>
                <div className={styles.list}>
                <EquipBox type='VC' count={vc}  />
                </div>
              </div>
            ) : (
              <div className={styles.fail}>
                <div className={styles.resultBox}>
                  <img className={styles.img1} src={img1} />
                  <img className={styles.img2} src={img2} />
                  <img className={styles.img3} src={img3} />
                  <span>DEFEAT</span>
                </div>
                <div className={styles.list}>
                   <EquipBox type='VC' count={vc}  />
                </div>
              </div>
            )}
          </div>
        </ComModal>
      )}
    </div>
  );
};
export default PveResultModal;
