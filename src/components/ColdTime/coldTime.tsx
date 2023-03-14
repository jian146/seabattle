import { formatDuring, formatTime } from '@/utils/timeHelper';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';
interface I_ColdTimeDom {
  PropsTime: number;
  type?: 'hour';
  isActive?: boolean;
}
//背包冷却时间组件
export const ColdTime: React.FC<I_ColdTimeDom> = ({
  PropsTime,
  type,
  isActive = false,
}: I_ColdTimeDom) => {
  let timer: NodeJS.Timeout;
  const [coldTime, setColdTime] = useState(PropsTime);

  const formatTime = formatDuring(coldTime * 1000);
  /**
   * 清除计时器
   */
  const clearTimer=()=>{
    if (timer) {
      clearTimeout(timer);
    }
  }
  useEffect(() => {
    if (isActive) {
      countDown(PropsTime);
    }else{
      setColdTime(PropsTime)
    }
    return () => {
      clearTimer()
    };
  },[PropsTime]);
  //倒计时
  const countDown = (time: number) => {
    if (time > 0) {
      timer = setTimeout(() => {
        setColdTime(time - 1);
        countDown(time - 1);
        PropsTime = PropsTime - 1;
      }, 1000);
    } else {
      setColdTime(0);
    }
  };
  const renderTimeShow=()=>{
    if(formatTime.days===0&&formatTime.hours===0&&formatTime.minutes!==0){
      return         <>
      {formatTime.minutes}
      <FormattedMessage id={'minute'} />
      {formatTime.seconds}
      <FormattedMessage id={'seconds'} />
    </>

    }else{
      return <>
            {formatTime.days > 0 && (
        <>
          {formatTime.days}
          <FormattedMessage id={'day'} />
        </>
      )}

      {formatTime.hours}
      <FormattedMessage id={'hour'} />
      {!type && (
        <>
          {formatTime.minutes}
          <FormattedMessage id={'minute'} />
          {/* {formatTime.seconds}
          <FormattedMessage id={'seconds'} /> */}
        </>
      )}
      </>
    }

  }
  return coldTime > 0 ? (
    <span className="forgeCdTime">
      {/* <AccessTimeIcon className="icon" /> */}
      {renderTimeShow()}

    </span>
  ) : (
    <></>
  );
};
