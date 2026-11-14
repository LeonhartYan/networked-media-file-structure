// 生成理想星系的干净示例数据：node seed.js
// 会重写 database.txt / userdb.txt / sessions.txt（先停掉服务器再跑）。
// 保留 userdb.txt 里已有的 LeonhartYan 账号（原密码不变），其余旧测试账号会被清掉。
// 示例用户共用下面这个演示密码，方便你登录成任何一个示例用户截图。
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const Datastore = require('@seald-io/nedb')

const DEMO_PASSWORD = 'galaxy-demo-2026'
const OWNER = 'LeonhartYan'

const users = [
  { username: 'nova', fullname: 'Nova Lin' },
  { username: 'orion', fullname: 'Orion Chen' },
  { username: 'lyra', fullname: 'Lyra Wang' },
  { username: 'vega', fullname: 'Vega Zhou' },
  { username: 'atlas', fullname: 'Atlas Wu' },
]

// interests: [名称, [点赞的人...]]；likes 自动等于点赞人数，保证数据一致
// 同一个兴趣出现在多张星图里（胶片相机、跑团、火锅、Jazz、车卡、露营…），按兴趣搜索能串起不同的人
const starmaps = [
  {
    user: OWNER, theme: '中式跑团 Chinese TRPG', at: '2026-10-03 21:12',
    interests: [['红烛', ['lyra', 'nova', 'vega']], ['浮屠镇邪', ['lyra', 'atlas']], ['过风水', ['lyra', 'vega', 'orion', 'nova']], ['车卡', ['lyra']], ['跑团', ['atlas', 'lyra']]],
    comments: [['lyra', '浮屠镇邪那次暴雨封山的开场我到现在还记得'], [OWNER, '@lyra 下次开七华寻宝记，给你留位'], ['vega', '过风水是什么梗，求科普']],
    likes: 4,
  },
  {
    user: 'nova', theme: 'Weekend Ritual 周末仪式', at: '2026-10-06 09:30',
    interests: [['手冲咖啡', ['vega', 'atlas']], ['胶片相机', ['orion', 'atlas', OWNER]], ['旧书店', ['lyra']], ['晨跑', []], ['京都', ['atlas', 'lyra']]],
    comments: [['orion', '胶片同好！你一般用什么卷？'], ['nova', '@orion 白天 Gold 200，晚上换 Portra 800']],
    likes: 3,
  },
  {
    user: 'orion', theme: 'Night Sky 夜空', at: '2026-10-09 23:48',
    interests: [['观星', ['nova', 'atlas', 'lyra']], ['胶片相机', ['nova']], ['露营', ['atlas', 'vega']], ['猎户座', ['nova', OWNER]], ['星轨', ['atlas']]],
    comments: [['atlas', '稻城亚丁的星空绝了，下次一起'], ['nova', '用胶片拍星轨要曝光多久？'], ['orion', '@nova B 门，一卷只拍得了两三张，但值得']],
    likes: 5,
  },
  {
    user: 'lyra', theme: 'Comfort Games 治愈游戏', at: '2026-10-12 20:05',
    interests: [['星露谷', ['vega', 'nova', OWNER]], ['风之旅人', [OWNER, 'orion']], ['拼图', ['nova']], ['动森', ['vega']], ['胡闹厨房', [OWNER, 'atlas']]],
    comments: [['vega', '星露谷联机缺一个种地的'], ['lyra', '@vega 我负责钓鱼，你负责种菜'], [OWNER, '风之旅人的最后一段，每次都会哭']],
    likes: 6,
  },
  {
    user: 'vega', theme: 'Late-night Food 深夜食堂', at: '2026-10-15 00:37',
    interests: [['火锅', ['orion', 'lyra', 'atlas', OWNER]], ['烧烤', ['atlas']], ['拉面', ['nova']], ['夜宵摊', ['orion']], ['Jazz酒吧', ['lyra', 'nova']]],
    comments: [['orion', '火锅永远第一'], ['atlas', '凌晨一点的烧烤摊是城市最温柔的地方']],
    likes: 4,
  },
  {
    user: 'atlas', theme: 'Places I\'d Fly To 想去的地方', at: '2026-10-19 14:22',
    interests: [['冰岛', ['orion', 'nova']], ['京都', ['lyra', 'nova', 'vega']], ['稻城亚丁', ['orion']], ['星空露营', ['orion', 'vega']], ['极光', ['orion', 'lyra']]],
    comments: [['orion', '冰岛 + 极光 + 露营，我可以当摄影'], ['lyra', '京都秋天的红叶季！']],
    likes: 3,
  },
  {
    user: OWNER, theme: 'Level Design 关卡设计', at: '2026-10-24 16:40',
    interests: [['白盒', ['atlas']], ['动线', ['lyra', 'atlas']], ['掩体', ['vega']], ['光照引导', ['lyra', 'nova', 'orion']], ['手绘地图', ['lyra', 'atlas']]],
    comments: [['atlas', '光照引导那个点好有意思，像跟着星星走'], [OWNER, '@atlas 对，玩家会本能地往亮处走']],
    likes: 2,
  },
  {
    user: 'orion', theme: 'Camping Kit 露营装备', at: '2026-10-28 19:15',
    interests: [['帐篷', ['atlas']], ['头灯', []], ['炉头', ['vega']], ['露营火锅', ['vega', 'atlas', 'lyra']], ['星图App', ['nova', OWNER]]],
    comments: [['vega', '露营火锅我来带锅底'], ['orion', '@vega 那就这么定了，牛油的']],
    likes: 2,
  },
  {
    user: 'nova', theme: 'Sounds I Love 喜欢的声音', at: '2026-11-02 22:58',
    interests: [['雨声', ['lyra', 'atlas']], ['黑胶', ['orion']], ['Jazz', ['orion', 'lyra', 'vega']], ['翻书声', ['lyra']], ['骰子声', [OWNER, 'lyra']]],
    comments: [[OWNER, '骰子落桌那一下，跑团人的 DNA 动了'], ['lyra', '雨声 + Jazz 是写作业神器']],
    likes: 5,
  },
  {
    user: 'vega', theme: 'Hotpot Tier List 火锅排行', at: '2026-11-06 21:33',
    interests: [['牛油锅底', ['orion', 'atlas']], ['毛肚', ['orion', OWNER, 'atlas']], ['番茄锅', ['lyra', 'nova']], ['鸭血', ['atlas']], ['冰粉', ['lyra']]],
    comments: [['lyra', '番茄锅是被低估的'], ['orion', '牛油锅底 + 毛肚，七上八下']],
    likes: 3,
  },
  {
    user: 'lyra', theme: 'Tabletop 桌游跑团', at: '2026-11-11 20:10',
    interests: [['跑团', [OWNER, 'nova', 'atlas']], ['车卡', [OWNER]], ['骰子', ['nova', OWNER]], ['七华寻宝记', [OWNER]], ['狼人杀', ['vega', 'orion']]],
    comments: [[OWNER, '车卡记得把侦查点满'], ['nova', '想入坑，新人能玩七华寻宝记吗？'], ['lyra', '@nova 可以！民俗解谜向，不怎么打架']],
    likes: 4,
  },
]

