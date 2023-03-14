import { defineConfig } from 'umi';
import moment from 'moment';
// "development"
const { REACT_APP_ENV } = process.env;

// process.env.REACT_APP_HERO_ADDR
export default defineConfig({
  define: {
    'process.env.ENV': 'dev',
    'process.env.REACT_ENV': 'dev',
    'process.env.REACT_BUILD_TIME':'dev发布时间'+moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
    'process.env.REACT_APP_CHAIN_ID': 97,
    'process.env.REACT_APP_LOCAL_CHAIN_ID': 1337,

    'process.env.REACT_APP_VC_ADDR': '0x6284098222A03e1d37b3Dc06d93E8fe0B6408D20',
    'process.env.REACT_APP_VC_POOL_ADDR': '0x53df411B1A82525186951CD4f2e01723fe43f5C6',
    'process.env.REACT_APP_HERO_ADDR': '0xd9976eb0db84b090675954C53CdA97ed6EFF10E0',
    'process.env.REACT_APP_JOB_ADDR': '0x67F3b48a8a5731319D50fC934a31f99B005597ec',
    'process.env.REACT_APP_PVE_ADDR': '0x4A450374D3ff335B789CEF055C4bD0e5E902a4A2',
    'process.env.REACT_APP_API': 'https://service-test.voyagecombat.io/',


    'process.env.REACT_APP_PRESALE_ADDR': '0x9594E5a52919E8e66cd631076Eb5b9bBB4EB87dd',
    'process.env.REACT_APP_DLT_ADDR': '0x74B8d6822cF427385d02378f1D59b1e9512AD3dB',
    'process.env.REACT_APP_MARKET_ADDR': '0x62d63F81f12712a4E471076389Acb9B8651DBFF8',
    'process.env.REACT_APP_MARKET_API': 'https://api-test.darklight.finance/',
    'process.env.REACT_APP_EQUIP_ADDR': '0x297bE5d310A17Cc67aFf2f6a7a770463D5C59E9a',
    'process.env.REACT_APP_PVE_API': 'https://service.darklight.shop',
    'process.env.REACT_APP_KEY_ADDR':
      '0xfA85cb4CDF543104e557c29a9d300452eF7be6bC',
    // 'process.env.REACT_APP_API':'http://nps.game2012.cn:19815',
 
  },
});
