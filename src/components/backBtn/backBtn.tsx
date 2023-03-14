import backBtnImg from '@/assets/images/com/backBtn.png'
import {history } from 'umi'
import styles from './backBtn.less'
const BackBtn:React.FC<{onBack?:()=>void}>=(props)=>{
    const onBack=()=>{
        if (history.length > 1) {
            props.onBack?props.onBack():history.goBack()
          } else {
            history.replace('/');
          }

    }
    return <img alt='back' onClick={onBack}  src={backBtnImg} className={`${styles.backBtn} backbtn`} />

}
export default BackBtn