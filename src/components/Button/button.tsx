import styles from './button.less'
import btn1Img from '@/assets/images/com/btnBlue.png'
import btn2Img from '@/assets/images/com/btnGreen.png'
import btn3Img from '@/assets/images/com/btnPurple.png'
import btn4Img from '@/assets/images/com/btnRed.png'

interface I_Button{
    onClick?:()=>void
    disabled?:boolean
    className?: string | undefined
    style?:React.CSSProperties 
    type?: number 
    size?:string
}
const Button:React.FC<I_Button>=(props)=>{
    const butImgList=[
        btn1Img,btn1Img,btn2Img,btn3Img,btn4Img
    ]
    const {onClick,className,style,type=0,disabled=false,size}=props
    return <div className={`${styles.button} ${className} ${disabled&&styles.disabled} ${size&&styles[size]} comBtn`} onClick={()=>{!disabled&&onClick&&onClick()}} style={{
       
        ...style,
        backgroundImage:type?`url(${butImgList[disabled?0:type]})`:'',
    }}>
        {props.children}
    </div>
}
export default Button