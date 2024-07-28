/**
 * 联动的原始数据
 */
const yokaiSourceData = [
    // T
    { "job": "骑士", "pet": "武士猫", "weapon": ["妖刀·猫丸", "圆阵猫盾"], "regions": ["拉诺西亚低地", "中萨纳兰", "黑衣森林东部林区"] },
    { "job": "战士", "pet": "地缚猫", "weapon": ["百斩斧·赤猫"], "regions": ["黑衣森林中央林区", "拉诺西亚低地", "中萨纳兰"] },
    { "job": "暗黑骑士", "pet": "浮游猫", "weapon": ["同田贯·冬猫"], "regions": ["西拉诺西亚", "黑衣森林南部林区", "东萨纳兰"] },
    { "job": "绝枪战士", "pet": "阎魔", "weapon": ["阎魔枪刃"], "regions": ["基拉巴尼亚边区", "红玉海", "延夏", "基拉巴尼亚山区", "基拉巴尼亚湖区", "太阳神草原"] },
    // D
    { "job": "武僧", "pet": "USA蹦", "weapon": ["宇宙拳套"], "regions": ["拉诺西亚外地", "中拉诺西亚", "西萨纳兰"] },
    { "job": "龙骑士", "pet": "大蛇", "weapon": ["蛇枪·鸦丸"], "regions": ["中拉诺西亚", "西萨纳兰", "黑衣森林中央林区"] },
    { "job": "忍者", "pet": "九尾", "weapon": ["九尾双剑"], "regions": ["西萨纳兰", "黑衣森林中央林区", "拉诺西亚低地"] },
    { "job": "武士", "pet": "滑头鬼", "weapon": ["怪刀·浮世丸"], "regions": ["库尔札斯西部高地", "龙堡参天高地", "龙堡内陆低地", "翻云雾海", "阿巴拉提亚云海", "魔大陆阿济兹拉"] },
    // 远敏
    { "job": "吟游诗人", "pet": "维斯帕", "weapon": ["智者大弓"], "regions": ["黑衣森林南部林区", "拉诺西亚高地", "南萨纳兰"] },
    { "job": "机工士", "pet": "机器猫F型", "weapon": ["F型波动炮"], "regions": ["拉诺西亚高地", "南萨纳兰", "黑衣森林北部林区"] },
    { "job": "舞者", "pet": "百鬼公主", "weapon": ["百鬼圆阵"], "regions": ["基拉巴尼亚边区", "红玉海", "延夏", "基拉巴尼亚山区", "基拉巴尼亚湖区", "太阳神草原"] },
    // 法系
    { "job": "黑魔法师", "pet": "吹雪公主", "weapon": ["雪姬杖"], "regions": ["黑衣森林北部林区", "拉诺西亚外地", "中拉诺西亚"] },
    { "job": "召唤师", "pet": "人面犬", "weapon": ["凭依教典"], "regions": ["东萨纳兰", "黑衣森林南部林区", "拉诺西亚高地"] },
    { "job": "赤魔法师", "pet": "蛇王凯拉", "weapon": ["蛇王刺剑"], "regions": ["库尔札斯西部高地", "龙堡参天高地", "龙堡内陆低地", "翻云雾海", "阿巴拉提亚云海", "魔大陆阿济兹拉"] },
    // H
    { "job": "白魔法师", "pet": "小狛", "weapon": ["白犬杖"], "regions": ["黑衣森林东部林区", "西萨纳兰", "东萨纳兰"] },
    { "job": "学者", "pet": "狛次郎", "weapon": ["朱犬之书"], "regions": ["中萨纳兰", "黑衣森林东部林区", "西萨纳兰"] },
    { "job": "占星术士", "pet": "野槌蛇", "weapon": ["幸运天球仪"], "regions": ["南萨纳兰", "黑衣森林北部林区", "拉诺西亚外地"] }
];

console.log("yokaiSourceData:");
console.log(yokaiSourceData);

/**
 * 会刷新FATE的地图数据
 */