function fmt(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function readOwner(file) {
  if (!fs.existsSync(file)) return null
  const docs = {}
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    if (doc.$$deleted) delete docs[doc._id]
    else docs[doc._id] = doc
  }
  return Object.values(docs).find((u) => u.username === OWNER) || null
}

async function main() {
  const dir = __dirname
  const owner = readOwner(path.join(dir, 'userdb.txt'))

  for (const f of ['database.txt', 'userdb.txt', 'sessions.txt']) fs.writeFileSync(path.join(dir, f), '')

  const userdb = new Datastore({ filename: path.join(dir, 'userdb.txt'), autoload: true })
  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10)
  if (owner) await userdb.insertAsync(owner)
  else await userdb.insertAsync({ username: OWNER, fullname: OWNER, password: hash })
  for (const u of users) await userdb.insertAsync({ ...u, password: hash })
  await userdb.compactDatafileAsync()

  const db = new Datastore({ filename: path.join(dir, 'database.txt'), autoload: true })
  for (const s of starmaps) {
    const when = new Date(s.at.replace(' ', 'T') + ':00')
    await db.insertAsync({
      user: s.user,
      interests: s.interests.map(([name, likedBy]) => ({ name, likes: likedBy.length, likedBy })),
      theme: s.theme,
      date: fmt(when),
      timestamp: when.getTime(),
      likes: s.likes,
      comments: s.comments.map(([who, text]) => `@${who}: ${text}`),
    })
  }
  await db.compactDatafileAsync()

  console.log(`seeded ${users.length + 1} users, ${starmaps.length} starmaps${owner ? ` (kept existing ${OWNER} account)` : ''}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
