import { defineConfig } from 'umi';
import moment from 'moment';
// "development"
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  define: {
    'process.env.ENV': 'prod',
    'process.env.REACT_ENV': 'prod',
    'process.env.REACT_BUILD_TIME':'正式服发布时间'+moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
    'process.env.GENERATE_SOURCEMAP': false,
    'process.env.REACT_APP_CHAIN_ID': 56,

    'process.env.REACT_APP_VC_ADDR': '0x42E64F49510232720bC9AFEc89E77004D9A87B30',
    'process.env.REACT_APP_VC_POOL_ADDR': '0xE1a70a30eeb152c1C6420011105BC08d126DE09d',
    'process.env.REACT_APP_HERO_ADDR': '0x4e2324CbC250049C12379B9d2C718973a8F6e07E',
    'process.env.REACT_APP_JOB_ADDR': '0x0c9D1c18e5ae1c41232C6d16bd9bD77fcB09a66b',
    'process.env.REACT_APP_PVE_ADDR': '0x8e1430fACC210bB5432854e29F8c37AE649b166D',
    'process.env.REACT_APP_API': 'https://service.voyagecombat.io/',


    'process.env.REACT_APP_PRESALE_ADDR':      '0xFFE4902dDCAa0459D55353E0F5D2baE914Ee4901',
    'process.env.REACT_APP_DLT_ADDR':      '0x343223811263Ca88aB2AD356D5b55a6A1aDDCfb0',
    'process.env.REACT_APP_MARKET_ADDR':      '0x9822d7468f406f125025000624A08e2aEB73c40D',
    'process.env.REACT_APP_MARKET_API': 'https://api.darklight.finance/',

    'process.env.REACT_APP_PVE_API': 'https://service.darklight.shop',
    'process.env.REACT_APP_KEY_ADDR':      '0x963D77DC2F88CD6fe52136c93B22126856E49D89',

    'process.env.REACT_APP_EQUIP_ADDR':'0x297bE5d310A17Cc67aFf2f6a7a770463D5C59E9a',
  },
});
