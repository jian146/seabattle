import ComModal from '@/components/Dialog/com'
import modalClosImg from '@/assets/images/heroIsland/modalClose.png'
import closeHeroImg from '@/assets/images/heroIsland/closeHero.png'
import { CaretDownOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'umi'
import styles from './pveSelectHero.less'
import Button from '@/components/Button/button'
import { Select, Spin, message } from 'antd'
import { pveMap } from '../pve'
import { useEffect, useState } from 'react'
import { T_Hero } from '@/types/hero'
import { getMyHeroApi } from '@/api/hero'
import { useWeb3React } from '@web3-react/core'

import { getHeroImgData, getTotal } from '@/utils/hero'
import { subTokenId } from '@/utils/account'
const PveSelectHero: React.FC<{
  open: boolean
  mapIndex: number
  onClose: () => void
  onChose: (hero: T_Hero, lv: number) => void
}> = (props) => {
  const { Option } = Select
  const { open, onChose, onClose, mapIndex } = props
  const { account, library } = useWeb3React()
  const currentMap = pveMap[mapIndex]
  const [lv, setLv] = useState(currentMap.min)
  const [selectHero, setSelectHero] = useState<T_Hero>()
  const [heroList, setHeroList] = useState<T_Hero[]>([])
  const [loading, setLoading] = useState(false)
  const showPrice=1000*lv
  useEffect(() => {
    if (open) {
      init()
    }
  }, [library, account, open])

  const getFilterHeroList = heroList
    .filter((item) => {
      return !!lv && item.level >= lv && item.color !== 6
    })
    .sort((a, b) => {
      return getTotal(b) - getTotal(a)
    })
    .sort((a, b) => {
      return b.level - a.level
    })
  const init = async () => {
    if (!(account && library)) return
    setLoading(true)
    const address = account ? account : await library.getSigner().getAddress()
    await getMyHero(address)
    setLoading(true)
  }

  const renderLv = () => {
    let domArr: React.ReactNode[] = []
    for (let i = currentMap.min; i <= currentMap.min; i++) {
      domArr.push(
        <Option value={i} key={i} className={styles.option}>
          <div className={styles.lvOption}>LV{i}</div>
          
        </Option>,
      )
    }
    return domArr
  }
  const renderHero = () => {
    let domArr: React.ReactNode[] = []
    for (let i = 0; i < getFilterHeroList.length; i++) {
      const item = getFilterHeroList[i]
      const heroImgData = getHeroImgData(item.occupation, item.color)
      domArr.push(
        <Option value={item.tokenId} key={item.tokenId} className={styles.option}>
          <div className={styles.heroOpaion}>
            <span>
              <span className={styles.occupation}>
                <FormattedMessage id={`${heroImgData.name}`} />
              </span>
            </span>

            <span className={styles.selectlV}>LV{item.level}</span>
            <span>
              <FormattedMessage id={`totalAttributes`} />:{getTotal(item)}
            </span>
          </div>
        </Option>,
      )
    }
    return domArr
  }
  //获取我的英雄
  const getMyHero = async (address: string) => {
    const res = await getMyHeroApi(address)
    setHeroList(res)
  }
  return (
    <div>
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

            <div className={styles.closeContent}>
              <img className={styles.closeHeroImg} src={closeHeroImg} />
              <div className={styles.message}>
                <div className={styles.row}>
                  <span>
                    <FormattedMessage id={`pve.replicaLevel`} />
                  </span>
                  <div id="lvBox">
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('lvBox') ?? document.body
                      }
                      value={lv}
                      showArrow={true}
                      onChange={(value) => {
                        setLv(value)
                      }}
                      bordered={false}
                      suffixIcon={
                        <div className={styles.languageSelect}>
                          <CaretDownOutlined />
                        </div>
                      }
                    >
                      {renderLv()}
                    </Select>
                  </div>
                </div>
                <div className={styles.row}>
                  <span>
                    <FormattedMessage id={`pve.selectHeroes`} />
                  </span>
                  <div id="selectHero">
                    <Select
                    style={{
                      width:310
                    }}
                      getPopupContainer={() =>
                        document.getElementById('selectHero') ?? document.body
                      }
                      value={selectHero?.tokenId}
                      showArrow={true}
                      placeholder={useIntl().formatMessage({
                        id: 'pve.selectHeroes',
                      })}
                      onChange={(value: string) => {
                        const findHero = heroList.find(
                          (item) => item.tokenId == value,
                        )
                        findHero && setSelectHero({ ...(findHero as T_Hero) })
                      }}
                      bordered={false}
                      suffixIcon={
                        <div className={styles.languageSelect}>
                          <CaretDownOutlined />
                        </div>
                      }
                    >
                      {renderHero()}
                    </Select>
                  </div>
                </div>
                <div className={styles.row}>
                  <span>TOKENID</span>
                  <span>
                    {selectHero ? subTokenId(selectHero.tokenId) : ''}
                  </span>
                </div>
              </div>
              <div className={styles.btnRow}>
                <Button
                  type={2}
                  size="big"
                  onClick={() => {
                    if (selectHero) {
                      onChose(selectHero, lv)
                    } else {
                      message.info('Please select a hero !')
                    }
                  }}
                >
                  <div className={styles.btnLabel}>
                    <span>
                      <FormattedMessage id={`pve.enterCopy`} />
                    </span>
                    <span className={styles.price}>{showPrice} VC</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </ComModal>
      )}
    </div>
  )
}
export default PveSelectHero
