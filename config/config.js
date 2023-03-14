import { defineConfig } from 'umi';
// "development"
const { REACT_APP_ENV } = process.env;
// console.log('当前环境1~~~:',process.env.UMI_ENV)


export default defineConfig({
  title: '航海戰記',
  nodeModulesTransform: {
    type: 'none',
  },
  locale: {
    // default zh-CN
    default: 'zh-TW',

    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  outputPath:process.env.UMI_ENV==='prod'?'build':'devBuild' ,
  routes: [
    // { path: '/', component: '@/pages/index' },
    { path: '/', redirect: '/game' },
    { path:'/demo',component: '@/pages/index'},
    {
      path: '/game',
      name:'game',
      component: '@/layouts/index',
      routes: [
       
        { path:'/game',redirect:'/game/game'},
        { path: 'game',  name:'game', component: '@/pages/game/game' },
        { path: 'drawCard', component: '@/pages/game/card/card' },
        { path: 'heroIsland', component: '@/pages/game/heroIsland/heroIsland' },
        { path: 'pirateBoat', component: '@/pages/game/pirateBoat/pirateBoat' },
        { path: 'pve', component: '@/pages/game/pve/pve' },
        { path: 'pveFight/:pveId', component: '@/pages/game/pve/pveFight/pveFight' },
        { path: 'pvp', component: '@/pages/game/pvp/pvp' },
        { path: 'pvpMatch/:pvpId', component: '@/pages/game/pvp/matching/matching' },
        { path: 'heroInfo/:heroId', component: '@/pages/game/heroInfo/heroInfo' },
        { path: 'heroUpload/:heroId', component: '@/pages/game/heroUpload/heroUpload' },
      ]
    },
  ],

  fastRefresh: {},
  mfsu: {}, //mfsu快速构建
  hash: true,
});
