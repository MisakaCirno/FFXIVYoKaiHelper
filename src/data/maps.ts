import type { ImageBounds, MapPlace, Region, WorldMapConfig, WorldMapPlace, Zone } from '../domain/types'

export const MAP_SIZE = 2048
export const MAP_BOUNDS = [[0, 0], [MAP_SIZE, MAP_SIZE]] as const satisfies ImageBounds

export const WORLD_MAP: WorldMapConfig = {
  id: '艾欧泽亚',
  imageFile: 'world_00.jpg',
  // 1024px 素材中的有效地图位于 y=292..731；坐标空间仍保持 2048px。
  viewBounds: [[0, 584], [2048, 1462]],
}

export const REGIONS = [
  {
    id: '拉诺西亚', name: '拉诺西亚', imageFile: 'region_00.jpg',
    worldAnchor: [305, 1244], worldLabelDirection: 'bottom',
  },
  {
    id: '黑衣森林', name: '黑衣森林', imageFile: 'region_01.jpg',
    worldAnchor: [528, 1172], worldLabelDirection: 'right',
  },
  {
    id: '萨纳兰', name: '萨纳兰', imageFile: 'region_02.jpg',
    worldAnchor: [454, 1324], worldLabelDirection: 'bottom',
  },
  {
    id: '库尔札斯', name: '库尔札斯', imageFile: 'region_03.jpg',
    worldAnchor: [420, 1130], worldLabelDirection: 'left',
  },
  {
    id: '阿巴拉提亚', name: '阿巴拉提亚', imageFile: 'region_05.jpg',
    worldAnchor: [470, 1053], worldLabelDirection: 'right',
  },
  {
    id: '龙堡', name: '龙堡', imageFile: 'region_06.jpg',
    worldAnchor: [289, 1072], worldLabelDirection: 'top',
  },
  {
    id: '基拉巴尼亚', name: '基拉巴尼亚', imageFile: 'region_07.jpg',
    worldAnchor: [608, 1118], worldLabelDirection: 'right',
  },
  {
    id: '奥萨德', name: '奥萨德', imageFile: 'region_08.jpg',
    worldAnchor: [1534, 1015], worldLabelDirection: 'top',
  },
] as const satisfies readonly Region[]

// 艾欧泽亚总览中没有当前活动掉落、但仍应显示的地理参照。
export const WORLD_MAP_PLACES = [
  { id: '摩杜纳', name: '摩杜纳', mapAnchor: [443, 1224], labelDirection: 'right' },
  { id: '远东之国', name: '远东之国', mapAnchor: [1731, 1074], labelDirection: 'bottom' },
] as const satisfies readonly WorldMapPlace[]

