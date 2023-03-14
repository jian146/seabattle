//各职业主副属性

import { _HeroProperty } from '@/pages/pve';
import { HeroType } from 'src/types/hero';

//骑士,法师,猎人,刺客,
export const attributesType = [
  {
    kye: 0,
    name: 'warrior',
    cnName: '骑士',
    cnMain: '体力',
    cnSub: '力量',
    main: 'stamina',
    sub: 'strength',
  },

  {
    kye: 1,
    name: 'mage',
    cnName: '法师',
    cnMain: '智力',
    cnSub: '精神',
    main: 'intelligence',
    sub: 'mind',
  },
  {
    kye: 2,
    name: 'hunter',
    cnName: '猎人',
    cnMain: '力量',
    cnSub: '敏捷',
    main: 'strength',
    sub: 'agility',
  },
  {
    kye: 3,
    name: 'assassin',
    cnName: '刺客',
    cnMain: '敏捷',
    cnSub: '力量',
    main: 'agility',
    sub: 'strength',
  },
];
//力量   敏捷  体质 意志 智力 精神
export type t_attribute =
  | 'strength'
  | 'agility'
  | 'stamina'
  | 'will'
  | 'intelligence'
  | 'mind';

//是否是主属性 0正常属性 1主属性 2副属性
export const getAttrLevel = (attributes: string, hero: HeroType) => {
  if (!hero || hero.occupation === undefined) {
    return 0;
  }
  if (attributesType[hero.occupation].main === attributes) {
    return 1;
  } else if (attributesType[hero.occupation].sub === attributes) {
    return 2;
  }
  return 0;
};
//获取主属性
export const getHeroMain = (hero: HeroType | _HeroProperty) => {
  return hero[attributesType[hero.occupation].main as t_attribute];
};
//获取副属性
export const getHeroSub = (hero: HeroType | _HeroProperty) => {
  return hero[attributesType[hero.occupation].sub as t_attribute];
};
//是否是合格卡
export const getIsQualifiedHero = (hero: HeroType | _HeroProperty): boolean => {
  const main = getHeroMain(hero);
  const sub = getHeroSub(hero);
  if (main >= 86 && sub >= 61) {
    return true;
  }
  return false;
};
