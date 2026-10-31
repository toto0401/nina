(() => {
  "use strict";

  const STORAGE_KEY = "comment-personality-v1";
  const QUIZ_KEY = "comment-personality-active-quiz-v1";
  const PERSONA_ORDER = ["firefighter", "empath", "analyst", "judge", "satirist", "finisher", "sniper", "meme", "laugh", "watcher", "quiet", "detector"];
  const CATEGORY_LABELS = { daily: "日常", work: "职场", love: "情感", food: "美食", travel: "旅行", study: "学习与科技" };

  const personas = {
    firefighter: { name: "评论区消防员", glyph: "灭", color: "#f16955", tagline: "你总能把快要吵起来的楼，轻轻按灭。", description: "你不是没有观点，只是更关心这件事能不能好好说完。有人情绪上头时，你会先递一杯水。", haunts: "争议帖、邻里帖、求助帖", sample: "先别急，大家把重点说清楚。" },
    empath: { name: "共情派掌门", glyph: "暖", color: "#e69062", tagline: "你回复的第一句话，通常能让人松一口气。", description: "你会先看到发帖人没说出口的那一点委屈。你的评论不一定最长，但常常是最想被置顶的那条。", haunts: "情感帖、失业帖、深夜树洞", sample: "这件事放在谁身上都会难受，你已经做得很好了。" },
    analyst: { name: "冷静分析师", glyph: "析", color: "#67a5da", tagline: "先拆变量，再讲情绪。", description: "你把评论区当成一间临时会议室。遇到复杂问题，你会忍不住帮大家理清前因后果。", haunts: "职场帖、学习帖、消费决策帖", sample: "先分开看，问题可能不在你以为的那一层。" },
    judge: { name: "互联网判官", glyph: "判", color: "#c672c8", tagline: "你的标准很明确，也不怕说出来。", description: "你对事不对人，但对离谱行为的耐受度确实不高。看到关键事实，你的判词马上送达。", haunts: "热搜帖、关系帖、公共议题帖", sample: "这不是误会，这是边界感的问题。" },
    satirist: { name: "阴阳文学家", glyph: "言", color: "#f18490", tagline: "语气很平静，杀伤力很具体。", description: "你很少直接提高音量，却能用一句话把空气抽干。你的评论里总有一点温柔的讽刺。", haunts: "职场吐槽、种草翻车、离谱日常", sample: "挺好的，建议把这个方法写进反面教材。" },
    finisher: { name: "补刀艺术家", glyph: "补", color: "#ed8053", tagline: "大家笑完后，你负责最后那一下。", description: "你总能补上最精确的那句。不是为了赢，只是那个空位看起来太适合放一句漂亮的总结。", haunts: "翻车帖、朋友吐槽、热点续集", sample: "事情发展到这里，已经很有教育意义了。" },
    sniper: { name: "热评狙击手", glyph: "中", color: "#77bfa6", tagline: "你出手不多，但经常正中靶心。", description: "你不爱刷屏。可一旦发言，往往正好说中了大家心里那句，所以很容易被顶到前排。", haunts: "高赞帖、故事帖、行业观察帖", sample: "真正难的不是开始，是承认自己不想继续了。" },
    meme: { name: "梗图搬运工", glyph: "梗", color: "#72a8da", tagline: "文字不够的时候，你已经在找图了。", description: "你的语言里有一套即时素材库。一个合适的梗，胜过三段认真的解释。", haunts: "朋友动态、游戏帖、宠物帖", sample: "此处需要一张表情包，但我忍住了。" },
    laugh: { name: "哈哈永动机", glyph: "哈", color: "#e0b64c", tagline: "你不是在笑，你是在给评论区供电。", description: "你可能没打算解决任何问题，但你的笑声会让原本尴尬的地方松下来。", haunts: "日常翻车、搞笑帖、朋友评论区", sample: "哈哈哈哈哈哈这个走向我真的没想到。" },
    watcher: { name: "吃瓜记录员", glyph: "瓜", color: "#8fbd64", tagline: "不抢话，但每个细节都没错过。", description: "你对剧情的耐心远高于平均水平。你不急着站队，先把瓜皮、瓜籽和时间线收好。", haunts: "长文瓜帖、热点后续、评论区连续剧", sample: "先放个板凳，等后续再判断。" },
    quiet: { name: "沉默观察员", glyph: "观", color: "#9a9fb9", tagline: "你把大部分精彩，都留在心里点了个赞。", description: "你不是没想法，只是知道不是每条帖子都值得留下痕迹。真正值得说的话，你会想很久。", haunts: "深夜树洞、旅行帖、朋友动态", sample: "看完了，祝你接下来一切顺利。" },
    detector: { name: "人机鉴定师", glyph: "鉴", color: "#a68ae3", tagline: "你的雷达一响，文案里的不对劲就藏不住。", description: "你对套路话、模糊承诺和复制粘贴般的真诚有一种天然警觉。可疑内容请先过你这一关。", haunts: "种草帖、求职帖、AI 话题、营销帖", sample: "这段话看起来很完整，但关键事实在哪里？" }
  };

  const achievements = {
    first: { name: "新人报到", glyph: "新", description: "完成第一次评论区巡逻。" },
    allrounder: { name: "评论全能王", glyph: "全", description: "一局里遇见了所有类别的帖子。" },
    laugh: { name: "哈哈永动机", glyph: "笑", description: "一局中选择了至少 5 次搞笑回复。" },
    warm: { name: "温柔发言人", glyph: "暖", description: "一局中选择了至少 5 次共情回复。" },
    sharp: { name: "一针见血", glyph: "准", description: "一局中选择了至少 5 次分析或判定回复。" },
    irony: { name: "阴阳大师", glyph: "阴", description: "一局中选择了至少 4 次阴阳回复。" },
    varied: { name: "选择困难症", glyph: "变", description: "一局中有 4 种回复风格各出现至少 2 次。" },
    collector: { name: "人格收藏家", glyph: "藏", description: "累计解锁 5 种不同主人格。" }
  };

  const option = (text, tone, primary, secondary) => ({ text, tone, scores: { primary, secondary } });
  const question = (id, category, author, time, meta, post, options) => ({ id, category, author, time, meta, post, options });
  const questions = [
    question("daily-1", "daily", "奶油关灯", "6 分钟前", "赞 824   评 96   藏 12", "出门 2 分钟才发现今天穿了两只不同的鞋，已经走到地铁站了。", [option("这不是穿错，这是给今天留一点随机性。", "humor", "meme", "laugh"), option("你先别慌，远看大概没人会发现。", "empathy", "firefighter", "empath"), option("左脚和右脚终于各自找到了风格。", "irony", "satirist", "finisher"), option("建议拍下来，人生这种素材不会再来一次。", "watch", "watcher", "sniper")]),
    question("daily-2", "daily", "今晚吃什么呀", "12 分钟前", "赞 1.1k   评 203   藏 45", "洗完头才发现家里停水，吹风机也刚好没电。", [option("今日份命运连续剧，编剧请出来一下。", "humor", "laugh", "meme"), option("先去楼下借个充电宝，头发最重要。", "analysis", "analyst", "firefighter"), option("你这不是洗头，是参加生存挑战。", "irony", "finisher", "satirist"), option("抱抱，最崩溃的事就是倒霉还要叠加。", "empathy", "empath", "quiet")]),
    question("daily-3", "daily", "橘子味气泡", "昨天", "赞 2.8k   评 350   藏 67", "室友说要早睡，结果现在在客厅拆快递，声音像在装修。", [option("早睡的定义，原来是早一点开始熬。", "irony", "satirist", "sniper"), option("要不要先提醒一下，明天大家都得上班。", "analysis", "firefighter", "analyst"), option("哈哈哈快递一到，人体自动切换白天模式。", "humor", "laugh", "meme"), option("我会先听听她拆到了什么。", "watch", "watcher", "quiet")]),
    question("daily-4", "daily", "一口冰拿铁", "刚刚", "赞 632   评 71   藏 10", "今天第一次去健身房，跑了 3 分钟就开始研究饮水机。", [option("饮水机区域也算熟悉场地的一部分。", "humor", "meme", "laugh"), option("第一次去已经很厉害，慢慢来就好。", "empathy", "empath", "firefighter"), option("很科学，先确认补给点再开始训练。", "irony", "satirist", "analyst"), option("3 分钟也比坐着研究强。", "analysis", "sniper", "analyst")]),
    question("work-1", "work", "周一请消失", "8 分钟前", "赞 4.6k   评 731   藏 209", "老板晚上十一点说，明天早上要看一个简单改一下的版本。", [option("简单，是老板对复杂一无所知。", "irony", "satirist", "finisher"), option("先确认优先级，别把一整晚都搭进去。", "analysis", "analyst", "firefighter"), option("哈哈哈这句话出现的时候，简单通常已经不简单了。", "humor", "laugh", "meme"), option("辛苦了，别忘记留个修改记录保护自己。", "empathy", "empath", "detector")]),
    question("work-2", "work", "加班不加糖", "25 分钟前", "赞 1.9k   评 168   藏 81", "同事把我做的表格复制了一份，改了标题，然后在会上说是他做的。", [option("这不是协作，这是文件名换皮。", "irony", "detector", "satirist"), option("保留原始记录，必要时直接说明贡献边界。", "analysis", "judge", "analyst"), option("我先帮你把这口气记在工作日志里。", "empathy", "firefighter", "empath"), option("居然还有这种职场二创。", "humor", "meme", "laugh")]),
    question("work-3", "work", "会议记录员", "昨天", "赞 1.5k   评 126   藏 33", "开会 90 分钟，最后的结论是下次再开个会讨论。", [option("会议的核心产出，是下一场会议。", "irony", "finisher", "satirist"), option("建议下次会前先写清楚需要决定什么。", "analysis", "analyst", "sniper"), option("哈哈哈哈这就是会议的循环利用。", "humor", "laugh", "meme"), option("我会先看看有没有人默默记了行动项。", "watch", "watcher", "quiet")]),
    question("work-4", "work", "工位绿植", "3 小时前", "赞 970   评 82   藏 26", "入职第一天，领导把公司群里 56 个文件都转给我，说有空看看。", [option("这不是资料包，这是新人入门副本。", "humor", "meme", "laugh"), option("先问清楚本周最需要看的三份，别被资料淹没。", "analysis", "analyst", "firefighter"), option("有空看看，翻译过来就是今晚别睡。", "irony", "satirist", "finisher"), option("第一天就这么多，先抱抱你。", "empathy", "empath", "quiet")]),
    question("love-1", "love", "月亮不营业", "18 分钟前", "赞 3.2k   评 492   藏 188", "他三天没回消息，但朋友圈给别人的猫点了赞。", [option("点赞是手滑，三天不回是认真选择。", "irony", "satirist", "sniper"), option("别先替他找理由，直接问清楚会更省心。", "analysis", "judge", "analyst"), option("抱抱，等消息这件事真的很消耗人。", "empathy", "empath", "firefighter"), option("我先坐这儿，看看评论区会不会出现新证据。", "watch", "watcher", "quiet")]),
    question("love-2", "love", "恋爱实习生", "1 小时前", "赞 2.1k   评 254   藏 91", "朋友说她对象很省钱，周年纪念日送了她一个自己用过的保温杯。", [option("循环经济在爱情里有了新解释。", "irony", "finisher", "satirist"), option("重点不是礼物贵不贵，是她有没有被认真对待。", "analysis", "sniper", "judge"), option("哈哈哈至少保温杯经历过考验。", "humor", "laugh", "meme"), option("如果她觉得委屈，就值得好好聊聊。", "empathy", "empath", "firefighter")]),
    question("love-3", "love", "夜宵加辣", "昨晚", "赞 1.6k   评 129   藏 49", "约会迟到 40 分钟，对方说路上堵车，但定位显示他一直在家。", [option("堵在家的路上，这个城市的交通确实复杂。", "irony", "satirist", "detector"), option("这已经不是迟到问题，是诚信问题。", "analysis", "judge", "analyst"), option("我需要一点后续，先别急着骂。", "watch", "watcher", "quiet"), option("这也太糟心了，换谁都会生气。", "empathy", "empath", "firefighter")]),
    question("love-4", "love", "银河便利店", "2 天前", "赞 1.3k   评 111   藏 36", "分手半年后，前任突然问我，之前那只猫现在还会不会想他。", [option("猫可能会想，但它没有回消息的功能。", "humor", "meme", "laugh"), option("这个问题听起来像在试探，不必急着接。", "analysis", "detector", "analyst"), option("有的人不是想猫，是想重新打开聊天框。", "irony", "sniper", "satirist"), option("你想回就回，不想回也完全没问题。", "empathy", "quiet", "empath")]),
    question("food-1", "food", "黄油小兔", "5 分钟前", "赞 5.2k   评 612   藏 345", "第一次做蛋糕，打开烤箱以后它中间塌得很有想法。", [option("蛋糕：我这一生，如履薄冰。", "humor", "meme", "laugh"), option("第一次做成这样已经很不错了，下次少一点液体试试。", "empathy", "firefighter", "empath"), option("它不是塌了，是在向巴斯克靠拢。", "irony", "satirist", "finisher"), option("先确认熟没熟，口感比外形重要。", "analysis", "analyst", "sniper")]),
    question("food-2", "food", "周末开饭", "40 分钟前", "赞 890   评 93   藏 58", "点了微辣，外卖备注写着建议搭配两瓶酸奶。", [option("微辣的尽头，是胃在给你写遗书。", "irony", "finisher", "satirist"), option("先备点牛奶，别硬扛。", "analysis", "firefighter", "analyst"), option("哈哈哈店家已经提前看到了未来。", "humor", "laugh", "meme"), option("先吃一口，再等评论区的真实辣度报告。", "watch", "watcher", "quiet")]),
    question("food-3", "food", "一碗不够", "昨天", "赞 3.7k   评 418   藏 170", "我妈说晚饭随便吃，结果端出了六菜一汤，还问我是不是没胃口。", [option("随便吃，是东亚家庭最有分量的四个字。", "irony", "satirist", "sniper"), option("这个量已经不是随便，是认真招待。", "analysis", "analyst", "judge"), option("哈哈哈哈我已经闻到饭香了。", "humor", "laugh", "meme"), option("太幸福了，多吃一点让阿姨开心。", "empathy", "empath", "quiet")]),
    question("food-4", "food", "奶茶不去冰", "昨天", "赞 1.8k   评 142   藏 62", "花 39 买了杯果茶，喝到最后发现杯底贴着一张谢谢惠顾。", [option("这杯茶把抽奖的惊喜放在了结尾。", "humor", "meme", "laugh"), option("39 的谢谢惠顾，仪式感确实很足。", "irony", "satirist", "finisher"), option("先看配料和容量，别只看包装。", "analysis", "detector", "analyst"), option("我会想知道它到底好不好喝。", "watch", "watcher", "quiet")]),
    question("travel-1", "travel", "车窗外的云", "28 分钟前", "赞 2.7k   评 296   藏 114", "赶飞机时才发现身份证过期，行李已经托运了。", [option("这趟旅行的第一站，是办证大厅。", "irony", "finisher", "satirist"), option("先问机场能不能用临时身份证明，别急。", "analysis", "firefighter", "analyst"), option("这剧情也太紧张了，抱抱。", "empathy", "empath", "quiet"), option("我想知道最后有没有赶上。", "watch", "watcher", "sniper")]),
    question("travel-2", "travel", "迷路也算旅行", "1 小时前", "赞 1.2k   评 106   藏 52", "在景区跟着导航走，最后进了一条村民遛狗的小路。", [option("导航说的景点，可能是狗的私藏路线。", "humor", "meme", "laugh"), option("先回到主路，再看路线是不是选错了。", "analysis", "analyst", "firefighter"), option("小路的尽头，通常是导航的自我修养。", "irony", "satirist", "finisher"), option("我反而有点想看那条路长什么样。", "watch", "quiet", "watcher")]),
    question("travel-3", "travel", "在路上捡心情", "前天", "赞 4.1k   评 477   藏 226", "朋友说不带行李轻装旅行，落地后第一件事是买了一个 28 寸箱子。", [option("轻装，是给出发时的自己一个美好愿望。", "irony", "satirist", "meme"), option("哈哈哈行李箱也有自己的旅行计划。", "humor", "laugh", "finisher"), option("只要买的东西真的用得上，也算合理。", "analysis", "analyst", "sniper"), option("我需要看看那个箱子里最后装了什么。", "watch", "watcher", "quiet")]),
    question("travel-4", "travel", "海边有风", "3 天前", "赞 1.4k   评 122   藏 70", "订的海景房，打开窗户看到的是隔壁楼的空调外机。", [option("海，是城市生活里的一种想象。", "irony", "satirist", "sniper"), option("确认一下是不是房型不符，可以和酒店沟通。", "analysis", "judge", "firefighter"), option("哈哈哈外机也在努力制造海风。", "humor", "meme", "laugh"), option("这个落差真的会让人失望。", "empathy", "empath", "quiet")]),
    question("study-1", "study", "图书馆座位", "9 分钟前", "赞 3.4k   评 386   藏 144", "复习到凌晨两点，突然发现明天考试是开卷。", [option("知识没有白学，只是它现在有点想笑。", "humor", "meme", "laugh"), option("开卷也要熟悉资料位置，今晚不算完全白费。", "analysis", "analyst", "sniper"), option("这份努力，建议明天带着去考场。", "irony", "finisher", "satirist"), option("辛苦啦，至少你现在会比平时更安心。", "empathy", "empath", "quiet")]),
    question("study-2", "study", "代码别报错", "35 分钟前", "赞 2.2k   评 205   藏 94", "代码运行成功了，但我不知道为什么成功，甚至不敢关电脑。", [option("不要动，它现在已经有了自己的生命。", "humor", "laugh", "meme"), option("先保存，再逐段弄清楚为什么能跑。", "analysis", "analyst", "detector"), option("它不是成功了，它只是暂时同意合作。", "irony", "satirist", "finisher"), option("这份紧张我懂，先截图留证。", "empathy", "firefighter", "empath")]),
    question("study-3", "study", "论文改到第几版", "2 小时前", "赞 1.7k   评 157   藏 86", "老师说这段写得很像 AI，让我再写得像自己一点。", [option("那就把自己熬夜时的真实语气写进去。", "humor", "meme", "laugh"), option("可以问问老师具体哪里不自然，再针对性修改。", "analysis", "analyst", "detector"), option("像 AI 的标准，是看起来太完整但没有人味。", "irony", "sniper", "satirist"), option("被这样说会很挫败，但你可以慢慢找回自己的表达。", "empathy", "empath", "quiet")]),
    question("study-4", "study", "今天也想毕业", "昨天", "赞 2.9k   评 267   藏 112", "朋友说自己要戒手机，下一秒发来了一张屏幕使用时间截图。", [option("戒手机的第一步，是用手机宣布。", "irony", "satirist", "finisher"), option("哈哈哈至少他已经开始记录了。", "humor", "laugh", "meme"), option("先设一个小目标，比如睡前半小时不看。", "analysis", "firefighter", "analyst"), option("我会等一周后再来看看打卡结果。", "watch", "watcher", "quiet")])
  ];

  const state = { collection: defaultCollection(), quiz: null, result: null, readOnly: false, muted: false, theme: "dark", audio: null, lastFocused: null, unlockQueue: [] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function defaultCollection() { return { unlockedPersonas: [], unlockedAchievements: [], testCount: 0, bestScore: 0, lastResult: null }; }
  function safeGet(key, fallback) { try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback; } catch { return fallback; } }
  function safeSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { showToast("浏览器没有保存空间，本次进度不会保留。"); return false; } }
  function loadState() {
    const saved = safeGet(STORAGE_KEY, defaultCollection());
    state.collection = { ...defaultCollection(), ...saved, unlockedPersonas: saved.unlockedPersonas || [], unlockedAchievements: saved.unlockedAchievements || [] };
    const settings = safeGet("comment-personality-settings-v1", {});
    state.muted = Boolean(settings.muted);
    state.theme = settings.theme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = state.theme;
    updateSoundButton();
  }
  function saveCollection() { safeSet(STORAGE_KEY, state.collection); updateHomeStats(); }
  function saveSettings() { safeSet("comment-personality-settings-v1", { muted: state.muted, theme: state.theme }); }
  function randomSeed() { return `${Date.now()}-${Math.floor(Math.random() * 1e8)}`; }
  function seededNumber(seed) { let hash = 2166136261; for (const char of seed) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0) / 4294967296; }
  function shuffle(items, seed = randomSeed()) { const copy = [...items]; let index = Math.floor(seededNumber(seed) * 2147483647); for (let i = copy.length - 1; i > 0; i--) { index = (index * 48271) % 2147483647; const j = index % (i + 1); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
  function hashString(value) { let hash = 0; for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0; return Math.abs(hash); }
  function initials(name) { return name.slice(0, 2); }
  function avatarColor(name) { const colors = ["#816bff", "#df6d7a", "#4d9c8d", "#d4844f", "#518bca", "#b070c5"]; return colors[hashString(name) % colors.length]; }

  function updateSoundButton() { const label = $("[data-sound-label]"); const button = $("[data-action='toggle-sound']"); if (!label || !button) return; label.textContent = state.muted ? "静" : "声"; button.setAttribute("aria-label", state.muted ? "打开音效" : "关闭音效"); button.title = state.muted ? "打开音效" : "关闭音效"; }
  function updateHomeStats() {
    $$('[data-persona-count]').forEach((el) => { el.textContent = state.collection.unlockedPersonas.length; });
    $$('[data-achievement-count]').forEach((el) => { el.textContent = state.collection.unlockedAchievements.length; });
    $$('[data-test-count]').forEach((el) => { el.textContent = state.collection.testCount; });
    const label = $("[data-start-label]");
    if (label) label.textContent = state.quiz && state.quiz.currentIndex < 12 ? `继续测试 ${state.quiz.currentIndex + 1}/12` : "开始测试";
  }
  function showView(id) {
    $$(".view").forEach((view) => { const active = view.id === id; view.hidden = !active; view.classList.toggle("is-active", active); });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function startQuiz(forceNew = false) {
    state.readOnly = false;
    if (!forceNew && state.quiz && state.quiz.currentIndex < 12) { showView("quiz-view"); renderQuestion(); return; }
    const seed = randomSeed();
    const categoryIds = Object.keys(CATEGORY_LABELS);
    const selected = categoryIds.flatMap((category, categoryIndex) => shuffle(questions.filter((q) => q.category === category), `${seed}-${categoryIndex}`).slice(0, 2));
    state.quiz = { seed, questionIds: shuffle(selected.map((q) => q.id), `${seed}-final`), currentIndex: 0, answers: [], scores: {}, primaryHits: {}, styleCounts: {}, startedAt: Date.now() };
    safeSet(QUIZ_KEY, state.quiz);
    showView("quiz-view");
    renderQuestion();
  }
  function restoreQuiz() {
    const quiz = safeGet(QUIZ_KEY, null);
    if (!quiz || !Array.isArray(quiz.questionIds) || quiz.questionIds.length !== 12 || quiz.currentIndex >= 12) return;
    const valid = quiz.questionIds.every((id) => questions.some((q) => q.id === id));
    if (valid) state.quiz = { ...quiz, locked: false };
  }
  function currentQuestion() { return questions.find((q) => q.id === state.quiz.questionIds[state.quiz.currentIndex]); }
  function renderQuestion() {
    if (!state.quiz || state.quiz.currentIndex >= 12) return;
    const q = currentQuestion();
    const index = state.quiz.currentIndex;
    $("[data-current-question]").textContent = index + 1;
    $("[data-current-question-aside]").textContent = String(index + 1).padStart(2, "0");
    $("[data-category-label]").textContent = CATEGORY_LABELS[q.category];
    $("[data-progress-fill]").style.width = `${((index + 1) / 12) * 100}%`;
    $("[data-post-author]").textContent = q.author;
    $("[data-post-time]").textContent = q.time;
    $("[data-post-body]").textContent = q.post;
    $("[data-post-meta]").textContent = q.meta;
    const avatar = $("[data-post-avatar]"); avatar.textContent = initials(q.author); avatar.style.background = avatarColor(q.author);
    const options = shuffle(q.options, `${state.quiz.seed}-${q.id}`);
    const container = $("[data-options]");
    container.innerHTML = options.map((entry, optionIndex) => `<button class="option" type="button" data-option-index="${optionIndex}" aria-label="选项 ${optionIndex + 1}: ${escapeHTML(entry.text)}"><span class="option-index">${optionIndex + 1}</span><span class="option-text">${escapeHTML(entry.text)}</span></button>`).join("");
    container.dataset.order = JSON.stringify(options.map((entry) => q.options.indexOf(entry)));
    $$(".option", container).forEach((button) => button.addEventListener("click", () => chooseOption(Number(button.dataset.optionIndex))));
    $("[data-post-card]").animate ? $("[data-post-card]").animate([{ opacity: .5, transform: "translateY(7px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" }) : null;
  }
  function escapeHTML(value) { const element = document.createElement("div"); element.textContent = value; return element.innerHTML; }
  function chooseOption(displayIndex) {
    if (!state.quiz || state.quiz.locked) return;
    const order = JSON.parse($("[data-options]").dataset.order || "[]");
    const q = currentQuestion();
    const selected = q.options[order[displayIndex]];
    if (!selected) return;
    state.quiz.locked = true;
    const choice = $(`.option[data-option-index='${displayIndex}']`);
    choice.classList.add("is-selected");
    $$(".option").forEach((button) => { button.disabled = true; });
    playTone("select");
    state.quiz.scores[selected.scores.primary] = (state.quiz.scores[selected.scores.primary] || 0) + 2;
    state.quiz.scores[selected.scores.secondary] = (state.quiz.scores[selected.scores.secondary] || 0) + 1;
    state.quiz.primaryHits[selected.scores.primary] = (state.quiz.primaryHits[selected.scores.primary] || 0) + 1;
    state.quiz.styleCounts[selected.tone] = (state.quiz.styleCounts[selected.tone] || 0) + 1;
    state.quiz.answers.push({ questionId: q.id, optionText: selected.text, tone: selected.tone, primary: selected.scores.primary, secondary: selected.scores.secondary });
    const feedback = feedbackFor(selected.tone);
    $("[data-feedback-title]").textContent = feedback.title;
    $("[data-feedback-text]").textContent = feedback.text;
    $("[data-feedback]").hidden = false;
    safeSet(QUIZ_KEY, state.quiz);
    window.setTimeout(() => {
      $("[data-feedback]").hidden = true;
      state.quiz.currentIndex += 1;
      state.quiz.locked = false;
      if (state.quiz.currentIndex >= 12) finishQuiz(); else { safeSet(QUIZ_KEY, state.quiz); renderQuestion(); }
    }, 720);
  }
  function feedbackFor(tone) {
    const copy = { humor: ["这句把气氛接住了", "有人已经在评论区回复哈哈哈哈。"], empathy: ["这条很有温度", "发帖人可能会先看到你的这句。"], analysis: ["重点被你抓到了", "这层分析已经被人截图保存。"], irony: ["空气突然安静", "语气很轻，重点很重。"], watch: ["你留住了后续", "这条故事线还值得继续观察。"] };
    const [title, text] = copy[tone] || copy.watch; return { title, text };
  }

  function rankPersonas(scores, primaryHits, seed) {
    const priority = PERSONA_ORDER.reduce((map, id, index) => ({ ...map, [id]: index }), {});
    return PERSONA_ORDER.map((id) => ({ id, score: scores[id] || 0, hits: primaryHits[id] || 0, fallback: seededNumber(`${seed}-${id}`) }))
      .sort((a, b) => b.score - a.score || b.hits - a.hits || priority[a.id] - priority[b.id] || b.fallback - a.fallback);
  }
  function calculateInternetAge(result) { return 18 + ((result.score * 3 + hashString(result.primary)) % 19); }
  function finishQuiz() {
    const ranked = rankPersonas(state.quiz.scores, state.quiz.primaryHits, state.quiz.seed);
    const primary = ranked[0]; const secondary = ranked.find((entry) => entry.id !== primary.id) || ranked[1];
    state.result = { primary: primary.id, secondary: secondary.id, primaryScore: primary.score, age: calculateInternetAge({ primary: primary.id, score: primary.score }), seed: state.quiz.seed, answerCount: state.quiz.answers.length, answers: state.quiz.answers };
    const unlocked = updateCollectionFromResult();
    state.result.newUnlocks = unlocked;
    state.quiz = null;
    try { localStorage.removeItem(QUIZ_KEY); } catch { /* no action */ }
    renderResult();
    showView("result-view");
    state.unlockQueue = [...unlocked];
    if (state.unlockQueue.length) window.setTimeout(() => showAchievement(state.unlockQueue[0]), 580);
  }
  function updateCollectionFromResult() {
    const beforePersonas = new Set(state.collection.unlockedPersonas);
    const beforeAchievements = new Set(state.collection.unlockedAchievements);
    const result = state.result;
    state.collection.testCount += 1;
    state.collection.bestScore = Math.max(state.collection.bestScore, result.primaryScore);
    state.collection.lastResult = { primary: result.primary, secondary: result.secondary, age: result.age };
    state.collection.unlockedPersonas = [...new Set([...state.collection.unlockedPersonas, result.primary])];
    const toneCounts = result.answers.reduce((counts, entry) => { counts[entry.tone] = (counts[entry.tone] || 0) + 1; return counts; }, {});
    const judged = (toneCounts.analysis || 0) + (result.answers.filter((entry) => entry.primary === "judge").length);
    const uniqueCategories = new Set(result.answers.map((answer) => questions.find((q) => q.id === answer.questionId).category));
    const get = (id) => { if (!state.collection.unlockedAchievements.includes(id)) state.collection.unlockedAchievements.push(id); };
    if (state.collection.testCount >= 1) get("first");
    if (uniqueCategories.size === 6) get("allrounder");
    if ((toneCounts.humor || 0) >= 5) get("laugh");
    if ((toneCounts.empathy || 0) >= 5) get("warm");
    if (judged >= 5) get("sharp");
    if ((toneCounts.irony || 0) >= 4) get("irony");
    if (Object.values(toneCounts).filter((count) => count >= 2).length >= 4) get("varied");
    if (state.collection.unlockedPersonas.length >= 5) get("collector");
    saveCollection();
    const personaUnlocks = state.collection.unlockedPersonas.filter((id) => !beforePersonas.has(id)).map((id) => ({ type: "persona", id, ...personas[id] }));
    const achievementUnlocks = state.collection.unlockedAchievements.filter((id) => !beforeAchievements.has(id)).map((id) => ({ type: "achievement", id, ...achievements[id] }));
    return [...personaUnlocks, ...achievementUnlocks];
  }

  function renderResult() {
    if (!state.result) return;
    const primary = personas[state.result.primary]; const secondary = personas[state.result.secondary];
    $("[data-result-title]").textContent = primary.name;
    $("[data-result-title-card]").textContent = primary.name;
    $("[data-result-tagline]").textContent = primary.tagline;
    $("[data-result-secondary]").textContent = secondary.name;
    $("[data-result-age]").textContent = `${state.result.age} 岁`;
    $("[data-result-age-card]").textContent = `${state.result.age} 岁`;
    $("[data-result-haunts]").textContent = primary.haunts;
    $("[data-result-description]").textContent = primary.description;
    $("[data-result-sample]").textContent = `“${primary.sample}”`;
    $("[data-result-seal]").textContent = primary.glyph;
    const card = $("[data-result-card]");
    card.style.setProperty("--accent", primary.color);
    card.style.borderColor = `${primary.color}88`;
    card.classList.remove("is-revealed"); void card.offsetWidth; card.classList.add("is-revealed");
    const newUnlocks = state.result.newUnlocks || [];
    const list = $("[data-new-unlocks]");
    list.innerHTML = newUnlocks.length ? newUnlocks.map((entry) => `<span class="unlock-chip"><span class="unlock-chip-mark">${entry.glyph}</span>${entry.name}</span>`).join("") : "<span class='unlock-chip'>本局没有新藏品，换个回复试试。</span>";
    $("[data-share-note]").textContent = state.readOnly ? "这是朋友分享的只读结果。" : "图片会保存到你的设备。";
    const shareButton = $("[data-share-button]"); shareButton.textContent = state.readOnly ? "保存这张人格卡" : "生成分享卡片";
  }

  function renderCollection() {
    const overview = $("[data-collection-overview]");
    overview.innerHTML = `<div class="overview-block"><strong>${state.collection.unlockedPersonas.length} / 12</strong><span>人格已收集</span></div><div class="overview-block"><strong>${state.collection.unlockedAchievements.length} / 8</strong><span>成就已达成</span></div><div class="overview-block"><strong>${state.collection.testCount}</strong><span>已完成测试</span></div>`;
    const personaWall = $("[data-persona-wall]");
    personaWall.innerHTML = PERSONA_ORDER.map((id) => {
      const persona = personas[id]; const unlocked = state.collection.unlockedPersonas.includes(id);
      return `<button type="button" class="badge-button ${unlocked ? "" : "is-locked"}" data-collect-type="persona" data-collect-id="${id}" ${unlocked ? "" : "disabled"}><span class="badge-glyph" style="${unlocked ? `color:${persona.color};background:${persona.color}22` : ""}">${unlocked ? persona.glyph : "?"}</span><strong>${unlocked ? persona.name : "未发现的人格"}</strong><small>${unlocked ? persona.tagline : "完成不同风格的测试来解锁。"}</small></button>`;
    }).join("");
    const achievementWall = $("[data-achievement-wall]");
    achievementWall.innerHTML = Object.entries(achievements).map(([id, achievement]) => {
      const unlocked = state.collection.unlockedAchievements.includes(id);
      return `<button type="button" class="achievement-item badge-button ${unlocked ? "" : "is-locked"}" data-collect-type="achievement" data-collect-id="${id}" ${unlocked ? "" : "disabled"}><span class="badge-glyph">${unlocked ? achievement.glyph : "?"}</span><strong>${unlocked ? achievement.name : "隐藏成就"}</strong><small>${unlocked ? achievement.description : "保持发言，藏品会慢慢出现。"}</small></button>`;
    }).join("");
    $$('[data-collect-id]').forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.collectType, button.dataset.collectId)));
  }
  function openDetail(type, id) {
    const item = type === "persona" ? personas[id] : achievements[id]; if (!item) return;
    state.lastFocused = document.activeElement;
    $("[data-detail-type]").textContent = type === "persona" ? "人格徽章" : "隐藏成就";
    $("[data-detail-mark]").textContent = item.glyph;
    $("[data-detail-mark]").style.color = item.color || "var(--accent)";
    $("[data-detail-title]").textContent = item.name;
    $("[data-detail-description]").textContent = item.description || item.tagline;
    $("[data-detail-modal]").hidden = false;
    $("[data-detail-modal] .modal-close").focus();
  }
  function closeDetail() { $("[data-detail-modal]").hidden = true; state.lastFocused?.focus?.(); }
  function showAchievement(entry) {
    state.lastFocused = document.activeElement;
    $("[data-achievement-mark]").textContent = entry.glyph;
    $("[data-achievement-mark]").style.color = entry.color || "var(--accent)";
    $("[data-achievement-title]").textContent = entry.name;
    $("[data-achievement-description]").textContent = entry.description || entry.tagline;
    $("[data-achievement-modal]").hidden = false;
    playTone("unlock");
    $("[data-achievement-modal] .modal-close").focus();
  }
  function closeAchievement() {
    $("[data-achievement-modal]").hidden = true;
    state.unlockQueue.shift();
    if (state.unlockQueue.length) { window.setTimeout(() => showAchievement(state.unlockQueue[0]), 180); return; }
    state.lastFocused?.focus?.();
  }

  function resultHash() { return `#result=${encodeURIComponent(`${state.result.primary}.${state.result.secondary}.${state.result.age}`)}`; }
  function makeShareURL() { return `${location.href.split("#")[0]}${resultHash()}`; }
  async function shareCard() {
    if (!state.result) return;
    const button = $("[data-share-button]"); const original = button.textContent; button.disabled = true; button.textContent = "正在生成";
    try {
      const blob = await createShareImage();
      const url = makeShareURL();
      const file = new File([blob], "评论区人格卡.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ title: "我的评论区人格", text: `我是${personas[state.result.primary].name}，你是哪种？`, url, files: [file] }); showToast("已打开系统分享。"); }
        catch (error) { if (error.name !== "AbortError") downloadBlob(blob); }
      } else { downloadBlob(blob); await copyText(url); }
      if (!state.readOnly) history.replaceState(null, "", resultHash());
    } catch (error) { console.error(error); showToast("生成失败了，请再试一次。"); }
    finally { button.disabled = false; button.textContent = original; }
  }
  function createShareImage() {
    return new Promise((resolve, reject) => {
      try {
        const result = state.result; const primary = personas[result.primary]; const secondary = personas[result.secondary];
        const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350;
        const ctx = canvas.getContext("2d");
        const background = state.theme === "light" ? "#f7f6f5" : "#17171d"; const surface = state.theme === "light" ? "#ffffff" : "#292930"; const text = state.theme === "light" ? "#25242a" : "#f4f3f5"; const muted = state.theme === "light" ? "#68666d" : "#a9a8b3";
        ctx.fillStyle = background; ctx.fillRect(0, 0, 1080, 1350);
        ctx.fillStyle = primary.color; ctx.globalAlpha = .16; ctx.beginPath(); ctx.arc(952, 110, 280, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        roundRect(ctx, 76, 82, 928, 1186, 42, surface); ctx.fill();
        ctx.fillStyle = muted; ctx.font = "600 30px system-ui, sans-serif"; ctx.fillText("评论区人格测试", 136, 160); ctx.textAlign = "right"; ctx.fillText(`${result.age} 岁互联网年龄`, 942, 160); ctx.textAlign = "left";
        ctx.strokeStyle = primary.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 420, 150, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = primary.color; ctx.font = "900 134px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(primary.glyph, 540, 468); ctx.textAlign = "left";
        ctx.fillStyle = muted; ctx.font = "700 27px system-ui, sans-serif"; ctx.fillText("你的主人格", 136, 680);
        ctx.fillStyle = text; ctx.font = "900 76px system-ui, sans-serif"; ctx.fillText(primary.name, 136, 778);
        ctx.fillStyle = primary.color; ctx.font = "700 37px system-ui, sans-serif"; wrapCanvasText(ctx, primary.tagline, 136, 848, 810, 52);
        ctx.fillStyle = muted; ctx.font = "600 28px system-ui, sans-serif"; ctx.fillText(`隐藏副人格  ${secondary.name}`, 136, 1024); ctx.fillText(`常驻评论区  ${primary.haunts}`, 136, 1080);
        ctx.strokeStyle = state.theme === "light" ? "#ddd9d7" : "#3d3d47"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(136, 1148); ctx.lineTo(944, 1148); ctx.stroke();
        ctx.fillStyle = muted; ctx.font = "600 24px system-ui, sans-serif"; ctx.fillText("你以为你在回帖，评论区早就记住你了。", 136, 1213); ctx.textAlign = "right"; ctx.fillText("仅供娱乐", 944, 1213);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas export failed")), "image/png");
      } catch (error) { reject(error); }
    });
  }
  function roundRect(ctx, x, y, width, height, radius, fill) { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); if (fill) ctx.fill(); }
  function wrapCanvasText(ctx, value, x, y, maxWidth, lineHeight) { let line = ""; let offset = 0; for (const char of value) { if (ctx.measureText(line + char).width > maxWidth && line) { ctx.fillText(line, x, y + offset); line = char; offset += lineHeight; } else line += char; } if (line) ctx.fillText(line, x, y + offset); }
  function downloadBlob(blob) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "评论区人格卡.png"; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  async function copyText(value) { try { await navigator.clipboard.writeText(value); showToast("人格卡已保存，分享链接也复制好了。"); } catch { showToast("人格卡已保存。复制链接可从地址栏获取。 "); } }

  function initAudio() { if (state.audio || state.muted) return; const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return; state.audio = new Audio(); }
  function playTone(type) {
    initAudio(); if (!state.audio || state.muted) return;
    const map = { select: [440, .06], unlock: [660, .12], tap: [320, .04] }; const [frequency, duration] = map[type] || map.tap; const oscillator = state.audio.createOscillator(); const gain = state.audio.createGain(); oscillator.frequency.value = frequency; oscillator.type = "sine"; gain.gain.setValueAtTime(.045, state.audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, state.audio.currentTime + duration); oscillator.connect(gain).connect(state.audio.destination); oscillator.start(); oscillator.stop(state.audio.currentTime + duration);
  }
  function showToast(message) { const toast = $("[data-toast]"); toast.textContent = message; toast.hidden = false; window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2900); }
  function quitQuiz() { if (!state.quiz) return; if (confirm("要退出吗？当前答题进度会保留，稍后可以继续。")) { showView("home-view"); updateHomeStats(); } }
  function clearCollection() { if (confirm("确定清除所有人格、成就和测试记录吗？这个操作不能撤销。")) { state.collection = defaultCollection(); saveCollection(); renderCollection(); showToast("收藏已清除。"); } }

  function parseSharedResult() {
    const match = location.hash.match(/^#result=([^&]+)/); if (!match) return false;
    const [primary, secondary, age] = decodeURIComponent(match[1]).split(".");
    if (!personas[primary] || !personas[secondary] || !/^\d+$/.test(age)) return false;
    state.result = { primary, secondary, age: Number(age), primaryScore: 0, newUnlocks: [] }; state.readOnly = true; renderResult(); showView("result-view"); return true;
  }
  function handleAction(action) {
    playTone("tap");
    if (action === "home") { history.replaceState(null, "", location.href.split("#")[0]); state.readOnly = false; showView("home-view"); updateHomeStats(); }
    if (action === "start") startQuiz();
    if (action === "collection") { renderCollection(); showView("collection-view"); }
    if (action === "restart") startQuiz(true);
    if (action === "quit-quiz") quitQuiz();
    if (action === "share-card") shareCard();
    if (action === "clear-collection") clearCollection();
    if (action === "close-achievement") closeAchievement();
    if (action === "close-detail") closeDetail();
    if (action === "toggle-sound") { state.muted = !state.muted; updateSoundButton(); saveSettings(); showToast(state.muted ? "音效已关闭。" : "音效已打开。"); }
    if (action === "toggle-theme") { state.theme = state.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = state.theme; saveSettings(); }
  }
  function bindEvents() {
    document.addEventListener("click", (event) => { const target = event.target.closest("[data-action]"); if (target) handleAction(target.dataset.action); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { closeAchievement(); closeDetail(); }
      if ($("#quiz-view").hidden || state.quiz?.locked) return;
      if (["1", "2", "3", "4"].includes(event.key)) { event.preventDefault(); $(`.option[data-option-index='${Number(event.key) - 1}']`)?.click(); }
    });
    window.addEventListener("hashchange", () => { if (location.hash) parseSharedResult(); });
  }
  function init() { loadState(); restoreQuiz(); bindEvents(); updateHomeStats(); if (!parseSharedResult()) showView("home-view"); }
  init();
})();
