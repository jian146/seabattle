

import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { injected } from '@/web3';
export default function IndexPage() {
  const { library, account, deactivate, activate } = useWeb3React();
  const web3 = new Web3(Web3.givenProvider);
  const [balance, setBalance] = useState<any>(0); //我的bnb余额  
  useEffect(() => {
    if (localStorage.getItem('isActivate')) {
      connect();
    }
    // console.clear();
    // console.log('是否是中文', getLocale());

  }, []);
  useEffect(() => {
    if (!!account && !!library) {
      gBalance();
    }
    setBalance(0);
  }, [account, library]);

  async function gBalance() {
    try {
      if (account) {
        setBalance(await web3.eth.getBalance(account));
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function connect() {
    try {
      await activate(injected);

      localStorage.setItem('isActivate', 'true');
    } catch (ex) {
      console.log(ex);
    }
  }










  return (
    <div className="page">



      
    </div>
  );
}
