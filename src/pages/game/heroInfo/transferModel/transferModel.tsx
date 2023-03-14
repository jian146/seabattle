import modalClosImg from '@/assets/images/heroIsland/modalClose.png';
import { T_Hero } from '@/types/hero';
import { useWeb3React } from '@web3-react/core';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import closeHeroImg from '@/assets/images/heroIsland/closeHero.png';
import styles from './transferModel.less';
import ComModal from '@/components/Dialog/com';
import Button from '@/components/Button/button';
import { FormattedMessage, useIntl } from 'umi';
const TransferModel: React.FC<{
  onClose: () => void;
  open: boolean;
  onInputPlayer: (address: string) => void;
}> = ({ open, onClose, onInputPlayer }) => {
  const { account, library } = useWeb3React();
  const { formatMessage } = useIntl();
  const [value,setValue] =useState('')
  useEffect(() => {
    init();
  }, [open]);
  const init = async () => {};

  return (
    <div className={styles.choseHeroModel}>
      <ComModal
        open={open}
        // bodyStyle={{display:'none'}}
      >
        <div className={styles.content}>
          <div className={styles.head}>
            <div className={styles.select}></div>
            {/* 关闭图标 */}
            <img
              onClick={onClose}
              className={styles.closeImg}
              src={modalClosImg}
              alt="closeImg"
            />
          </div>
          <div className={styles.closeContent}>
            <img className={styles.closeHeroImg} src={closeHeroImg} />
            <div className={styles.title}>
                <FormattedMessage id={'heroInfo.transferHero'} />
              </div>
            <div className={styles.message}>
            
              <Input value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder={ formatMessage({ id: 'heroInfo.inputInof' })} />
            </div>
            <div className={styles.btnRow}>
              <Button size="big" type={2} onClick={()=>{onInputPlayer(value)}}>
                <FormattedMessage id={'heroInfo.okTransfer'} />
              </Button>
            </div>
          </div>
        </div>
      </ComModal>
    </div>
  );
};
export default TransferModel;
