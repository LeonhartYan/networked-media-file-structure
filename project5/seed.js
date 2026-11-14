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
    user: 'nova', theme: 'Weekend Ritual', at: '2026-10-06 09:30',
    interests: [['Pour-over', ['vega', 'atlas']], ['Film Camera', ['orion', 'atlas', OWNER]], ['Bookstores', ['lyra']], ['Morning Run', []], ['Kyoto', ['atlas', 'lyra']]],
    comments: [['orion', 'Fellow film shooter! Which stock do you use?'], ['nova', '@orion Gold 200 for daytime, Portra 800 after dark']],
    likes: 3,
  },
  {
    user: 'orion', theme: 'Night Sky', at: '2026-10-09 23:48',
    interests: [['Stargazing', ['nova', 'atlas', 'lyra']], ['Film Camera', ['nova']], ['Camping', ['atlas', 'vega']], ['Orion', ['nova', OWNER]], ['Star Trails', ['atlas']]],
    comments: [['atlas', 'The sky over the Tibetan plateau was unreal. Next trip together?'], ['nova', 'How long do you expose for star trails on film?'], ['orion', '@nova Bulb mode, two or three frames a roll, but worth it']],
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
    user: 'atlas', theme: 'Places I\'d Fly To', at: '2026-10-19 14:22',
    interests: [['Iceland', ['orion', 'nova']], ['Kyoto', ['lyra', 'nova', 'vega']], ['Patagonia', ['orion']], ['Desert Camping', ['orion', 'vega']], ['Aurora', ['orion', 'lyra']]],
    comments: [['orion', 'Iceland + aurora + camping. I can be the photographer'], ['lyra', 'Kyoto in maple season!']],
    likes: 3,
  },
  {
    user: OWNER, theme: 'Level Design 关卡设计', at: '2026-10-24 16:40',
    interests: [['白盒', ['atlas']], ['动线', ['lyra', 'atlas']], ['掩体', ['vega']], ['光照引导', ['lyra', 'nova', 'orion']], ['手绘地图', ['lyra', 'atlas']]],
    comments: [['atlas', '光照引导那个点好有意思，像跟着星星走'], [OWNER, '@atlas 对，玩家会本能地往亮处走']],
    likes: 2,
  },
  {
    user: 'orion', theme: 'Camping Kit', at: '2026-10-28 19:15',
    interests: [['Tent', ['atlas']], ['Headlamp', []], ['Camp Stove', ['vega']], ['Hotpot', ['vega', 'atlas', 'lyra']], ['Star Map App', ['nova', OWNER]]],
    comments: [['vega', 'I\'ll bring the hotpot base'], ['orion', '@vega Deal. The spicy beef-tallow one']],
    likes: 2,
  },
  {
    user: 'nova', theme: 'Sounds I Love', at: '2026-11-02 22:58',
    interests: [['Rain', ['lyra', 'atlas']], ['Vinyl', ['orion']], ['Jazz', ['orion', 'lyra', 'vega']], ['Page Turns', ['lyra']], ['Rolling Dice', [OWNER, 'lyra']]],
    comments: [[OWNER, 'That clack of dice hitting the table. Every TRPG player knows it'], ['lyra', 'Rain + jazz is the best homework soundtrack']],
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
