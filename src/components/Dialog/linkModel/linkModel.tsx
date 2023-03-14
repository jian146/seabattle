import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import ComModal from '../com';
import styles from './linkModel.less';
import closeImg from '@/assets/images/com/closeIcon2.png'
import { FormattedMessage,history } from 'umi';
import {useState} from 'react';
import { subTokenId } from '@/utils/account';
import copyImg from '@/assets/images/com/copy.png'
import { getInviteInfoApi } from '@/api/hero';
import { copyText } from '../../../utils/copy';
import { BignumerToString } from '@/utils/BigNumberHelper';
const LinkModel: React.FC<{
  onClose: () => void;
  open: boolean;
  isEN:boolean

}> = ({ open, onClose, isEN}) => {
  const { account, library } = useWeb3React();
  const [palayerAddress,setPlayerAddress]=useState('')
  const [reward,setReward]=useState<{inviteCount:string,inviteFee:string}>({inviteCount:'0',inviteFee:'0'})

 
  const baseAddress =process.env.NODE_ENV=='production' ?(window as any).document.domain:(window as any).document.location.host
  const linkAddress=baseAddress+'/game/drawCard?id='
  useEffect(() => {
    if(open){
      init();
    }
   
  }, [open,account, library]);
  const init = async () => {
    if (!(account && library)) return;
    const address = account ? account : await library.getSigner().getAddress();
    setPlayerAddress(address)
    // debugger
    getInviteInfoApi(address).then((res)=>{
      if(res){
        setReward({
          inviteCount:res.inviteCount+'',
          inviteFee:BignumerToString(res.inviteFee)+''
        })
      }

    })
  };

  const onCopy=()=>{
    copyText(linkAddress+palayerAddress)

  }
  return (
    <div className={styles.linkModel}>
      <ComModal
        open={open}
        // bodyStyle={{display:'none'}}
      >
        <div className={styles.content}>
          <img onClick={onClose} className={styles.closeImg} src={closeImg} />
          <div className={`${styles.main} ${styles.mainEn}`} >
            <div className={`${styles.title}`}>
              <FormattedMessage id="home.link.InvitationRewards" />
              <span className={`${styles.shareTime}`}><FormattedMessage id="home.link.time" /></span>
            </div>
            <div className={styles.pItem}><FormattedMessage id="home.link.des1" /></div>
            <div className={styles.pItem}><FormattedMessage id="home.link.des2" /></div>
            <div className={styles.pItem}><FormattedMessage id="home.link.des3" /></div>
            <div className={styles.linkBox}>
              <span><FormattedMessage id="home.link.linkAddress" /></span>
              <span className={styles.address}>{linkAddress+subTokenId(palayerAddress, 2, 1)}</span>
              <span><img onClick={onCopy} className={styles.copyImg} src={copyImg} /></span>
            </div>
            <div className={styles.rewardRow}>
              <span><FormattedMessage id="home.link.count" />{` `+reward.inviteCount}<FormattedMessage id="home.link.people" /></span>
              <span><FormattedMessage id="home.link.reward" />{` `+reward.inviteFee+` `}VC</span>
            </div>
          </div>
         
        </div>
      </ComModal>
    </div>
  );
};
export default LinkModel;
