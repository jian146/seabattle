import styles from './myModel.less'
interface I_MyModel{
    open:boolean;
    isCloseByMask?:boolean;
    onClose?:() => void;
}
const MyModel:React.FC<I_MyModel>=({open,isCloseByMask,onClose})=>{
    if (!open)return <></>
    return <div className={styles.mask} onClick={()=>{isCloseByMask&&onClose&&onClose()}}>
        <div className={styles.content}></div>
    </div>
}
export default MyModel