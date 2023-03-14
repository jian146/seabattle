import BackBtn from '@/components/backBtn/backBtn'
import Button from '@/components/Button/button'
import { useEffect, useState } from 'react'
import { FormattedMessage,history } from 'umi'
import styles from './card.less'
import bookImg from '@/assets/images/card/book.png'
import { buyCardApi, getMyHeroApi, upgradeApi } from '@/api/hero'
import { useWeb3React } from '@web3-react/core'
import { checkAccount } from '@/utils/account'
import { buyHeroAbi, getCardInfoAbi, uploadHeroAbi } from '@/web3/hero'
import { T_Hero } from '@/types/hero'
import { message } from 'antd'
import Balance from '@/components/balance/balance'
import AllLoading from '@/components/loading/allLoading'
import HeroCard2 from '@/components/heroCard2/heroCard2'
import { ethers } from 'ethers'

export const mockHero: T_Hero = {
  tokenId: '0x092285a9bdc6dba573ef2330952582af28d4987deda7d960ebb751bfba263d',
  owner: '',
  level: 1,
  //力量
  strength: 1,
  //敏捷
  agility: 2,
  //体力
  stamina: 3,
  //意志
  will: 4,
  //智力
  intelligence: 5,
  //精神
  mind: 6,
  bornTime: 0,
  jobLastTime: 0, //寿命
  jobTimes: 0, //工作时长
  color: 1,
  occupation: 1,
}
const CardPage = () => {
  const { account, library } = useWeb3React()

  const price = 0.1
  const [isShow, setIsShow] = useState(false)

  const [myHero, setMyHero] = useState<T_Hero[]>()
  const [loading, setLoading] = useState(false)
  const [cardInfo, setCardInfo] = useState<{maxCount:number,drawCount:number}>({maxCount:0,drawCount:0})

  const invite=history.location.query?.id??ethers.constants.AddressZero

  const [isLoad,setIsLoad]=useState(false)
  useEffect(() => {
    checkAccount(account, library)
    init()
  }, [library, account])

  const init = async () => {
    setLoading(true)
    await getCardInfo()
    // await getMyHero()
    setLoading(false)
  }
  const getCardInfo=async ()=>{
    const res=await getCardInfoAbi(library)

    if(res){
      setCardInfo({...res})
    }
   
  }
  const getMyHero = async () => {
    if (!account) return
    setIsShow(true)
    const res = await getMyHeroApi(account)
    const redHero=res.find((item)=>item.color===6)??mockHero
    const yeelyHero=res.find((item)=>item.color===5)??mockHero
    const blueHero=res.find((item)=>item.color===4)??mockHero
    setMyHero([res[0],res[1],res[2],res[3],res[4],res[5],res[6],blueHero,yeelyHero,redHero])
    // setMyHero([res[0]])
    // setIsShow(true)
  }
  const drawCard = async (count = 1) => {
    setIsShow(false)
    setLoading(true)
    const tradeNo = await buyHeroAbi(library, count,invite as string)
    setIsShow(true)
    if (tradeNo) {
      const res = await buyCardApi(tradeNo)
      if (!!res && res.length > 0) {        
        setMyHero( [...res])           
      }
      getCardInfo()
      setIsLoad(!isLoad)
      setLoading(false)
    } else {
      message.error('error')
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.page}`}>
      <AllLoading loading={loading} />
      {/* {isShow&&<div className={styles.light}></div>} */}
      
      <div className={styles.topRow}>
       <BackBtn onBack={()=>{history.push('/')}} />
        <span>
          <FormattedMessage id={'home.drawCard'} />
        </span>
      </div>
      {/* 余额和充值入口 */}
      <div className={styles.blancesBox}>
        <Balance isLoad={isLoad} />
      </div>
      {/* 抽卡余额 */}
      <div className={styles.countBox}>
        <div>
          <div className={styles.countValue}>{cardInfo.maxCount-cardInfo.drawCount}</div>
          <div className={styles.countLabel}>
            <FormattedMessage id="card.remainingCards" />
          </div>
        </div>

        {/* 进度条 */}
        <div className={styles.progress}>
          <div className={styles.progressBar}
          style={{
            width:`${ cardInfo.drawCount/cardInfo.maxCount*100}%`
          }}
          ></div>
        </div>
      </div>
      {/* {isShow ? (
        <div className={styles.DrawHeroBox}>
           <div className={styles.backCardBox2}>
            <img className={`${styles.backCard} ${styles.back1}`} src={backImg} />

          </div>
          <div  className={styles.heroBox} >{!loading && myHero && <HeroCard hero={myHero[0]} />}</div>
         
        </div>
      ) : (
        <img className={styles.bookImg} alt="draw" src={bookImg} />
      )} */}
      {isShow?<div className={styles.DrawHeroBoxTen}>
          <div  className={styles.heroBox} >{!loading && myHero && <div className={styles.heroBoxTen}>
            
            {
              myHero.map((heroItem,index)=>{
                return <HeroCard2 key={index} index={index} hero={heroItem} />

              })
            }
            </div>}</div>
         
        </div>:<img className={styles.bookImg} alt="draw" src={bookImg} />}

      <div className={styles.btnRow}>
        {isShow ? (
          <>
            <Button
              className={styles.againBtn}
              onClick={() => {
                setIsShow(false)
              }}
            >
              <div className={`${styles.btnBox} `}>
                <span>
                  <FormattedMessage id={'back'} />
                </span>
              </div>
            </Button>
            {
              myHero?.length===10?      <Button
              className={styles.againBtn}
              onClick={() => {
                drawCard(10)
              }}
            >
              <div className={`${styles.btnBox} `}>
                <span>
                  <FormattedMessage id={'card.drawAgainTen'} />
                </span>
              </div>
            </Button>:      <Button
              className={styles.againBtn}
              onClick={() => {
                drawCard(1)
              }}
            >
              <div className={`${styles.btnBox} `}>
                <span>
                  <FormattedMessage id={'card.drawAgain'} />
                </span>
              </div>
            </Button>
            }
      
          </>
        ) : (
      <>
          <Button
            onClick={() => {
              drawCard(1)
            }}
          >
            <div className={styles.btnBox}>
              <span>
                <FormattedMessage id={'card.drawOnce'} />
              </span>
              <span className={styles.price}>{price} BNB</span>
            </div>
          </Button>
          <Button
            onClick={() => {
              // getMyHero()

              drawCard(10)
            }}
          >
            <div className={styles.btnBox}>
              <span>
                <FormattedMessage id={'card.drawTen'} />
              </span>
              <span className={styles.price}>{price*10} BNB</span>
            </div>
          </Button>
      </>
        )}
      </div>
    </div>
  )
}
export default CardPage
