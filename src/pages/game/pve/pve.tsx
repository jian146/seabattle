import BackBtn from '@/components/backBtn/backBtn';
import mapImg0 from '@/assets/images/pve/map/0.png';
import mapImg1 from '@/assets/images/pve/map/1.png';
import mapImg2 from '@/assets/images/pve/map/2.png';
import logIcon from '@/assets/images/pve/logIcon.png';
import { T_Hero } from '@/types/hero';
import { useState ,useEffect} from 'react';
import { FormattedMessage,history} from 'umi';
import styles from './pve.less';
import Button from '@/components/Button/button';
import PveSelectHero from './pveSelectHero/pveSelectHero';
import PveLogModel from './pveFight/logModel/logModel';
import { useWeb3React } from '@web3-react/core';
import { comCheck, queryAndApprove } from '@/web3';
import { message } from 'antd';
import { abiBattle } from '@/web3/pve';
import AllLoading from '@/components/loading/allLoading';
import PveFight from './pveFight/pveFight';
import EquipBox from '@/components/equipBox/equipBox';

interface I_map {
  id: number;
  title: string;
  disabled: boolean;
  min: number;
  max: number;
  img: string;
  desc: string;
}
export const pveMap: I_map[] = [
  {
    id: 0,
    title: 'map0',
    disabled: false,
    min: 1,
    max: 3,
    img: mapImg0,
    desc: 'desc0',
  },
  {
    id: 1,
    title: 'map1',
    disabled: true,
    min: 4,
    max: 6,
    img: mapImg1,
    desc: 'desc1',
  },
  {
    id: 2,
    title: 'map2',
    disabled: true,
    min: 9,
    max: 12,
    img: mapImg2,
    desc: 'desc2',
  },
];
const PvePage = () => {
  const [loading, setLoading] = useState(false);
  const [hero, setHero] = useState<T_Hero>();
  const [selectMapIndex, setSelectMapIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowLog,setIsShowLog]=useState(false);
  const [isShowFight,setIsShowFight] = useState(false);
  const [battleId,setBattleId]=useState<string>();
  const { library, account } = useWeb3React()
  useEffect(()=>{
    
    const initBattleId=history.location.query?.battleId
    if(initBattleId){
      setIsShowFight(true)
      setBattleId(initBattleId as string)

    }

  },[])
  const onBack=()=>{
    history.replace('/game/pve')       
    setIsShowFight(false)
  }

  const onPve=async (selectHero:T_Hero,lv:number) => {
    // setHero({ ...hero });
    setLoading(true)
    const goldPrice=1000
    //检查余额
    const isOk=await comCheck(library,goldPrice,2)
    if(!isOk){
      setLoading(false)
      return message.info("Sorry, your credit is running low !")

    }
    //检查授权
    const address = account ? account : await library.getSigner().getAddress()
    const isPass=await queryAndApprove(library,address,'pve','VC')
    if (!isPass) {
      //授权失败
      message.warn('approve error');
      return setLoading(false);
    }
    setHero({...selectHero})
    try {
      const res= await abiBattle(library, selectMapIndex, lv, selectHero.tokenId)
      if (res.events) {
        
        for (const event of res.events) {
          if (event.event === 'OnBattle'){
            const abiBattleId=event?.args?.batlleId.toHexString()
            // history.push('/game/pveFight/'+battleId)
            // setIsShowFight(true)
            history.replace('/game/pve?battleId='+abiBattleId)
            setBattleId(abiBattleId)
            setIsOpen(false);
            setLoading(false)         
            setIsShowFight(true)
          }
        }
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
    
   

    // setIsOpen(false);
    // history.push('/game/pveFight/1')
  }
  return (
    
      !isShowFight?<div className={`${styles.page}`}>
      <AllLoading loading={loading} />
      <div className="topRow">
      <BackBtn onBack={()=>{history.push('/')}} />
          <span>
            <FormattedMessage id={'home.pve'} />
          </span>
          <div className={styles.log} onClick={()=>{setIsShowLog(true)}}>
            <img src={logIcon} />
            <FormattedMessage id={'pve.combatRecord'} />
          </div>
        </div>
        <div className={`center ${styles.content}`}>
          <div className={styles.left}>
            {pveMap.map((map,index) => {
              return (
                <div
                  className={`${styles.mapItem} ${selectMapIndex!==index&&styles.unActive} ${map.disabled&&styles.unOpenMapItem}` }
                  key={map.id}
                  onClick={()=>{
                    if(!map.disabled){
                      setSelectMapIndex(index)
                    }

                  }}
                  // style={{
                  //   backgroundImage: `url(${map.img})`,
                  // }}
                >
                  <img className={styles.bgImg} alt='' src={map.img} />
                  <div className={styles.openBack}>
                    {/* <img src={lockmg} className={styles.lockImg} /> */}
                    <FormattedMessage id={`pve.comingSoon`} />
                  </div>
                  <div className={styles.title}>
                    <FormattedMessage id={`pve.map.${map.title}`} />
                    <span className={styles.lvLimit}>
                      LV{map.min}~LV{map.max}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.right}>
            <div className={styles.rowLabel}>
              <FormattedMessage
                id={`pve.map.${pveMap[selectMapIndex].title}`}
              />
            </div>
            <div className={styles.description}>
              <FormattedMessage id={`pve.map.${pveMap[selectMapIndex].desc}`} />
            </div>
            <div className={styles.rowLabel}>
              <FormattedMessage id={`pve.drop`} />
            </div>
            <div className={styles.dropList}>
              <div className={styles.dropItem}>
              <EquipBox type='VC' isShowName={false}   />
              </div>
                
            </div>
            <div className={`${styles.btnRow} flexCenter`}>
              <Button
                onClick={() => {
                  setIsOpen(true);
                }}
                type={2}
              >
                <FormattedMessage id={`pve.start`} />
              </Button>
            </div>
          </div>
        </div>
        <PveSelectHero
          mapIndex={selectMapIndex}
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          onChose={onPve}
        />
        <PveLogModel open={isShowLog} onClose={() => {setIsShowLog(false)}}/>
    </div>:<>
    
    {battleId&&<PveFight selectHero={hero} battleId={battleId} backCall={onBack} />}
    </>
    
    
  );
};
export default PvePage;

