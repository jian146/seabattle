import { Occupation, T_Hero } from "@/types/hero";
import warriorImg from '@/assets/images/hero/1.png'
import hero2 from '@/assets/images/hero/2.png'
import hero3 from '@/assets/images/hero/3.png'
import hero4 from '@/assets/images/hero/4.png'
import hero6 from '@/assets/images/hero/6.png'
import warriorHeadImg from '@/assets/images/hero/head/heroHead1.png'
import headImg2 from '@/assets/images/hero/head/heroHead2.png'
import headImg3 from '@/assets/images/hero/head/heroHead3.png'
import headImg4 from '@/assets/images/hero/head/heroHead4.png'
import heroHead6 from '@/assets/images/hero/head/heroHead6.png'

import icon1Img from '@/assets/images/hero/icon/1.png'
import icon2Img from '@/assets/images/hero/icon/2.png'
import icon3Img from '@/assets/images/hero/icon/3.png'
import icon4Img from '@/assets/images/hero/icon/4.png'
import icon6Img from '@/assets/images/hero/icon/6.png'

import drawIcon1Img from '@/assets/images/hero/drawIcon/1.png'
import drawIcon2Img from '@/assets/images/hero/drawIcon/2.png'
import drawIcon3Img from '@/assets/images/hero/drawIcon/3.png'
import drawIcon4Img from '@/assets/images/hero/drawIcon/4.png'
import drawIcon6Img from '@/assets/images/hero/drawIcon/6.png'
export const heroOccupationsList=[
    {
        name:'auto',
        img:warriorImg,
        headImg:warriorHeadImg,
        icon:icon1Img,
        drawIcon:drawIcon1Img
    },
    {
        name:'warrior',
        img:warriorImg,
        headImg:warriorHeadImg,    
        icon:icon1Img, 
        drawIcon:drawIcon1Img
    },
    {
        name:'mage',
        img:hero2   ,
        headImg:headImg2,  
        icon:icon2Img,
        drawIcon:drawIcon2Img
    },     
    {
        name:'hunter',
        img:hero3     ,
        headImg:headImg3,
        icon:icon3Img,
        drawIcon:drawIcon3Img
    },
    {
        name:'assassin',
        img:hero4    ,
        headImg:headImg4,  
        icon:icon4Img,
        drawIcon:drawIcon4Img
    },
    {
        name:'pirate',
        img:hero6    ,
        headImg:heroHead6,  
        icon:icon6Img,
        drawIcon:drawIcon6Img
    },
]
export const getHeroImgData=(occupation:Occupation,color=1)=>{
    return color===6?heroOccupationsList[5]:heroOccupationsList[occupation]

}
export const getTotal=(hero:T_Hero)=>{
    return   hero.stamina+hero.strength+hero.agility+hero.will+hero.mind+hero.intelligence

}