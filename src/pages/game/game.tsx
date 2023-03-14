import { getIsPcBySize } from '@/utils/isPc'
import { useEffect, useState } from 'react'
import { FormattedMessage, getLocale, history } from 'umi'
import styles from './game.less'
import coinImg from '@/assets/images/com/bnbIcon.png'
import pirateBoat from '@/assets/images/home/tag/pirateBoat.png'
import card from '@/assets/images/home/tag/card.png'

import pve from '@/assets/images/home/tag/pve.png'
import bookImg from '@/assets/images/home/book.png'
import linkImg from '@/assets/images/home/link.png'
import shareImg from '@/assets/images/home/share.png'
import telegramImg from '@/assets/images/home/telegram.png'
import twitterImg from '@/assets/images/home/twitter.png'
import heroIsland from '@/assets/images/home/tag/heroIsland.png'
import pvp from '@/assets/images/home/tag/pvp.png'
import { useWeb3React } from '@web3-react/core'
import { getPoolBNB } from '@/web3/nb'
import { ethers } from 'ethers'
import { message } from 'antd'
import TagInfo from './components/tagInfo/tagInfo'
import { getHeroCountApi } from '@/api/hero'
import LinkModel from '@/components/Dialog/linkModel/linkModel'

const Game = () => {
  const { account, library } = useWeb3React()
  const isPc = getIsPcBySize()

  const rootDom = document.getElementById('root')
  const widthDom = rootDom?.clientWidth ?? 0
  const heightDom = rootDom?.clientHeight ?? 0
  const [width, setWidth] = useState(widthDom)
  const [height, setHeight] = useState(heightDom)
  const [pool, setPool] = useState('0.0')
  const [isShowLink, setIsShowLink] = useState(false)
  const [heroCount, setHeroCount] = useState<{
    normal_num: number
    pirate_num: number
  }>({ normal_num: 0, pirate_num: 0 })
  const [isEN, setIsEn] = useState(false)
  const [isShowLinkMode, setIsShowLinkModel] = useState(false)
  const pageTagList = [
    {
      id: 'pirateBoat',
      path: '/game/pirateBoat',
      img: pirateBoat,
      pcTop: 240,
      pcLeft: 780,
      h5Top: 18.5,
      h5Left: 306.5,
      isAddTop: true,
      isAddLeft: false,
      isOpen: true,
      tagInfo: (
        <TagInfo key={pirateBoat} type="pirate" count={heroCount.pirate_num} />
      ),
    },
    {
      id: 'pve',
      path: '/game/pve',
      img: pve,
      pcTop: 95,
      pcLeft: 235,
      h5Top: 78.5,
      h5Left: 226.5,
      isAddTop: false,
      isAddLeft: false,
      isOpen: true,
    },
    {
      id: 'pvp',
      path: '/game/pvp',
      img: pvp,
      pcTop: 160,
      pcLeft: 283,
      h5Top: 3.5,
      h5Left: 163.5,
      isAddTop: true,
      isAddLeft: false,
      isOpen: false,
    },
    {
      id: 'drawCard',
      path: '/game/drawCard',
      img: card,
      pcTop: 64,
      pcLeft: 88,
      h5Top: 59.5,
      h5Left: 90.5,
      isAddTop: true,
      isAddLeft: isPc,
      isOpen: true,
    },
    {
      id: 'heroIsland',
      path: '/game/heroIsland',
      img: heroIsland,
      pcTop: 65,
      pcLeft: 410,
      h5Top: 56.5,
      h5Left: 53.5,
      isAddTop: false,
      isAddLeft: true,
      isOpen: true,
      tagInfo: (
        <TagInfo key={heroIsland} count={heroCount.normal_num} type="hero" />
      ),
    },
  ]
  const resizeUpdate = () => {
    // 通过事件对象获取浏览器窗口的高度
    let h = rootDom?.clientHeight ?? 0
    setHeight(h)
    let w = rootDom?.clientWidth ?? 0
    setWidth(w)
  }
  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate)
    getIsPcBySize()
    // getMock()
  

    
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate)
    }
  }, [])

  useEffect(() => {
    getPool()
    getheroCount()
    getLocale() === 'en-US' ? setIsEn(true) : setIsEn(false)
  }, [account, library])

  const getheroCount = async () => {
    const res = await getHeroCountApi()
    if (res) {
      setHeroCount({ ...res })
    }
  }
  const getPool = async () => {
    if (library) {
      const res = await getPoolBNB(library)
      if (res) {
        const BNB= ethers.utils.formatEther(res)
        setPool(parseFloat(BNB).toFixed(2))
      }
    }
  }
  const getMock = () => {
    const value = 8 + 8 + 6
    const initBottom = 200
    const initLeft = 1000
    for (let i = 1; i <= value; i++) {
      if (i <= 8) {
        console.log(`${(i * 100) / value}%{
          bottom: ${((initBottom - i * 10) / 1080) * 100}%;
          left: ${((initLeft - i * 10) / 1920) * 100}%;
          background-image: url(~@/assets/images/home/animation/ship/toBottom${
            i + 1
          }.png);
        }`)
      }
    }
    // for (let i = 1;i<=value ;i++){
    //   console.log(`${i*100/value}%{
    //     bottom: ${initBottom-(i*10)}px;
    //     left: ${initLeft-(i*10)}px;
    //     background-image: url(~@/assets/images/home/animation/ship/toBottom${i+1}.png);
    //   }`)

    // }
  }
  const getAll = () => {
    const domList = document.getElementsByClassName('testDom')
    for (let i = 0; i < domList.length; i++) {
      const dom = domList[i]
      const left = (dom as any).offsetLeft
      const top = (dom as any).offsetTop
      let centerLeft = 0,
        centerTop = 0
      let isAddTop = true,
        isAddLeft = true
      if (width / 2 > left) {
        centerLeft = width / 2 - left
        isAddLeft = false
      } else {
        centerLeft = left - width / 2
      }
      if (height / 2 > top) {
        centerTop = height / 2 - top
        isAddTop = false
      } else {
        centerTop = top - height / 2
      }
      console.clear()
      console.log(dom.innerHTML, {
        top,
        left,
        centerLeft,
        centerTop,
        isAddTop,
        isAddLeft,
      })
    }
    // domList.forEach(domItem => {

    // });
  }

  return (
    <div
      className={`${styles.homePage} `}
      onClick={(e) => {
        setIsShowLink(false)
      }}
    >
      {/* <button
        style={{
          position: 'absolute',
          top: 200,
        }}
        onClick={getAll}
      >
        获得所有关键参数
      </button> */}

      {/* 奖金池 */}
      <div className={styles.pool}>
        <div className={styles.content}>
          <img className={styles.coinImg} alt="" src={coinImg} />
          <div className={styles.poolText}>
            <span className={`${isEN?styles.poolEn:''}`}>
              <FormattedMessage
                id={'home.pool'}
                description={'home.pool'}
                defaultMessage={'home.pool'}
              />
              :
            </span>
            
            <span className={styles.poolValue}>{pool}<span style={{marginLeft:5}}>BNB</span></span>
          </div>
        </div>
      </div>

      {/* 小船动画 */}
      <div className={`${styles.ship} ${styles.ship1}`}></div>
      {pageTagList.map((pageTag, index) => {
        const itemTop = isPc ? pageTag.pcTop : pageTag.h5Top
        const itemLeft = isPc ? pageTag.pcLeft : pageTag.h5Left
        return (
          <div
            className={`${styles.pageTag} ${styles[pageTag.id]} testDom`}
            key={pageTag.id}
            onClick={() => {
              if (pageTag.path && pageTag.isOpen) {
                history.push(pageTag.path)
              } else {
                message.info(`Coming soon!敬请期待!`)
              }
            }}
            style={{
              top: isPc
                ? height / 2 + (pageTag.isAddTop ? itemTop : -itemTop)
                : '',
              // : height / 2 + (pageTag.isAddTop ? itemTop : -itemTop),
              left: isPc
                ? width / 2 + (pageTag.isAddLeft ? itemLeft : -itemLeft)
                : '',
              // : width / 2 + (pageTag.isAddLeft ? itemLeft : -itemLeft),
            }}
          >
            <div className={`${styles.tagImg} ${styles['tagImg' + index]}`}>
              {/* pvp打斗 */}
              {pageTag.id == 'pvp' && (
                <div className={styles.pvpAnimation}>
                  <div className={styles.hero1}></div>
                  <div className={styles.hero2}></div>
                </div>
              )}
              {pageTag.tagInfo && pageTag.tagInfo}
              <img
                // className={`${styles.tagImg} ${styles['tagImg' + index]}`}
                alt=""
                src={pageTag.img}
              />
            </div>

            <span className={`${styles.label} ${isEN && styles.enLabel}`}>
              <FormattedMessage
                id={`home.${pageTag.id}`}
                description={`home.${pageTag.id}`}
                defaultMessage={`home.${pageTag.id}`}
              />
            </span>
          </div>
        )
      })}
      {/* 右下角内容 */}
      <div className={styles.rightBottom}>
        {isShowLink && (
          <div
            className={styles.linkModal}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {/* <div className={styles.row} >
              <img src={twitterImg} />
              <span>@hanghaizhanji</span>
            </div> */}
            <div className={styles.row} onClick={()=>{window.open('https://t.me/VoyageCombatCN')}}>
              <img src={telegramImg} />
              <span  >https://t.me/VoyageCombatCN</span>
            </div>
          </div>
        )}

        <div
          className={styles.imgItem}
          onClick={() => {
            
            setIsShowLinkModel(true)
          }}
        >
          <img className={styles.shareImg} src={shareImg} />
          <span className={styles.text}>
            <FormattedMessage id="nav.share" />
          </span>
        </div>
        <div className={styles.imgItem}
          onClick={()=>{window.open('https://voyagecombat.gitbook.io/litepaper/')}} 
        >
          <img className={styles.bookImg} src={bookImg} />
          <span className={styles.text}>
            <FormattedMessage id="nav.wiki" />
          </span>
        </div>

        <div
          className={styles.imgItem}
          onClick={(e) => {
            window.open('https://t.me/VoyageCombatCN')
            // e.stopPropagation()
            // setIsShowLink(true)
          }}
        >
          <img className={styles.linkImg} src={linkImg} />
          <span className={styles.text}>
            <FormattedMessage id="nav.link" />
            
          </span>
        </div>
      </div>
      {/* 分享弹窗 */}
      <LinkModel
        open={isShowLinkMode}
        isEN={isEN}
        onClose={() => {
          setIsShowLinkModel(false)
        }}
      />
    </div>
  )
}
export default Game
