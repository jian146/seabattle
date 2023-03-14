import styles from './page.less';
import pageImg from '@/assets/images/com/leftIcon.png';
import { useCallback, useMemo } from 'react';

const Page: React.FC<{
  current: number;
  total: number;
  hideOnSinglePage?: boolean;
  pageSize?: number;
  currentChange?: (page: number) => void;
}> = ({
  current,
  total,
  currentChange,
  pageSize = 12,
  hideOnSinglePage = true,
}) => {
  // const page = useMemo(
  //   (): number => Math.ceil(total / pageSize),
  //   [total, pageSize],
  // );
  const page = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);
  const handleClick = (p: 'add' | 'sub') => {
    if (p === 'sub') {
      currentChange?.(current <= 1 ? 1 : current - 1);
    }
    if (p === 'add') {
      currentChange?.(current >= page ? page : current + 1);
    }
  };

  if (hideOnSinglePage && (page === 1 || total === 0)) {
    return <></>;
  }
  return (
    <div className={styles.pageCom}>
      <img
        className={`${styles.leftIcon} ${current <= 1 && styles.dis}`}
        alt="pageLeft"
        src={pageImg}
        onClick={() => handleClick('sub')}
      />
      <span className={styles.pageCount}>
        {current}/{page}
      </span>
      <img
        className={`${styles.rightIcon} ${current >= page && styles.dis}`}
        alt="pageRight"
        src={pageImg}
        onClick={() => handleClick('add')}
      />
    </div>
  );
};
export default Page;
