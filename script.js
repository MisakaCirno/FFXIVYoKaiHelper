/**
 * 存储选择项的数据
 */
let selectedRecord  = new Set();

let selectedDatas = JSON.parse(localStorage.getItem('selectedData'));
if (selectedDatas){
    for (let i = 0; i < selectedDatas.length; i++){
        selectedRecord.add(selectedDatas[i]);
    }
}
else{
    console.log("No selected data in local storage.");
}

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
    { "job": "白魔法师", "pet": "小狛", "weapon": ["白犬杖"], "regions": ["黑衣森林东部林区", "西拉诺西亚", "东萨纳兰"] },
    { "job": "学者", "pet": "狛次郎", "weapon": ["朱犬之书"], "regions": ["中萨纳兰", "黑衣森林东部林区", "西拉诺西亚"] },
    { "job": "占星术士", "pet": "野槌蛇", "weapon": ["幸运天球仪"], "regions": ["南萨纳兰", "黑衣森林北部林区", "拉诺西亚外地"] }
];

// 遍历yokaiSourceData，为每个对象添加一个isChecked属性
for (const data of yokaiSourceData) {
    if (selectedRecord.has(data.job)) {
        data.isChecked = true;
    }
    else {
        data.isChecked = false;
    }
}

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

//古武、魂武、义武的掉落
const GU_WU = {
    "白羊之魂晶": "中拉诺西亚",
    "双鱼之魂晶": "拉诺西亚低地",
    "巨蟹之魂晶": "西拉诺西亚",
    "宝瓶之魂晶": "拉诺西亚高地",
    "狮子之魂晶": "拉诺西亚外地",
    "室女之魂晶": "黑衣森林中央林区",
    "摩羯之魂晶": "黑衣森林东部林区",
    "人马之魂晶": "黑衣森林北部林区",
    "双子之魂晶": "西萨纳兰",
    "天秤之魂晶": "中萨纳兰",
    "金牛之魂晶": "东萨纳兰",
    "天蝎之魂晶": "南萨纳兰"
};

const HUN_WU = {
    "流光火之水晶": "魔大陆阿济兹拉",
    "流光风之水晶": "阿巴拉提亚云海",
    "流光雷之水晶": "翻云雾海",
    "流光冰之水晶": "库尔札斯西部高地",
    "流光土之水晶": "龙堡参天高地",
    "流光水之水晶": "龙堡内陆低地"
};

const YI_WU = {
    "烦恼的记忆晶块": ["库尔札斯西部高地", "阿巴拉提亚云海"],
    "悲伤的记忆晶块": ["龙堡参天高地", "翻云雾海"],
    "恐惧的记忆晶块": ["龙堡内陆低地", "魔大陆阿济兹拉"],
    "不祥的记忆晶块": ["基拉巴尼亚边区", "基拉巴尼亚山区", "基拉巴尼亚湖区"],
    "忌讳的记忆晶块": ["红玉海", "延夏", "太阳神草原"]
};

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
    "others":[] 
};
*/
let regionData = [];
// 遍历每个大地区
for (const [region, subregions] of Object.entries(REGION_DATA)) {
    for (const subregion of subregions) {
        let otherContent = [];

        for (const [key, value] of Object.entries(GU_WU)) {
            if (value === subregion) {
                otherContent.push({ name: key, type: "古武", folder: "guwu" });
            }
        }

        for (const [key, value] of Object.entries(HUN_WU)) {
            if (value === subregion) {
                otherContent.push({ name: key, type: "魂武", folder: "hunwu" });
            }
        }

        for (const [key, value] of Object.entries(YI_WU)) {
            if (value.includes(subregion)) {
                otherContent.push({ name: key, type: "义武", folder: "yiwu" });
            }
        }

        let isChecked = false;
        if (selectedRecord.has(subregion)) {
            isChecked = true;
        }

        let item = {
            "primaryRegion": region,
            "subRegion": subregion,
            "jobs": mapToJob.get(subregion),
            "others": otherContent,
            "isChecked": isChecked
        };
        regionData.push(item);
    }
}
console.log("regionToJobList:");
console.log(regionData);

