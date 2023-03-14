import styles from './loading.less';
import { SyncOutlined } from '@ant-design/icons';
import pirateBoat from '@/assets/images/heroIsland/pirateBoat.png';
const PageLoading: React.FC<{ loading: boolean; label?: React.ReactNode }> = ({
  loading,
  label,
  children,
}) => {
  return (
    <div className={styles.loadingContent}>
      {loading && (
        <div className={styles.loadingMask}>
          <div className={`${styles.label} center`}>
            {label ? (
              label
            ) : (
              <div className={styles.labelDefault}>
                <SyncOutlined spin />
                {/* <img  className={styles.boat} src={pirateBoat} /> */}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
export default PageLoading;
