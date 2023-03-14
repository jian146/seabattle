import { BignumerToString } from '@/utils/BigNumberHelper'
import { getMyBNB, getMyVC } from '@/web3'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import coinImg from '@/assets/images/home/coin@2x.png'
import bnbImg from '@/assets/images/com/bnbIcon.png'
import addImg from '@/assets/images/home/addBtn.png'
import styles from './balance.less'
import ExchangeModel from '../Dialog/exchangeModel/exchange'
const Balance: React.FC<{ onLoad?: () => void;isLoad?:boolean }> = ({
  onLoad,
  isLoad=false
}) => {
  const { library, account } = useWeb3React()
  const [myVC, setMyVC] = useState<BigNumber>()
  const [myBNB, setMyBNB] = useState<BigNumber>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!!account && !!library) {
      // gBalance();
      init()
    }
  }, [account, library,isLoad])

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
  return (
    <div className={styles.balanceGroup}>
      <div className={styles.balance}>
        <img className={styles.bnbImg} src={bnbImg} />
        <span className={styles.inputColor}>
          {myBNB ? parseFloat(BignumerToString(myBNB) ?? '0').toFixed(4) : '0.0'}
        </span>
      </div>
      <div className={styles.balance}>
        <img className={styles.coinImg} src={coinImg} />

        <span className={styles.inputColor}>
          {myVC ? parseFloat(BignumerToString(myVC) ?? '0').toFixed(2) : '0.0'}
        </span>
        <img
          onClick={() => {
            setOpen(true)
          }}
          className={styles.addImg}
          src={addImg}
        />
        <ExchangeModel
          open={open}
          onCall={init}
          onClose={() => {
            setOpen(false)
          }}
        />
      </div>
    </div>
  )
}
export default Balance