const REGION_DATA =
{
    "拉诺西亚": ["中拉诺西亚", "拉诺西亚低地", "东拉诺西亚", "西拉诺西亚", "拉诺西亚高地", "拉诺西亚外地"],
    "黑衣森林": ["黑衣森林中央林区", "黑衣森林东部林区", "黑衣森林南部林区", "黑衣森林北部林区"],
    "萨纳兰": ["西萨纳兰", "中萨纳兰", "东萨纳兰", "南萨纳兰", "北萨纳兰"],
    "库尔札斯": ["库尔札斯中央高地", "库尔札斯西部高地"],
    "阿巴拉提亚": ["阿巴拉提亚云海", "魔大陆阿济兹拉"],
    "龙堡": ["龙堡参天高地", "龙堡内陆低地", "翻云雾海"],
    "基拉巴尼亚": ["基拉巴尼亚边区", "基拉巴尼亚山区", "基拉巴尼亚湖区"],
    "奥萨德": ["红玉海", "延夏", "太阳神草原"],
};

console.log("REGION_DATA:");
console.log(REGION_DATA);

/**
 * key为子地区名称，value为所属的大地区名称
 */
let RegionMap = new Map();
for (const [region, subregions] of Object.entries(REGION_DATA)) {
    for (const subregion of subregions) {
        RegionMap.set(subregion, region);
    }
}
console.log("RegionMap:");
console.log(RegionMap);

/**
 * key为职业名称，value为职业的数据
 */
let jobToData = new Map();
for (const data of yokaiSourceData) {
    jobToData.set(data.job, data);
}

console.log("jobToData:");
console.log(jobToData);

/**
 * key为子地区名称，value为该地区的所有职业的细节
 */
let mapToJob = new Map();
// 遍历RegionMap
for (const [subregion, region] of RegionMap) {
    // 遍历yokaiSourceData
    mapToJob.set(subregion, []);
}
for (const data of yokaiSourceData) {
    for (const region of data.regions) {
        mapToJob.get(region).push(data);
    }
}

console.log("mapToJob:");
console.log(mapToJob);

// 最后把数据也整理成list，每一项是
/*
let sample = 
{
    "primaryRegion": "拉诺西亚",
    "subRegion": "中拉诺西亚",
    "jobs": []
};
*/

let regionToJobList = [];
// 遍历每个大地区
for (const [region, subregions] of Object.entries(REGION_DATA)) {
    for (const subregion of subregions) {
        let item = { "primaryRegion": region, "subRegion": subregion, "jobs": mapToJob.get(subregion) };
        regionToJobList.push(item);
    }
}
console.log("regionToJobList:");
console.log(regionToJobList);

var app = Vue.createApp({
    data() {
        let datas = {
            highlightedRegion: '',

            yokaiDataList: yokaiSourceData,

            highlightedJob: '',

            regionToJobDataList: regionToJobList,
        }

        return datas;
    },
    methods: {
        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板: ' + text);
            }).catch(err => {
                console.error('无法复制到剪贴板', err);
            });
        },

        highlightRegion(region) {
            this.highlightedRegion = region;
        },
        highlightJob(job) {
            this.highlightedJob = job;
        },

        showJobDetail(event) {
            const tooltip = document.getElementById('tooltip');

            // 设置tooltip中imager的src
            // console.log(event.target);
            const job = event.target.getAttribute('job');

            const imager = document.getElementById('imager');
            imager.src = `images/weapon_detail/${job}.jpg`;

            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';
        },
        hideJobDetail() {
            const tooltip = document.getElementById('tooltip');

            // 清空图片
            const imager = document.getElementById('imager');
            imager.src = '';

            tooltip.style.display = 'none';
        },

        showPetDetail(event) {
            const tooltip = document.getElementById('tooltip');

            // 设置tooltip中imager的src
            const pet = event.target.getAttribute('pet');

            const imager = document.getElementById('imager');
            imager.src = `images/pet_detail/${pet}.jpg`;

            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';
        },
        hidePetDetail() {
            const tooltip = document.getElementById('tooltip');

            // 清空图片
            const imager = document.getElementById('imager');
            imager.src = '';

            tooltip.style.display = 'none';
        }
    }
})

app.mount('#app')

console.log(app);