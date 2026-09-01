import type { Job, JobRole } from '../domain/types'

export const ROLE_LABELS: Readonly<Record<JobRole, string>> = {
  tank: '防护职业',
  melee: '近战职业',
  ranged: '远程物理职业',
  caster: '远程魔法职业',
  healer: '治疗职业',
}

export const JOBS = [
  {
    id: '骑士', name: '骑士', role: 'tank', pet: '武士猫',
    weapons: ['妖刀·猫丸', '圆阵猫盾'],
    zoneIds: ['拉诺西亚低地', '中萨纳兰', '黑衣森林东部林区'],
  },
  {
    id: '战士', name: '战士', role: 'tank', pet: '地缚猫',
    weapons: ['百斩斧·赤猫'],
    zoneIds: ['黑衣森林中央林区', '拉诺西亚低地', '中萨纳兰'],
  },
  {
    id: '暗黑骑士', name: '暗黑骑士', role: 'tank', pet: '浮游猫',
    weapons: ['同田贯·冬猫'],
    zoneIds: ['西拉诺西亚', '黑衣森林南部林区', '东萨纳兰'],
  },
  {
    id: '绝枪战士', name: '绝枪战士', role: 'tank', pet: '阎魔',
    weapons: ['阎魔枪刃'],
    zoneIds: ['基拉巴尼亚边区', '红玉海', '延夏', '基拉巴尼亚山区', '基拉巴尼亚湖区', '太阳神草原'],
  },
  {
    id: '武僧', name: '武僧', role: 'melee', pet: 'USA蹦',
    weapons: ['宇宙拳套'],
    zoneIds: ['拉诺西亚外地', '中拉诺西亚', '西萨纳兰'],
  },
  {
    id: '龙骑士', name: '龙骑士', role: 'melee', pet: '大蛇',
    weapons: ['蛇枪·鸦丸'],
    zoneIds: ['中拉诺西亚', '西萨纳兰', '黑衣森林中央林区'],
  },
  {
    id: '忍者', name: '忍者', role: 'melee', pet: '九尾',
    weapons: ['九尾双剑'],
    zoneIds: ['西萨纳兰', '黑衣森林中央林区', '拉诺西亚低地'],
  },
  {
    id: '武士', name: '武士', role: 'melee', pet: '滑头鬼',
    weapons: ['怪刀·浮世丸'],
    zoneIds: ['库尔札斯西部高地', '龙堡参天高地', '龙堡内陆低地', '翻云雾海', '阿巴拉提亚云海', '魔大陆阿济兹拉'],
  },
  {
    id: '吟游诗人', name: '吟游诗人', role: 'ranged', pet: '维斯帕',
    weapons: ['智者大弓'],
    zoneIds: ['黑衣森林南部林区', '拉诺西亚高地', '南萨纳兰'],
  },
  {
    id: '机工士', name: '机工士', role: 'ranged', pet: '机器猫F型',
    weapons: ['F型波动炮'],
    zoneIds: ['拉诺西亚高地', '南萨纳兰', '黑衣森林北部林区'],
  },
  {
    id: '舞者', name: '舞者', role: 'ranged', pet: '百鬼公主',
    weapons: ['百鬼圆阵'],
    zoneIds: ['基拉巴尼亚边区', '红玉海', '延夏', '基拉巴尼亚山区', '基拉巴尼亚湖区', '太阳神草原'],
  },
  {
    id: '黑魔法师', name: '黑魔法师', role: 'caster', pet: '吹雪公主',
    weapons: ['雪姬杖'],
    zoneIds: ['黑衣森林北部林区', '拉诺西亚外地', '中拉诺西亚'],
  },
  {
    id: '召唤师', name: '召唤师', role: 'caster', pet: '人面犬',
    weapons: ['凭依教典'],
    zoneIds: ['东萨纳兰', '黑衣森林南部林区', '拉诺西亚高地'],
  },
  {
    id: '赤魔法师', name: '赤魔法师', role: 'caster', pet: '蛇王凯拉',
    weapons: ['蛇王刺剑'],
    zoneIds: ['库尔札斯西部高地', '龙堡参天高地', '龙堡内陆低地', '翻云雾海', '阿巴拉提亚云海', '魔大陆阿济兹拉'],
  },
  {
    id: '白魔法师', name: '白魔法师', role: 'healer', pet: '小狛',
    weapons: ['白犬杖'],
    zoneIds: ['黑衣森林东部林区', '西拉诺西亚', '东萨纳兰'],
  },
  {
    id: '学者', name: '学者', role: 'healer', pet: '狛次郎',
    weapons: ['朱犬之书'],
    zoneIds: ['中萨纳兰', '黑衣森林东部林区', '西拉诺西亚'],
  },
  {
    id: '占星术士', name: '占星术士', role: 'healer', pet: '野槌蛇',
    weapons: ['幸运天球仪'],
    zoneIds: ['南萨纳兰', '黑衣森林北部林区', '拉诺西亚外地'],
  },
] as const satisfies readonly Job[]

export const JOB_IDS = JOBS.map((job) => job.id)
