/**
 * 会刷新Fate的地图数据
 */
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


/**
 * 联动的原始数据
 */
const yokaiSourceData = [
    // T
    { "job": "骑士", "pet": "武士猫", "regions": ["拉诺西亚低地", "中萨纳兰", "黑衣森林东部林区"] },
    { "job": "战士", "pet": "地缚猫", "regions": ["黑衣森林中央林区", "拉诺西亚低地", "中萨纳兰"] },
    { "job": "暗黑骑士", "pet": "浮游猫", "regions": ["西拉诺西亚", "黑衣森林南部林区", "东萨纳兰"] },
    { "job": "绝枪战士", "pet": "阎魔", "regions": ["基拉巴尼亚边区", "红玉海", "延夏", "基拉巴尼亚山区", "基拉巴尼亚湖区", "太阳神草原"] },
    // D
    { "job": "武僧", "pet": "USA蹦", "regions": ["拉诺西亚外地", "中拉诺西亚", "西萨纳兰"] },
    { "job": "龙骑士", "pet": "大蛇", "regions": ["中拉诺西亚", "西萨纳兰", "黑衣森林中央林区"] },
    { "job": "忍者", "pet": "九尾", "regions": ["西萨纳兰", "黑衣森林中央林区", "拉诺西亚低地"] },
    { "job": "武士", "pet": "滑头鬼", "regions": ["库尔札斯西部高地", "龙堡参天高地", "龙堡内陆低地", "翻云雾海", "阿巴拉提亚云海", "魔大陆阿济兹拉"] },
    // 远敏
    { "job": "吟游诗人", "pet": "维斯帕", "regions": ["黑衣森林南部林区", "拉诺西亚高地", "南萨纳兰"] },
    { "job": "机工士", "pet": "机器猫F型", "regions": ["拉诺西亚高地", "南萨纳兰", "黑衣森林北部林区"] },
    { "job": "舞者", "pet": "百鬼公主", "regions": ["基拉巴尼亚边区", "红玉海", "延夏", "基拉巴尼亚山区", "基拉巴尼亚湖区", "太阳神草原"] },
    // 法系
    { "job": "黑魔法师", "pet": "吹雪公主", "regions": ["黑衣森林北部林区", "拉诺西亚外地", "中拉诺西亚"] },
    { "job": "召唤师", "pet": "人面犬", "regions": ["东萨纳兰", "黑衣森林南部林区", "拉诺西亚高地"] },
    { "job": "赤魔法师", "pet": "蛇王凯拉", "regions": ["库尔札斯西部高地", "龙堡参天高地", "龙堡内陆低地", "翻云雾海", "阿巴拉提亚云海", "魔大陆阿济兹拉"] },
    // H
    { "job": "白魔法师", "pet": "小狛", "regions": ["黑衣森林东部林区", "西萨纳兰", "东萨纳兰"] },
    { "job": "学者", "pet": "狛次郎", "regions": ["中萨纳兰", "黑衣森林东部林区", "西萨纳兰"] },
    { "job": "占星术士", "pet": "野槌蛇", "regions": ["南萨纳兰", "黑衣森林北部林区", "拉诺西亚外地"] }
]

const tempMap = {};

for (const data of yokaiSourceData) {
    const regions = data.regions;

    regions.forEach(region => {
        if (!tempMap[region]) {
            tempMap[region] = [];
        }
        tempMap[region].push(data.job);
    });
}

const yokaiJobToMapData = [];
for (const map in tempMap) {
    let data = {
        map: map,
        jobs: tempMap[map]
    }
    yokaiJobToMapData.push(data);
}

/*
console.log(fateDataMap);
console.log(yokaiSourceData);
console.log(tempMap);
console.log(yokaiJobToMapData);
*/

var app = Vue.createApp({
    data() {
        let datas = {
            highlightedRegion: '',

            job2map: yokaiSourceData,

            highlightedJob: '',

            map2job: yokaiJobToMapData,
        }

        return datas;
    },
    methods: {
        highlightRegion(region) {
            this.highlightedRegion = region;
        },
        highlightJob(job) {
            this.highlightedJob = job;
        },

        showTooltip(event) {
            const tooltip = document.getElementById('tooltip');

            // 设置tooltip中imager的src
            const job = event.target.getAttribute('job');

            const imager = document.getElementById('imager');
            imager.src = `images/weapons/${job}.jpg`;

            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';
        },
        hideTooltip() {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        },

    }
})

app.mount('#app')

console.log(app);