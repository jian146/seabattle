import modalClosImg from '@/assets/images/heroIsland/modalClose.png'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'umi'
import bnbIcon from '@/assets/images/com/bnbIcon.png'
import nbIcon from '@/assets/images/home/coin@2x.png'
import bottomIcon from '@/assets/images/com/bottomIcon.png'
import ComModal from '../com'
import styles from './exchange.less'
import { InputNumber, message, Slider } from 'antd'
import Button from '@/components/Button/button'
import { BigNumber, ethers } from 'ethers'
import { getMyBNB, getMyVC, queryAndApprove } from '@/web3'
import {
  BignumerToNumber,
  BignumerToString,
  stringToBignumer,
} from '@/utils/BigNumberHelper'
import { swapBNBAbi, swapTokenAbi } from '@/web3/nb'
import AllLoading from '@/components/loading/allLoading'

export const swapNumber = 50000
const ExchangeModel: React.FC<{
  onClose: () => void
  open: boolean
  onCall?: () => void
}> = ({ open, onClose,onCall=()=>{} }) => {
  //1 BNB 换 50000 金币

  const { account, library } = useWeb3React()
  const Options = [
    {
      value: '0',
      label: 'BNB',
    },
    {
      value: '1',
      label: 'VC',
    },
  ]
  const [myVC, setMyVC] = useState<BigNumber>()
  const [myBNB, setMyBNB] = useState<BigNumber>()
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [isBNBTop, setIsBNBTop] = useState(true) //0:BNB=>VC     1:VC=>BNB
  const [loading, setLoading] = useState(false)
  const [slider, setSlider] = useState(0)
  useEffect(() => {
    if (open) {
      init()
    }
  }, [open, account, library])
  const init = async () => {
    if (!(account && library)) return
    setLoading(true)
    const address = account ? account : await library.getSigner().getAddress()
    const myBNBRes = await getMyBNB(library, address)
    const myNBRes = await getMyVC(library, address)
    setMyVC(myNBRes)
    setMyBNB(myBNBRes)
    setLoading(false)
  }

  const formatText = (b: BigNumber) => {
    return parseFloat(BignumerToString(b) ?? '0').toFixed(6)
  }
  const onChangeValue = (value: string, type: 1 | 2) => {
    const numberValue = parseFloat(value)
    const newValue = numberValue + ''

    const otherValue =
      type === 1 ? numberValue * swapNumber : numberValue / swapNumber
    if (type === 1) {
      setValue1(newValue)
      setValue2(otherValue + '')
    } else {
      setValue2(newValue)
      setValue1(otherValue + '')
    }
  }
  const onExchange = (isBNBTop: boolean) => {
    setIsBNBTop(!isBNBTop)
  }
  const onSubmit = async () => {
    try {
      if (!(account && library)) return

      setLoading(true)

      const number1 = parseFloat(isBNBTop ? value1 : value2)
      if (isNaN(number1)) {
        setLoading(false)
        message.info('Invalid redeemed value ! 兌換的值無效!')
        return
      }
      const bigNumberValue = stringToBignumer(isBNBTop ? value1 : value2)
      if (!isBNBTop) {
        //NB兑换BNB需要授权

        //验证余额,换的超出余额
        if (myVC && number1 > BignumerToNumber(myVC)) {
          setLoading(false)
          return message.info('Sorry, Insufficient VC')
        }
        const isPass = await queryAndApprove(library, account, 'nb_pool', 'NB')
        if (!isPass) {
          //授权失败
          setLoading(false)
          message.warn('approve error')
          return false
        }
      } else {
        //验证余额,换的超出余额
        if (myBNB && number1 > BignumerToNumber(myBNB)) {
          setLoading(false)
          return message.info('Sorry, Sorry, Insufficient BNB')
        }
      }
      const res = isBNBTop
        ? await swapTokenAbi(library, bigNumberValue)
        : await swapBNBAbi(library, bigNumberValue)
      await init()
      onCall()
      message.success('success')
    } catch (error) {
      setLoading(false)
    }
  }
  const maxOnClick = (type: 1 | 2) => {
    const value: BigNumber = (type == 1 ? myBNB : myVC) ?? BigNumber.from('0')
    onChangeValue(BignumerToString(value), type)
  }
  const BNB_Dom = (
    <div className={styles.row}>
      <div className={styles.row1}>
        <div className={styles.infoRow}>
          <img className={styles.bnbIcon} src={bnbIcon} />
          <span className={styles.coin}>BNB</span>
          {/* <Select value={'0'} options={Options} bordered={false} /> */}
        </div>
        <div className={styles.balance}>
          balance:{myBNB ? formatText(myBNB) : '0.0'}
        </div>
      </div>
      <div className={styles.input}>
        <InputNumber
        controls={false}
          addonAfter={
            <div onClick={() => maxOnClick(1)} className={styles.max}>
              Max
            </div>
          }
          value={value1}
          min={'0'}
          onChange={(value) => {
            onChangeValue(value ?? '0', 1)
          }}
        />
      </div>
    </div>
  )
  const VC_Dom = (
    <div className={styles.row}>
      <div className={styles.row1}>
        <div className={styles.infoRow}>
          <img className={styles.bnbIcon} src={nbIcon} />
          <span className={styles.coin}>VC</span>
          {/* <Select value={'1'} options={Options} bordered={false} /> */}
        </div>
        <div className={styles.balance}>
          balance:{myVC ? formatText(myVC) : '0.0'}
        </div>
      </div>
      <div className={styles.input}>
        <InputNumber
         controls={false}
          addonAfter={
            <div onClick={() => maxOnClick(2)} className={styles.max}>
              Max
            </div>
          }
          value={value2}
          min={'0'}
          onChange={(value) => {
            onChangeValue(value ?? '0', 2)
          }}
        />
      </div>
    </div>
  )
  return (
    <div className={styles.choseHeroModel}>
      <AllLoading loading={loading} />
      <ComModal
        open={open}
        // bodyStyle={{display:'none'}}
      >
        <div className={styles.content}>
          <div className={styles.head}>
            <div></div>
            <div>
              <FormattedMessage id={`exchange`} />
            </div>
            {/* 关闭图标 */}
            <img
              onClick={onClose}
              className={styles.closeImg}
              src={modalClosImg}
              alt="closeImg"
            />
          </div>
          {isBNBTop ? BNB_Dom : VC_Dom}

          <div className="flexCenter">
            <img
              className={styles.bottomIcon}
              src={bottomIcon}
              onClick={() => {
                onExchange(isBNBTop)
              }}
            />
          </div>
          {!isBNBTop ? BNB_Dom : VC_Dom}
          <div className={styles.slipPoint}>
            <span className={styles.label}>
              <FormattedMessage id={`slipPoint`} />
            </span>
            <div className={styles.slider}>
              <Slider
                value={slider}
                onChange={(value: number) => {
                  setSlider(value)
                }}
              />
            </div>
            <span className={styles.label}>{slider}%</span>
          </div>
          <div className={`flexCenter ${styles.btnRow}`}>
            <Button type={2} onClick={onSubmit}>
              <FormattedMessage id={`exchange`} />
            </Button>
          </div>
        </div>
      </ComModal>
    </div>
  )
}
export default ExchangeModel
