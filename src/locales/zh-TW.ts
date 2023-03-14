import card from "./zh-CN/card";
import hero from "./zh-CN/hero";
import heroIsland from "./zh-CN/heroIsland";
import game from "./zh-CN/game";
import pvp from "./zh-CN/pvp";
import pve from "./zh-CN/pve";

export default {
    ...card,
    ...game,
    ...hero,
    ...heroIsland,
    ...pvp,
    ...pve,
  };