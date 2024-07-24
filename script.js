// 会刷新fate的地图
const fateDataMap =
{
    "拉诺西亚": ["中拉诺西亚", "拉诺西亚低地", "东拉诺西亚", "西拉诺西亚", "拉诺西亚高地", "拉诺西亚外地"],
    "黑衣森林": ["黑衣森林中央林区", "黑衣森林东部林区", "黑衣森林南部林区", "黑衣森林北部林区", "上古斗神——奥丁"],
    "萨纳兰": ["西萨纳兰", "中萨纳兰", "东萨纳兰", "南萨纳兰", "北萨纳兰"],
    "库尔札斯": ["库尔札斯中央高地", "库尔札斯西部高地"],
    "摩杜纳": ["摩杜纳"],
    "阿巴拉提亚": ["阿巴拉提亚云海", "魔大陆阿济兹拉", "云冠群岛探索（已封闭）"],
    "龙堡": ["龙堡参天高地", "龙堡内陆低地", "翻云雾海"],
    "基拉巴尼亚": ["基拉巴尼亚边区", "基拉巴尼亚山区", "基拉巴尼亚湖区"],
    "奥萨德": ["红玉海", "延夏", "太阳神草原"],
    "禁地优雷卡": ["常风之地", "恒冰之地", "涌火之地", "丰水之地"],
    "诺弗兰特": ["雷克兰德", "珂露西亚岛", "安穆·艾兰", "伊尔美格", "拉凯提卡大森林", "黑风海"],
    "南方博兹雅战线": ["冲突战一览", "紧急遭遇战一览", "决斗一览"],
    "扎杜诺尔高原": ["冲突战一览", "紧急遭遇战一览", "决斗一览"],
    "北洋地域": ["迷津"],
    "伊尔萨巴德": ["萨维奈岛", "加雷马"],
    "星外天域": ["叹息海", "天外天垓"],
    "古代世界": ["厄尔庇斯"],
    "其它": ["季节活动", "重建伊修加德", "成就危命一览"]
};

// 联动的原始数据
const sourceData =
{
    "战士": { "宠物": "地缚猫", "地区": ["黑衣森林中央林区", "拉诺西亚低地", "中萨纳兰"] },
    "白魔法师": { "宠物": "小狛", "地区": ["黑衣森林东部林区", "西萨纳兰", "东萨纳兰"] },
    "吟游诗人": { "宠物": "维斯帕", "地区": ["黑衣森林南部林区", "拉诺西亚高地", "南萨纳兰"] },
    "黑魔法师": { "宠物": "吹雪公主", "地区": ["黑衣森林北部林区", "拉诺西亚外地", "中拉诺西亚"] },
    "忍者": { "宠物": "九尾", "地区": ["西萨纳兰", "黑衣森林中央林区", "拉诺西亚低地"] },
    "学者": { "宠物": "狛次郎", "地区": ["中萨纳兰", "黑衣森林东部林区", "西萨纳兰"] },
    "召唤师": { "宠物": "人面犬", "地区": ["东萨纳兰", "黑衣森林南部林区", "拉诺西亚高地"] },
    "占星术士": { "宠物": "野槌蛇", "地区": ["南萨纳兰", "黑衣森林北部林区", "拉诺西亚外地"] },
    "龙骑士": { "宠物": "大蛇", "地区": ["中拉诺西亚", "西萨纳兰", "黑衣森林中央林区"] },
    "骑士": { "宠物": "武士猫", "地区": ["拉诺西亚低地", "中萨纳兰", "黑衣森林东部林区"] },
    "暗黑骑士": { "宠物": "浮游猫", "地区": ["西拉诺西亚", "黑衣森林南部林区", "东萨纳兰"] },
    "机工士": { "宠物": "机器猫F型", "地区": ["拉诺西亚高地", "南萨纳兰", "黑衣森林北部林区"] },
    "武僧": { "宠物": "USA蹦", "地区": ["拉诺西亚外地", "中拉诺西亚", "西萨纳兰"] },
    "绝枪战士": { "宠物": "阎魔", "地区": ["基拉巴尼亚边区", "红玉海", "延夏", "基拉巴尼亚山区", "基拉巴尼亚湖区", "太阳神草原"] },
    "武士": { "宠物": "滑头鬼", "地区": ["库尔札斯西部高地", "龙堡参天高地", "龙堡内陆低地", "翻云雾海", "阿巴拉提亚云海", "魔大陆阿济兹拉"] },
    "赤魔法师": { "宠物": "蛇王凯拉", "地区": ["库尔札斯西部高地", "龙堡参天高地", "龙堡内陆低地", "翻云雾海", "阿巴拉提亚云海", "魔大陆阿济兹拉"] },
    "舞者": { "宠物": "百鬼公主", "地区": ["基拉巴尼亚边区", "红玉海", "延夏", "基拉巴尼亚山区", "基拉巴尼亚湖区", "太阳神草原"] }
};

const jobToMapName = {};

// Traverse the input JSON
for (const [job, { regions }] of Object.entries(inputJson)) {
    for (const regionName of regions) {
        // If the region name does not exist in the output JSON, initialize it as an array
        if (!jobToMapName[regionName]) {
            jobToMapName[regionName] = [];
        }
        // Add the job to the corresponding region's array
        jobToMapName[regionName].push(job);
    }
}

console.log(JSON.stringify(jobToMapName, null, 4));

