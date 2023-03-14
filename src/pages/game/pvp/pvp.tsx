import BackBtn from '@/components/backBtn/backBtn'
import PageLoading from '@/components/loading/loading'
import mapImg0 from '@/assets/images/pvp/map/0.png'
import mapImg1 from '@/assets/images/pvp/map/1.png'
import mapImg2 from '@/assets/images/pvp/map/1.png'
import goldImg from '@/assets/images/pvp/gold.png'
import logIcon from '@/assets/images/pve/logIcon.png'
import { T_Hero } from '@/types/hero'
import { useState } from 'react'
import { FormattedMessage, history } from 'umi'
import styles from './pvp.less'
import Button from '@/components/Button/button'
import PveSelectHero from '../pve/pveSelectHero/pveSelectHero'
import PveLogModel from '../pve/pveFight/logModel/logModel'

interface I_map {
  id: number
  title: string
  disabled: boolean
  min: number
  max: number
  img: string
  desc: string
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
]
const PvpPage = () => {
  const [loading, setLoading] = useState(false)
  const [hero, setHero] = useState<T_Hero>()
  const [selectMapIndex, setSelectMapIndex] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isShowLog, setIsShowLog] = useState(false)
  return (
    <div className={`${styles.page}`}>
      <PageLoading loading={loading}>
        <div className="topRow">
         <BackBtn onBack={()=>{history.push('/')}} />
          <span>
            <FormattedMessage id={'home.pvp'} />
          </span>
          <div
            className={styles.log}
            onClick={() => {
              setIsShowLog(true)
            }}
          >
            <img src={logIcon} />
            <FormattedMessage id={'pve.combatRecord'} />
          </div>
        </div>
        <div className={`center ${styles.content}`}>
          <div className={styles.left}>
            {pveMap.map((map) => {
              return (
                <div
                  className={`${styles.mapItem} ${map.disabled && 'disabled'}`}
                  key={map.id}
                  style={{
                    backgroundImage: `url(${map.img})`,
                  }}
                >
                  <div className={styles.title}>
                    <FormattedMessage id={`pve.map.${map.title}`} />
                    <span className={styles.lvLimit}>
                      LV{map.min}~LV{map.max}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.right}>
            <div className={styles.head}>
              <div className={styles.headTitle}>
                <FormattedMessage id={'pvp.pool'} />
              </div>
              <div className={styles.pool}>1234578</div>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id={'pvp.ranking'} />
                  </th>
                  <th>
                    <FormattedMessage id={'pvp.address'} />
                  </th>
                  <th>
                    <FormattedMessage id={'pvp.victoryField'} />
                  </th>
                  <th>
                    <FormattedMessage id={'pvp.reward'} />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className={styles.rank}>1</div>
                  </td>
                  <td>1234****2345</td>
                  <td>188 </td>
                  <td>
                    <img className={styles.goldImg} src={goldImg} />
                    100000
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className={styles.rank}>2</div>
                  </td>
                  <td>1234****2345</td>
                  <td>188 </td>
                  <td>
                    <img className={styles.goldImg} src={goldImg} />
                    100000
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className={styles.rank}>3</div>
                  </td>
                  <td>1234****2345</td>
                  <td>188 </td>
                  <td>
                    <img className={styles.goldImg} src={goldImg} />
                    100000
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className={styles.rank}>4</div>
                  </td>
                  <td>1234****2345</td>
                  <td>188 </td>
                  <td>
                    <img className={styles.goldImg} src={goldImg} />
                    100000
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className={styles.rank}>5</div>
                  </td>
                  <td>1234****2345</td>
                  <td>188 </td>
                  <td>
                    <img className={styles.goldImg} src={goldImg} />
                    100000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <PveSelectHero
          mapIndex={selectMapIndex}
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
          onChose={() => {
            // setHero({ ...hero });
            setIsOpen(false)
            history.push('/game/pveFight/1')
          }}
        />
        <PveLogModel
          open={isShowLog}
          onClose={() => {
            setIsShowLog(false)
          }}
        />
      </PageLoading>
    </div>
  )
}
export default PvpPage
