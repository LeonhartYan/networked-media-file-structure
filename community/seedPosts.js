// 中式跑团的示例帖子：服务器每次启动都从这里载入（帖子存在内存里，重启后回到这份）。
// 一条主线串起来：KP 青灯开《红烛》→ 团后评价 → 风水梗 → 推荐 / 拔草 → 《界碑》开团 → KP 写新模组《海外仙山》招试玩。
// tags 必须和 server.js 里 allTags 的字符串完全一致，筛选才会生效。
// 按时间从新到旧排列（页面直接按数组顺序显示）。
const T = {
  rec: 'Scenarios Recommendation 团本推荐',
  critique: 'Scenarios Critique 团本拔草',
  run: 'Run Session 跑团预警',
  review: 'Session Comment 跑团评价',
  chat: 'Chat 闲聊',
}

module.exports = [
  {
    theme: '《海外仙山》试玩招募 | Playtest: Isles Beyond the Sea',
    tags: T.run,
    date: '2026/11/12 20:30:00',
    imgSrc: 'images/map.jpg',
    text: '自制模组《海外仙山》第一版写完了！码头 → 步道 → 侯家村 → 摘桃台，一条主线两个支线，预计 4 小时。11 月 23 日周日晚 7 点线上，招 3–4 人，新人老人都欢迎，玩完请留团评帮我改模组。—— KP 青灯',
  },
  {
    theme: '模组地图手绘进度 | Map WIP',
    tags: T.chat,
    date: '2026/11/09 23:10:00',
    imgSrc: 'images/mapsp.png',
    text: '先画了个大轮廓，侯家村在山脚，摘桃台在两座山之间，右边那块墨迹是故意留的「不能去的地方」。阿七你别问了，跑团的时候就知道了。—— KP 青灯',
  },
  {
    theme: '我在写下个模组了 | Writing My Next Scenario',
    tags: T.chat,
    date: '2026/11/06 21:45:00',
    imgSrc: 'images/meme3.jpg',
    text: '跑完《界碑》之后灵感爆棚，决定自己写一个山海经 + 海上仙山题材的模组，暂定名《海外仙山》。世界观很大，大家期待一下（以及，这次真的没有奶）。—— KP 青灯',
  },
  {
    theme: '《界碑》团评：战斗党狂喜 | The Boundary Monument Review',
    tags: T.review,
    date: '2026/11/03 00:20:00',
    imgSrc: 'images/guai.jpg',
    text: '三个小时打了四场，双头猪那场全员差点团灭，最后老周一发大成功救场。确实像白鹭说的战斗偏多，但双线调查最后合到一起的那一下非常爽。纯解谜玩家慎入，喜欢 COC + DND 混搭的闭眼冲。—— 老周',
  },
  {
    theme: '《界碑》周五线上开团 | The Boundary Monument, Friday',
    tags: T.run,
    date: '2026/10/28 19:00:00',
    imgSrc: 'images/jiebei.jpg',
    text: '看到白鹭的拔草帖，还是想带大家体验一下。本周五晚 8 点线上，Ruins 1.2 规则，战斗比较多，请大家车卡时至少点一个战斗技能。已有：老周、阿七，再招 2 人。—— KP 青灯',
  },
  {
    theme: '《界碑》拔草：不适合纯解谜玩家 | Not for Puzzle-only Players',
    tags: T.critique,
    date: '2026/10/25 22:15:00',
    imgSrc: '',
    text: '设定真的很好，山海经典故 + 上三清体系，读模组的时候很震撼。但是战斗占比太高，Ruins 规则下一场战斗要掷很久，我们那团解谜线几乎被战斗挤没了。如果你和我一样只想破案，建议先玩《七华寻宝记》或《浮屠镇邪》。—— 白鹭',
  },
  {
    theme: '《浮屠镇邪》团评：KP 节奏满分 | The Pagoda of Exorcism Review',
    tags: T.review,
    date: '2026/10/21 01:05:00',
    imgSrc: 'images/meme2.jpg',
    text: '暴雨封山 + 寺庙借宿，标准的暴风雪山庄开局，青灯把氛围压得很好。我的调查员全程靠一个打火机活下来（见图）。凶手藏得很深，我们第二个梦境才反应过来。强烈推荐给喜欢推理的人。—— 阿七',
  },
  {
    theme: '推荐《浮屠镇邪》| Recommending The Pagoda of Exorcism',
    tags: T.rec,
    date: '2026/10/17 18:40:00',
    imgSrc: 'images/fuzhou.png',
    text: '如果你喜欢本格推理：封闭空间、寺庙里的死者、反复出现的怪梦，而且战斗很少。新人也能玩，KP 可以靠符咒道具给提示。上周跑完，准备再带一车。—— 白鹭',
  },
  {
    theme: 'KP，我要过风水 | KP, Let Me Read the Fengshui',
    tags: T.chat,
    date: '2026/10/14 22:30:00',
    imgSrc: 'images/meme4.jpg',
    text: '上周跑《红烛》，小满每进一个房间都要过风水，最后连 NPC 都要过。KP 青灯：……好吧，过吧。结果小满真的靠风水找到了甲骨。这游戏的平衡性已经被小满玩坏了。—— 阿七',
  },
  {
    theme: '《红烛》团评：社交技能也能通关 | The Red Candle Review',
    tags: T.review,
    date: '2026/10/12 00:45:00',
    imgSrc: 'images/meme1.jpg',
    text: '第一次跑团，听老周的话把社交技能点满了，结果真的有用！刷满 NPC 好感度之后拿到的情报直接帮全队跳关。KP 青灯讲民国小镇讲得很有画面感，结局我们选了烧掉甲骨。下次还来。—— 阿七',
  },
  {
    theme: '《红烛》周六晚开团 | The Red Candle, Saturday Night',
    tags: T.run,
    date: '2026/10/07 20:00:00',
    imgSrc: 'images/hongzhu.jpg',
    text: '周六晚 8 点线下（老地方桌游店），COC 7 版规则，带一点战斗，适合跑过一两次的玩家。新人也可以来，提前一天找我车卡。已有：老周、小满，再招 2 人。—— KP 青灯',
  },
  {
    theme: '新人入坑推荐《七华寻宝记》| Best First Scenario',
    tags: T.rec,
    date: '2026/10/03 15:20:00',
    imgSrc: 'images/qihua.jpg',
    text: '经常有新人问第一次跑团玩什么，我每次都推荐《七华寻宝记》：民俗 + 道教元素很有中式味道，解谜为主，恐怖程度适中，还可以顺手扩充 Ruins 规则书的设定。跑完再去试《红烛》。—— 老周',
  },
]
