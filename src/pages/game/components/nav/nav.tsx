import { useEffect, useState } from 'react';
import {
  FormattedMessage,
  history,
  SelectLang,
} from 'umi';
import { DownOutlined } from '@ant-design/icons';
import styles from './nav.less';
import logImg from '@/assets/images/home/logo.png';
import Button from '@/components/Button/button';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { injected } from '@/web3';
import { subTokenId } from '@/utils/account';
import { message, notification } from 'antd';

import Balance from '@/components/balance/balance';
interface I_menu {
  id: string;
  label: string;
}
const Nav: React.FC<{ isHide?: boolean }> = ({ isHide = false }) => {
  const menuList: I_menu[] = [
    {
      id: 'home',
      label: 'home',
    },
    {
      id: 'game',
      label: 'game',
    },
    {
      id: 'market',
      label: 'market',
    },
    {
      id: 'wiki',
      label: 'wiki',
    },
    {
      id: 'buy',
      label: 'buy',
    },
    {
      id: 'link',
      label: 'link',
    },
  ];
  const items = [
    {
      key: '1',
      label: (
        <div className={styles.langSmall}>
          <span>US</span>
          English
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className={styles.langSmall}>
          <span>CN</span>
          简体中文
        </div>
      ),
    },
  ];
  const currentPath = history.location.pathname.split('/')[1];
  const { library, account, active, deactivate, activate } = useWeb3React();
  const web3 = new Web3(Web3.givenProvider);
  const [balance, setBalance] = useState<any>(0); //我的bnb余额

 
 
  useEffect(() => {
    if (localStorage.getItem('isActivate')) {
      connect();
    }else{
      connect()
    }
  }, []);
  useEffect(() => {}, [currentPath]);



  const onClick = (menu: I_menu) => {
    message.info(`Coming soon!敬请期待!`);
  };
  useEffect(() => {
    if (!!account && !!library) {
      // gBalance();
     
    }
    setBalance(0);
  }, [account, library]);
  const gBalance = async () => {
    try {
      if (account) {
        setBalance(await web3.eth.getBalance(account));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connect = async () => {

    try {
      await activate(injected, (error) => {
        notification.error({
          message: 'Error',
          description: error.message,
        });
      });
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div className={`${isHide ? styles.hide : ''} ${styles.head}`}>
      <img className={styles.logo} alt="" src={logImg} />
      <div className={styles.menu}>
        {menuList.map((menu) => (
          <div
            key={menu.label}
            className={`${styles.menuItem} ${
              currentPath == menu.id ? styles.active : ''
            }`}
            onClick={() => {
              onClick(menu);
            }}
          >
            <FormattedMessage id={`nav.${menu.label}`} />
          </div>
        ))}
      </div>
      <div className="flexCenter">
        <Balance />
  

        {/* 链接钱包按钮 */}
        <Button className={styles.button} onClick={connect}>
          {account ? (
            subTokenId(account, 4, 1)
          ) : (
            <FormattedMessage id={'home.connectWallet'} />
          )}
        </Button>
        {/* <Dropdown menu={{ items }}>
        <div className={styles.languageSelect}>
          <FormattedMessage id="home.currentLanguage" />
          <DownOutlined />
        </div>
      </Dropdown> */}

        <SelectLang
          key="id"
          className={styles.action}
          reload={false}
          icon={
            <div className={styles.languageSelect}>
              <FormattedMessage id="home.currentLanguage" />

              <DownOutlined />
            </div>
          }
        />

      </div>
    </div>
  );
};
export default Nav;
