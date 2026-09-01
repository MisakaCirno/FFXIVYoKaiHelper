import type { RelicDrop, RelicType } from '../domain/types'

export const RELIC_TYPE_LABELS: Readonly<Record<RelicType, string>> = {
  guwu: '古武',
  hunwu: '魂武',
  yiwu: '义武',
}

export const RELIC_TYPE_SHORT_LABELS: Readonly<Record<RelicType, string>> = {
  guwu: '古',
  hunwu: '魂',
  yiwu: '义',
}

export const RELIC_DROPS = [
  { id: '白羊之魂晶', name: '白羊之魂晶', type: 'guwu', zoneIds: ['中拉诺西亚'] },
  { id: '双鱼之魂晶', name: '双鱼之魂晶', type: 'guwu', zoneIds: ['拉诺西亚低地'] },
  { id: '巨蟹之魂晶', name: '巨蟹之魂晶', type: 'guwu', zoneIds: ['西拉诺西亚'] },
  { id: '宝瓶之魂晶', name: '宝瓶之魂晶', type: 'guwu', zoneIds: ['拉诺西亚高地'] },
  { id: '狮子之魂晶', name: '狮子之魂晶', type: 'guwu', zoneIds: ['拉诺西亚外地'] },
  { id: '室女之魂晶', name: '室女之魂晶', type: 'guwu', zoneIds: ['黑衣森林中央林区'] },
  { id: '摩羯之魂晶', name: '摩羯之魂晶', type: 'guwu', zoneIds: ['黑衣森林东部林区'] },
  { id: '人马之魂晶', name: '人马之魂晶', type: 'guwu', zoneIds: ['黑衣森林北部林区'] },
  { id: '双子之魂晶', name: '双子之魂晶', type: 'guwu', zoneIds: ['西萨纳兰'] },
  { id: '天秤之魂晶', name: '天秤之魂晶', type: 'guwu', zoneIds: ['中萨纳兰'] },
  { id: '金牛之魂晶', name: '金牛之魂晶', type: 'guwu', zoneIds: ['东萨纳兰'] },
  { id: '天蝎之魂晶', name: '天蝎之魂晶', type: 'guwu', zoneIds: ['南萨纳兰'] },
  { id: '流光火之水晶', name: '流光火之水晶', type: 'hunwu', zoneIds: ['魔大陆阿济兹拉'] },
  { id: '流光风之水晶', name: '流光风之水晶', type: 'hunwu', zoneIds: ['阿巴拉提亚云海'] },
  { id: '流光雷之水晶', name: '流光雷之水晶', type: 'hunwu', zoneIds: ['翻云雾海'] },
  { id: '流光冰之水晶', name: '流光冰之水晶', type: 'hunwu', zoneIds: ['库尔札斯西部高地'] },
  { id: '流光土之水晶', name: '流光土之水晶', type: 'hunwu', zoneIds: ['龙堡参天高地'] },
  { id: '流光水之水晶', name: '流光水之水晶', type: 'hunwu', zoneIds: ['龙堡内陆低地'] },
  { id: '烦恼的记忆晶块', name: '烦恼的记忆晶块', type: 'yiwu', zoneIds: ['库尔札斯西部高地', '阿巴拉提亚云海'] },
  { id: '悲伤的记忆晶块', name: '悲伤的记忆晶块', type: 'yiwu', zoneIds: ['龙堡参天高地', '翻云雾海'] },
  { id: '恐惧的记忆晶块', name: '恐惧的记忆晶块', type: 'yiwu', zoneIds: ['龙堡内陆低地', '魔大陆阿济兹拉'] },
  { id: '不祥的记忆晶块', name: '不祥的记忆晶块', type: 'yiwu', zoneIds: ['基拉巴尼亚边区', '基拉巴尼亚山区', '基拉巴尼亚湖区'] },
  { id: '忌讳的记忆晶块', name: '忌讳的记忆晶块', type: 'yiwu', zoneIds: ['红玉海', '延夏', '太阳神草原'] },
] as const satisfies readonly RelicDrop[]
