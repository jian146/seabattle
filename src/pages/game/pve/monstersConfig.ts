// 地图id
// 暮色森林 1 monstersMap[0]
// 死亡矿井 2 monstersMap[1]
// 黑暗墓陵 3 monstersMap[2]
//暗黑领主LV1-3(骑，法，猎，刺）
//Dark Lord LV1-3(Knight, Wizard, Hunter, Assassin)
export interface I_imgMap{
  name:string,
  url:string,
  enName:string,
  isBoss?:boolean,
  bossIcon?:string,
}
export type I_monsterConfigData={
  headImg:string
  img:string
}&I_imgMap
export const imgMap:I_imgMap[]=[
  {'name': '狂暴领主', 'url': 'KuangBaoLingZhu', 'enName': 'Furious Lord'},
  {'name': '深海祭祀', 'url': 'ShenHaiJiSi', 'enName': 'D-S sacrifice'},

]
const imgComPath=`/images/monsters/`
export const getMonsterData=(name:string, type=''):null|string|I_monsterConfigData=>{
  const data=imgMap.find((item)=>{
    return item.name === name||item.enName===name
  })
  if (data){
    const headImg=imgComPath+'/head/'+data.url+'_1.png'
    const img=imgComPath+data.url+'.png'
    const backData={
      ...data,
      headImg: headImg,
      img: img
    }

    if (type==='head'){
      return headImg
    } else if (type==='name'){
      //英文名称
      return data.enName
    } else if (type==='img'){
      return img
    } else {
      return backData
    }

  } else {
    return null
  }

}