export const ZONES = [
  {
    id: '中拉诺西亚', name: '中拉诺西亚', regionId: '拉诺西亚',
    mapAnchor: [1160, 1261],
  },
  {
    id: '拉诺西亚低地', name: '拉诺西亚低地', regionId: '拉诺西亚',
    mapAnchor: [1226, 1533],
  },
  {
    id: '东拉诺西亚', name: '东拉诺西亚', regionId: '拉诺西亚',
    mapAnchor: [1418, 845],
  },
  {
    id: '西拉诺西亚', name: '西拉诺西亚', regionId: '拉诺西亚',
    mapAnchor: [573, 793],
  },
  {
    id: '拉诺西亚高地', name: '拉诺西亚高地', regionId: '拉诺西亚',
    mapAnchor: [1130, 650],
  },
  {
    id: '拉诺西亚外地', name: '拉诺西亚外地', regionId: '拉诺西亚',
    mapAnchor: [875, 470],
  },
  {
    id: '黑衣森林中央林区', name: '黑衣森林中央林区', regionId: '黑衣森林',
    mapAnchor: [881, 1011],
  },
  {
    id: '黑衣森林东部林区', name: '黑衣森林东部林区', regionId: '黑衣森林',
    mapAnchor: [1334, 682],
  },
  {
    id: '黑衣森林南部林区', name: '黑衣森林南部林区', regionId: '黑衣森林',
    mapAnchor: [1130, 1405],
  },
  {
    id: '黑衣森林北部林区', name: '黑衣森林北部林区', regionId: '黑衣森林',
    mapAnchor: [436, 560],
  },
  {
    id: '西萨纳兰', name: '西萨纳兰', regionId: '萨纳兰',
    mapAnchor: [611, 1171],
  },
  {
    id: '中萨纳兰', name: '中萨纳兰', regionId: '萨纳兰',
    mapAnchor: [1037, 992],
  },
  {
    id: '东萨纳兰', name: '东萨纳兰', regionId: '萨纳兰',
    mapAnchor: [1495, 747],
  },
  {
    id: '南萨纳兰', name: '南萨纳兰', regionId: '萨纳兰',
    mapAnchor: [1380, 1473],
  },
  {
    id: '北萨纳兰', name: '北萨纳兰', regionId: '萨纳兰',
    mapAnchor: [1008, 539],
  },
  {
    id: '库尔札斯中央高地', name: '库尔札斯中央高地', regionId: '库尔札斯',
    mapAnchor: [1463, 1386],
  },
  {
    id: '库尔札斯西部高地', name: '库尔札斯西部高地', regionId: '库尔札斯',
    mapAnchor: [517, 877],
  },
  {
    id: '阿巴拉提亚云海', name: '阿巴拉提亚云海', regionId: '阿巴拉提亚',
    mapAnchor: [664, 1391],
  },
  {
    id: '魔大陆阿济兹拉', name: '魔大陆阿济兹拉', regionId: '阿巴拉提亚',
    mapAnchor: [1494, 629],
  },
  {
    id: '龙堡参天高地', name: '龙堡参天高地', regionId: '龙堡',
    mapAnchor: [1408, 1359],
  },
  {
    id: '龙堡内陆低地', name: '龙堡内陆低地', regionId: '龙堡',
    mapAnchor: [666, 1519],
  },
  {
    id: '翻云雾海', name: '翻云雾海', regionId: '龙堡',
    mapAnchor: [999, 622],
  },
  {
    id: '基拉巴尼亚边区', name: '基拉巴尼亚边区', regionId: '基拉巴尼亚',
    mapAnchor: [497, 733],
  },
  {
    id: '基拉巴尼亚山区', name: '基拉巴尼亚山区', regionId: '基拉巴尼亚',
    mapAnchor: [1278, 803],
  },
  {
    id: '基拉巴尼亚湖区', name: '基拉巴尼亚湖区', regionId: '基拉巴尼亚',
    mapAnchor: [1599, 1593],
  },
  {
    id: '红玉海', name: '红玉海', regionId: '奥萨德',
    mapAnchor: [1454, 1364],
  },
  {
    id: '延夏', name: '延夏', regionId: '奥萨德',
    mapAnchor: [553, 1534],
  },
  {
    id: '太阳神草原', name: '太阳神草原', regionId: '奥萨德',
    mapAnchor: [894, 571],
  },
] as const satisfies readonly Zone[]

export const MAP_PLACES = [
  { id: '利姆萨·罗敏萨', name: '利姆萨·罗敏萨', regionId: '拉诺西亚', mapAnchor: [927, 1342] },
  { id: '海雾村', name: '海雾村', regionId: '拉诺西亚', mapAnchor: [1508, 1642] },
  { id: '狼狱停船场', name: '狼狱停船场', regionId: '拉诺西亚', mapAnchor: [707, 1822] },
  { id: '格里达尼亚', name: '格里达尼亚', regionId: '黑衣森林', mapAnchor: [820, 696] },
  { id: '薰衣草苗圃', name: '薰衣草苗圃', regionId: '黑衣森林', mapAnchor: [1235, 1031] },
  { id: '乌尔达哈', name: '乌尔达哈', regionId: '萨纳兰', mapAnchor: [902, 1242] },
  { id: '高脚孤丘', name: '高脚孤丘', regionId: '萨纳兰', mapAnchor: [956, 1412] },
  { id: '金碟游乐场', name: '金碟游乐场', regionId: '萨纳兰', mapAnchor: [1100, 1750] },
  { id: '伊修加德', name: '伊修加德', regionId: '库尔札斯', mapAnchor: [1332, 954] },
  { id: '穹顶皓天', name: '穹顶皓天', regionId: '库尔札斯', mapAnchor: [1504, 617] },
  { id: '田园郡', name: '田园郡', regionId: '龙堡', mapAnchor: [452, 1176] },
  { id: '神拳痕', name: '神拳痕', regionId: '基拉巴尼亚', mapAnchor: [826, 343] },
] as const satisfies readonly MapPlace[]
