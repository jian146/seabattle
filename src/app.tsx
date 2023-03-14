import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import VConsole from 'vconsole';

import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers'

//非正式服开启vconsole
if(process.env?.REACT_ENV&&process.env.REACT_ENV==='dev'){
  new VConsole();
}
// console.log('env',process.env.REACT_ENV,process.env.REACT_ENV==='dev')
console.clear()
console.log(process.env.REACT_BUILD_TIME)
export function rootContainer(container: any) {

  
  return (
    <Web3ReactProvider getLibrary={(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider => {
      const library = new Web3Provider(provider)
      library.pollingInterval = 12000
      return library
    }}>
      {container}
    </Web3ReactProvider>
  );
}