var app = Vue.createApp({
    data() {
        let datas = {
            highlightedRegion: '',

            yokaiDataList: yokaiSourceData,

            highlightedJob: '',

            regionDataList: regionData,

            previewImageURL: '',
        }

        return datas;
    },
    watch: {
        yokaiDataList: {
            handler: function (newValue, oldValue) {
                let newSelectedData = [];

                for (const data of this.yokaiDataList) {
                    if (data.isChecked) {
                        newSelectedData.push(data.job);
                    }
                }
                for (const data of this.regionDataList) {
                    if (data.isChecked) {
                        newSelectedData.push(data.subRegion);
                    }
                }

                localStorage.setItem('selectedData', JSON.stringify(newSelectedData));
            },
            deep: true
        },
        regionDataList: {
            handler: function (newValue, oldValue) {
                let newSelectedData = [];

                for (const data of this.yokaiDataList) {
                    if (data.isChecked) {
                        newSelectedData.push(data.job);
                    }
                }
                for (const data of this.regionDataList) {
                    if (data.isChecked) {
                        newSelectedData.push(data.subRegion);
                    }
                }

                localStorage.setItem('selectedData', JSON.stringify(newSelectedData));
            },
            deep: true
        }
    },
    methods: {
        copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // 使用navigator.clipboard.writeText
                navigator.clipboard.writeText(text).then(function () {
                    console.log('Text copied to clipboard');
                }).catch(function (err) {
                    console.error('Could not copy text by navigator: ', err);

                    // 使用document.execCommand('copy')作为回退
                    let textArea = document.createElement("textarea");
                    textArea.value = text;
                    // 避免在iOS设备上滚动
                    textArea.style.top = "0";
                    textArea.style.left = "0";
                    textArea.style.position = "fixed";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        let successful = document.execCommand('copy');
                        let msg = successful ? 'successful' : 'unsuccessful';
                        console.log('Fallback: Copying text command was ' + msg);
                    } catch (err) {
                        console.error('Fallback: Oops, unable to copy', err);
                    }
                    document.body.removeChild(textArea);
                });
            }
        },

        highlightRegion(region) {
            this.highlightedRegion = region;
        },
        highlightJob(job) {
            this.highlightedJob = job;
        },

        showJobDetail(event) {
            let tooltip = document.getElementById('tooltip');

            // 设置tooltip中tooltipImage的src
            // console.log(event.target);
            let job = event.target.getAttribute('job');

            let newSrc = `images/weapon_detail/${job}.jpg`;
            if (this.previewImageURL !== newSrc) {
                this.previewImageURL = newSrc;
            }

            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 50 + 'px';
        },
        hideJobDetail() {
            this.previewImageURL = '';

            let tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        },

        showPetDetail(event) {
            let tooltip = document.getElementById('tooltip');

            // 设置tooltip中tooltipImage的src
            let pet = event.target.getAttribute('pet');

            let tooltipImage = document.getElementById('tooltipImage');

            let newSrc = `images/pet_detail/${pet}.jpg`;
            if (tooltipImage.src !== newSrc) {
                tooltipImage.src = newSrc;
            }

            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 50 + 'px';
        },
        hidePetDetail() {
            this.previewImageURL = '';

            let tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        },

        saveToLocalStorage(selectedItem) {
            // 保存选中的数据
            selectedRecord.add(selectedItem);
            // 保存状态到local storage
            localStorage.setItem('checkboxes', JSON.stringify(this.checkboxes));
        },
        clearLocalStorage() {
            localStorage.clear();
            location.reload();
        },
        printData() {
            console.log(this.yokaiDataList);
            console.log(this.regionDataList);
        }
    }
})

app.mount('#app')

console.log(app);