import Nav from '@/pages/game/components/nav/nav'
import { useEffect, useState } from 'react'
import { history, useRouteMatch } from 'umi'
import styles from './index.less'
import tp from 'tp-js-sdk'
import { message } from 'antd'
import { getIsPcBySize, isTPSafari } from '@/utils/isPc'
import { use100vh } from 'react-div-100vh'
import VConsole from 'vconsole'

const LayoutPage: React.FC = ({ children }) => {
  const hideNavPath = ['/game/game']
  const path = history.location.pathname
  const [isHideNav, setIsHideNav] = useState(false)
  const [isVerticalState, setIsVerticalState] = useState(false) //是否是竖屏状态
  const match = useRouteMatch()
  const isPc = getIsPcBySize()
  const vh100 = use100vh()
  const isUseSafari = !isPc && isTPSafari()
  const clientWidth = document.body.clientWidth
  const clientHeight = document.body.clientHeight
  const difference = (clientHeight - clientWidth) / 2

  //苹果横屏样式
  const horizontalStyle = {
    height: vh100 ?? '',
    width: window.innerWidth + 47,
    // left:'salc()'
  }
  //苹果竖屏样式
  const verticalStyle = {
    width: vh100 ?? '',
    top: difference,
    left: -difference,
  }
  useEffect(() => {
    const isFind = hideNavPath.indexOf(path) >= 0
    setIsHideNav(!isFind)
  })
  useEffect(() => {
    
    if (!isUseSafari) {
      //tp钱包全屏
      setH5Vertical()
      try {
        //全屏
        tp.fullScreen({
          fullScreen: 1,
        })
      } catch (error) {
        console.log(' 全屏失效')
      }

      try {
        //导航栏
        tp.setMenubar({ flag: 0 })
      } catch (error) {
        console.log('导航栏失效')
      }
      try {
        //强制横屏
        tp.rollHorizontal({
          horizontal: true,
        })
      } catch (error) {
        console.log('横屏失效')
      }
    }
  }, [])
  const setH5Vertical = () => {
    const isVertical = document.body.clientWidth > document.body.clientHeight //是否是竖屏  true:横屏
    setIsVerticalState(!isVertical)
  }
  window.onresize = () => {
    setH5Vertical()
  }

  const consoleMylog = () => {
    // console.clear()
    const dom = document.getElementById('pageId')
    if (!dom) return
    console.log({
      top: dom.style.top,
      left: dom.style.left,
      right: dom.style.right,
      bottom: dom.style.bottom,
    })
    console.log({
      height: document.body.clientHeight,
      width: document.body.clientWidth,
      height1: window.innerHeight,
      width1: window.innerWidth,
      nowWidth: dom.clientWidth,
      nowHeight: dom.clientHeight,
    })

    // console.log('是否连接', tp.isConnected())
    // console.log('是否是TPSafari', isUseSafari)
    // tp.getAppInfo().then((res:any)=>{console.log('tp信息',res)})

    // console.log('屏幕宽高:',document.body.clientWidth,document.body.clientHeight)
    // console.log('可显示区域:',window.innerWidth, window.innerHeight)
    // console.log('可显示区域:',document.body.offsetWidth, document.body.offsetHeight)
    // console.log('vh100:',vh100)
    // console.log(navigator.userAgent)
  }

  return (
    <div
      id="pageId"
      className={`${styles.layout} page`}
      style={
        isUseSafari ? (isVerticalState ? verticalStyle : horizontalStyle) : {}
      }
    >
      {/* {consoleMylog()} */}
      {/* 导航 */}
      <Nav isHide={isHideNav} />
      {children}
    </div>
  )
}
export default LayoutPage
