const anshiPosts = [
  {
    id: 'xuanzong', person: 'xuanzong', name: '唐玄宗', place: '长安 · 大明宫', time: '12月15日 申时', avatar: '玄', art: 'art-palace', artLabel: '宫门 · 申时', tag: '宫城内', tagTone: 'red',
    title: '潼关，真的守不住了吗？', text: '高力士说，城外的风里有土腥气。朕让人把地图再铺开一次，红线停在潼关。只要它还在，长安就还在。', likes: 28, comments: 4,
    quote: '“朕”也在等一个不会来的好消息。', role: '帝国的中心，第一次感到摇晃', proximity: '你给了权力一个近距离的注视。'
  },
  {
    id: 'yang', person: 'yang', name: '杨贵妃', place: '华清宫 · 骊山', time: '12月15日 戌时', avatar: '杨', art: 'art-moon', artLabel: '骊山月 · 戌时', tag: '仅自己可见', tagTone: 'gold',
    title: '今晚的月亮，像一盏快要熄的灯。', text: '有人劝我先走。我问，走去哪儿？宫墙外的人看我，像看一场灾祸；宫墙里的人看我，像看一件行李。', likes: 43, comments: 9,
    quote: '当一个人只剩下“被看见”的方式，她还拥有选择吗？', role: '被时代推到聚光灯下的人', proximity: '你停在她的动态上，比刚才久了一点。'
  },
  {
    id: 'dufu', person: 'dufu', name: '杜甫', place: '鄜州 · 客舍', time: '12月16日 子时', avatar: '甫', art: 'art-letter', artLabel: '一纸家书 · 子时', tag: '家书', tagTone: '',
    title: '月亮照着谁家的窗？', text: '寄出的信不知道还能不能到。妻子和孩子在鄜州，我在长安以北。乱世里，最远的不是路，是一句“我没事”。', likes: 76, comments: 18,
    quote: '“白头搔更短，浑欲不胜簪。”', role: '把失去写成诗的人', proximity: '你在他的字句里，找到了一点自己的家。'
  },
  {
    id: 'people', person: 'people', name: '长安百姓', place: '崇仁坊 · 城门边', time: '12月16日 寅时', avatar: '民', art: 'art-gate', artLabel: '城门 · 寅时', tag: '附近的人', tagTone: 'red',
    title: '有人看见我家的灯吗？', text: '坊门提前落了锁。卖胡饼的老张把最后一炉火压灭，隔壁小孩问，明天还上学吗。没人回答。', likes: 112, comments: 31,
    quote: '宏大的历史，落在一盏被吹灭的灯上。', role: '没有姓名的多数人', proximity: '你开始把“战争”想成一条条具体的生活。'
  },
  {
    id: 'soldier', person: 'soldier', name: '潼关守卒', place: '潼关 · 前线', time: '12月16日 卯时', avatar: '卒', art: 'art-map', artLabel: '潼关 · 卯时', tag: '前线', tagTone: '',
    title: '援军还在路上吗？', text: '我们把箭壶里的箭数了三遍。将军说援军明日便到。明日是哪一个明日？关外的火已经亮了一夜。', likes: 89, comments: 22,
    quote: '地图上的一道线，是人站在风里画出来的。', role: '守住一条线，也守住不了明天', proximity: '你听见前线的风，温度升高了。'
  },
  {
    id: 'you', person: 'you', name: '你', place: '长安 · 旁观席', time: '此刻', avatar: '游', art: 'art-user', artLabel: '你的视角', tag: '刚刚加入', tagTone: 'gold',
    title: '我只是刷到了一条动态。', text: '然后我发现，自己已经在替某个人担心。信息流继续往下，历史没有暂停键。', likes: 0, comments: 0,
    quote: '你不是旁观者，你只是还没决定站在哪里。', role: '带着今天的眼睛回看昨天', proximity: '你把自己的生活，也放进了这场动荡。'
  }
];

const eventCatalog = {
  anshi: {
    label: '755 · 安史之乱', kicker: '一场动荡', title: '长安失守前<br /><em>72</em>小时', intro: '五个身份，一次失控的夜晚', stamp: 'HIST / 755',
    timelines: [['现在', '你在长安城里', 'all'], ['12月15日', '潼关告急', 'xuanzong'], ['12月16日', '夜半出城', 'people'], ['12月17日', '马嵬驿', 'yang']],
    note: '“安史之乱”持续八年，改变了唐朝的财政、军制与人口版图。信息流里的时间被压缩，但每条动态都对应史料中的一个真实切面。', source: '《资治通鉴》卷二百十七', endingKicker: '755 · 马嵬驿以西', endingTitle: '你看到的是一场战争，<br /><em>还是一群人的生活被突然改变？</em>', endingNote: '历史不是一个结局。它是每个人手机里，<br />那条再也没有更新的动态。',
    people: [['xuanzong', '唐玄宗', '长安 · 宫城', '玄', 'xuanzong'], ['yang', '杨贵妃', '华清宫 · 马嵬', '杨', 'yang'], ['dufu', '杜甫', '鄜州 · 家书', '甫', 'dufu'], ['people', '长安百姓', '坊间 · 城门', '民', 'people'], ['soldier', '边疆士兵', '潼关 · 前线', '卒', 'soldier']], posts: anshiPosts
  },
  chibi: {
    label: '208 · 赤壁之战', kicker: '一江火线', title: '东风抵达前<br /><em>24</em>小时', intro: '江面上的风，吹向谁的船？', stamp: 'HIST / 208',
    timelines: [['现在', '你在江面上', 'all'], ['冬至前夜', '连环船成阵', 'caocao'], ['子夜', '东风起', 'zhouyu'], ['天明', '火照赤壁', 'people']],
    note: '赤壁之战发生于建安十三年（208）。史料对参战人数和细节多有不同，但“火攻”与长江水战改变了三国鼎立的走向。', source: '《三国志》·《资治通鉴》', endingKicker: '208 · 赤壁江心', endingTitle: '你看到的是一场胜负，<br /><em>还是每个人都在赌一个风向？</em>', endingNote: '一阵风改变了天下。可在风里站着的，<br />从来不是地图上的箭头。',
    people: [['caocao', '曹操', '乌林 · 水寨', '操', 'xuanzong'], ['zhouyu', '周瑜', '柴桑 · 江都督', '瑜', 'dufu'], ['sunquan', '孙权', '建业 · 吴侯府', '权', 'soldier'], ['huangai', '黄盖', '赤壁 · 火船', '盖', 'yang'], ['people', '江东百姓', '江岸 · 渔村', '民', 'people']], posts: [
      { id: 'caocao', person: 'caocao', avatarTone: 'xuanzong', name: '曹操', place: '乌林 · 水寨', time: '冬至前夜', avatar: '操', art: 'art-map', artLabel: '江面 · 前夜', tag: '军帐', tagTone: 'red', title: '北方的马，晕船了。', text: '士卒把船用铁索连起来，说这样就不会摇。江风却从缝里钻进来，带着南方湿冷的水气。', likes: 36, comments: 8, quote: '他以为连住船，就能连住胜局。', role: '把长江当作一道可以跨过的线', proximity: '你看见一支大军，第一次被水面说服。' },
      { id: 'zhouyu', person: 'zhouyu', avatarTone: 'dufu', name: '周瑜', place: '柴桑 · 江都督', time: '子时', avatar: '瑜', art: 'art-moon', artLabel: '东风 · 子时', tag: '军情', tagTone: '', title: '风向变了。', text: '黄盖的船已经出发。每个人都知道这是一场赌局，只有江水看起来什么都不知道。', likes: 84, comments: 17, quote: '火要借风，胜负也要。', role: '把一阵风写进战术的人', proximity: '你开始等待一个还没发生的转折。' },
      { id: 'sunquan', person: 'sunquan', avatarTone: 'soldier', name: '孙权', place: '建业 · 吴侯府', time: '丑时', avatar: '权', art: 'art-letter', artLabel: '一纸军令 · 丑时', tag: '抉择', tagTone: 'gold', title: '投降，还是把江东押上？', text: '案上的佩剑没有出鞘。兄长留下的江山很轻，落在一个人的决定上，却重得抬不起手。', likes: 58, comments: 12, quote: '有时历史只等一个人说“战”。', role: '在地图边缘按住命运的人', proximity: '你把自己放进了那张没有退路的桌前。' },
      { id: 'huangai', person: 'huangai', avatarTone: 'yang', name: '黄盖', place: '赤壁 · 火船', time: '寅时', avatar: '盖', art: 'art-palace', artLabel: '火船 · 寅时', tag: '前线', tagTone: 'red', title: '苦肉计是真的疼。', text: '挨打的时候不能喊，点火的时候也不能犹豫。船头的油布贴着风，像一张已经写好的信。', likes: 91, comments: 21, quote: '计策落地，先落在人的身体上。', role: '用自己的伤换一条江的火光', proximity: '你听见火焰靠近木板的声音。' },
      { id: 'people', person: 'people', avatarTone: 'people', name: '江东百姓', place: '江岸 · 渔村', time: '天明', avatar: '民', art: 'art-gate', artLabel: '江岸 · 天明', tag: '附近的人', tagTone: 'red', title: '江面上为什么一直亮？', text: '孩子们以为是过节。大人把门闩又插了一遍，水里的火照到每一张没有睡着的脸。', likes: 119, comments: 34, quote: '战报之外，先醒来的是一座村子。', role: '被风向卷进天下大势的人', proximity: '你终于看见，胜利也会照亮普通人的恐惧。' }
    ]
  },
  jingkang: {
    label: '1127 · 靖康之变', kicker: '汴京最后一夜', title: '城门合上前<br /><em>48</em>小时', intro: '一座城，如何在消息里失去声音？', stamp: 'HIST / 1127',
    timelines: [['现在', '你在汴京城里', 'all'], ['正月初三', '金兵抵城', 'people'], ['正月初四', '宫门传诏', 'huizong'], ['正月初五', '北行开始', 'gongnv']],
    note: '靖康之变发生于北宋靖康二年（1127），徽、钦二帝及大量宗室、官员被金军掳走，北宋灭亡。', source: '《宋史》·《靖康稗史笺证》', endingKicker: '1127 · 汴京城外', endingTitle: '你看到的是一座城的陷落，<br /><em>还是许多人被迫带走的故乡？</em>', endingNote: '城墙会记住攻城的日期。<br />人只能记住，谁没有回来。',
    people: [['huizong', '宋徽宗', '艮岳 · 宫中', '徽', 'xuanzong'], ['qinzong', '宋钦宗', '汴京 · 延福宫', '钦', 'soldier'], ['li-gang', '李纲', '宣德门 · 城防', '纲', 'dufu'], ['gongnv', '宫中女官', '内东门 · 宫墙', '女', 'yang'], ['people', '汴京百姓', '朱雀门 · 坊间', '民', 'people']], posts: [
      { id: 'huizong', person: 'huizong', avatarTone: 'xuanzong', name: '宋徽宗', place: '艮岳 · 宫中', time: '正月初三', avatar: '徽', art: 'art-letter', artLabel: '一方砚台 · 初三', tag: '宫城内', tagTone: 'gold', title: '今天不写字。', text: '砚里的墨已经干了。有人来报城外的消息，我让他再说一遍，然后问，园里的梅花开了吗。', likes: 27, comments: 6, quote: '山河将倾时，人会抓住最熟悉的事。', role: '用审美躲过一次次坏消息的人', proximity: '你看见一个帝王，如何把现实推迟到明天。' },
      { id: 'qinzong', person: 'qinzong', avatarTone: 'soldier', name: '宋钦宗', place: '汴京 · 延福宫', time: '正月初四', avatar: '钦', art: 'art-palace', artLabel: '宫门 · 初四', tag: '诏书', tagTone: 'red', title: '谁去金营？', text: '大臣们说要议和。城里的粮只够几日，城外的旗却已经插到护城河边。每一个选择都像是替别人签字。', likes: 63, comments: 14, quote: '求和不是一个按钮，是一条走不回来的路。', role: '在亡国边缘接过诏书的人', proximity: '你感到一座制度在自己手里变轻。' },
      { id: 'li-gang', person: 'li-gang', avatarTone: 'dufu', name: '李纲', place: '宣德门 · 城防', time: '正月初四', avatar: '纲', art: 'art-gate', artLabel: '宣德门 · 初四', tag: '守城', tagTone: '', title: '城上还有人。', text: '百姓把家里的门板拆下来运到城上。没有谁问能不能守住，大家只是在搬东西，像往常一样把事情做完。', likes: 98, comments: 26, quote: '守城有时不是命令，是不想再退了。', role: '把“抵抗”变成一件手边小事的人', proximity: '你开始相信，普通人也能托住一面城墙。' },
      { id: 'gongnv', person: 'gongnv', avatarTone: 'yang', name: '宫中女官', place: '内东门 · 宫墙', time: '正月初五', avatar: '女', art: 'art-moon', artLabel: '宫墙 · 初五', tag: '北行', tagTone: 'gold', title: '别忘了带那支簪子。', text: '行李只能装一只小箱。她把母亲留下的簪子藏进袖里，回头看了一眼宫门，像看一扇再也不会打开的窗。', likes: 87, comments: 20, quote: '离开故乡的人，先带走一件最小的东西。', role: '在历史缝隙里保留名字的人', proximity: '你把“被带走”听成了一个人的声音。' },
      { id: 'people', person: 'people', avatarTone: 'people', name: '汴京百姓', place: '朱雀门 · 坊间', time: '正月初五', avatar: '民', art: 'art-user', artLabel: '朱雀门 · 清晨', tag: '附近的人', tagTone: 'red', title: '城门外的路，通向哪里？', text: '有人说北边，有人说只是去城外。卖茶的摊子还在冒热气，没人敢坐下来喝完这一碗。', likes: 131, comments: 39, quote: '一座城的沉默，先从摊位空下来开始。', role: '把故乡背在身上的人', proximity: '你不再把“北行”当成一个地名。' }
    ]
  },
  hongmen: {
    label: '前206 · 鸿门宴', kicker: '帐外风声', title: '剑舞之前<br /><em>一</em>场酒席', intro: '一张席位，谁在等谁先举杯？', stamp: 'HIST / 前206',
    timelines: [['现在', '你在鸿门军帐', 'all'], ['午后', '沛公赴宴', 'liubang'], ['酒过三巡', '项庄舞剑', 'xiangzhuang'], ['日暮', '樊哙闯帐', 'fanKuai']],
    note: '鸿门宴发生在秦末楚汉相争之际，主要叙事见于《史记·项羽本纪》《史记·高祖本纪》。人物言行按史书叙事重构为信息流。', source: '《史记》·项羽本纪 / 高祖本纪', endingKicker: '前206 · 鸿门军帐外', endingTitle: '你看到的是一场宴会，<br /><em>还是一场被酒杯拖延的决断？</em>', endingNote: '有人记住了剑舞，有人记住了逃走。<br />历史也记住了，那晚谁没有下手。',
    people: [['xiangyu', '项羽', '鸿门 · 楚军大帐', '羽', 'xuanzong'], ['liubang', '刘邦', '鸿门 · 帐外车骑', '邦', 'dufu'], ['fanzeng', '范增', '鸿门 · 楚军席间', '增', 'soldier'], ['xiangzhuang', '项庄', '鸿门 · 帐中', '庄', 'yang'], ['fanKuai', '樊哙', '鸿门 · 帐前', '哙', 'people']], posts: [
      { id: 'xiangyu', person: 'xiangyu', avatarTone: 'xuanzong', name: '项羽', place: '鸿门 · 楚军大帐', time: '午后', avatar: '羽', art: 'art-palace', artLabel: '大帐 · 午后', tag: '主席', tagTone: 'red', title: '今日只是喝酒。', text: '刘邦说他没有称王的心思。我看着他把杯子端得很稳，帐外的马却一直在刨地。', likes: 49, comments: 10, quote: '有些威胁，越是客气，越让人难以举剑。', role: '手里握着天下，却还在犹豫的人', proximity: '你看见力量第一次被迟疑拽住。' },
      { id: 'liubang', person: 'liubang', avatarTone: 'dufu', name: '刘邦', place: '鸿门 · 帐外车骑', time: '午后', avatar: '邦', art: 'art-letter', artLabel: '一封请罪帖 · 午后', tag: '赴宴', tagTone: 'gold', title: '我先进去。', text: '张良说，话要说得比酒更软。剑不能带进帐，但总要有人把回去的路记清楚。', likes: 74, comments: 19, quote: '活下来的人，先学会把自己放低。', role: '在刀口前练习低头的人', proximity: '你开始数，帐门离他有几步。' },
      { id: 'fanzeng', person: 'fanzeng', avatarTone: 'soldier', name: '范增', place: '鸿门 · 楚军席间', time: '酒过三巡', avatar: '增', art: 'art-map', artLabel: '玉玦 · 席间', tag: '暗号', tagTone: 'red', title: '我举了三次玉玦。', text: '大王没有看懂，或者不愿看懂。真正让人着急的，不是敌人还在眼前，是身边的人不肯做决定。', likes: 93, comments: 27, quote: '谋士最怕的，是主君把机会当成酒意。', role: '看见结局，却无法替人落子的老人', proximity: '你听见一个提醒被沉默吞掉。' },
      { id: 'xiangzhuang', person: 'xiangzhuang', avatarTone: 'yang', name: '项庄', place: '鸿门 · 帐中', time: '酒过三巡', avatar: '庄', art: 'art-moon', artLabel: '剑影 · 帐中', tag: '剑舞', tagTone: '', title: '这支剑舞，跳给谁看？', text: '叔父说席间太闷，让我舞剑助兴。剑锋绕过刘邦的酒杯，范哙还没有进来，项伯先挡在了前面。', likes: 66, comments: 15, quote: '最危险的舞，不需要音乐。', role: '被推上剑锋的人', proximity: '你不再分得清，这是舞还是命令。' },
      { id: 'fanKuai', person: 'fanKuai', avatarTone: 'people', name: '樊哙', place: '鸿门 · 帐前', time: '日暮', avatar: '哙', art: 'art-gate', artLabel: '帐门 · 日暮', tag: '闯帐', tagTone: 'red', title: '主公还没出来。', text: '守门的人拦我，我把盾往地上一放。里面的人喝酒，外面的人等命。既然等不到消息，我自己进去问。', likes: 118, comments: 36, quote: '有些忠诚，就是在门外等不住。', role: '把沉默撞开的人', proximity: '你看见一扇门，被一个人推开。' }
    ]
  },
  jiashen: {
    label: '1644 · 甲申之变', kicker: '京城失声', title: '煤山之前<br /><em>一</em>个清晨', intro: '城门打开后，谁还能回到昨天？', stamp: 'HIST / 1644',
    timelines: [['现在', '你在北京城里', 'all'], ['三月十八', '城外炮声', 'people'], ['三月十九', '宫门传报', 'chongzhen'], ['午后', '新朝入城', 'soldier']],
    note: '甲申之变发生在明崇祯十七年（1644）三月，李自成军进入北京，崇祯帝自缢，明朝在北京的统治结束。', source: '《明史》·《甲申传信录》', endingKicker: '1644 · 北京城内', endingTitle: '你看到的是一个王朝的终点，<br /><em>还是每个普通人突然失去的日常？</em>', endingNote: '城门会在某个时刻打开。<br />但回家的路，不会因此变得更容易。',
    people: [['chongzhen', '崇祯帝', '紫禁城 · 宫中', '祯', 'xuanzong'], ['wangcheng-en', '王承恩', '煤山 · 宫门', '恩', 'dufu'], ['li-zicheng', '李自成', '德胜门 · 城外', '闯', 'soldier'], ['shopkeeper', '北京店主', '前门 · 街市', '掌', 'yang'], ['people', '北京百姓', '内城 · 坊巷', '民', 'people']], posts: [
      { id: 'chongzhen', person: 'chongzhen', avatarTone: 'xuanzong', name: '崇祯帝', place: '紫禁城 · 宫中', time: '三月十九 卯时', avatar: '祯', art: 'art-palace', artLabel: '宫门 · 卯时', tag: '宫城内', tagTone: 'red', title: '城里还有谁能来？', text: '奏报一封封送进来，字越来越少。朕问守城的人去了哪里，殿里没有人敢先回答。', likes: 39, comments: 12, quote: '最后的命令，往往先失去回音。', role: '在空荡大殿里等待答复的人', proximity: '你听见一个王朝的回声变短。' },
      { id: 'wangcheng-en', person: 'wangcheng-en', avatarTone: 'dufu', name: '王承恩', place: '煤山 · 宫门', time: '三月十九 辰时', avatar: '恩', art: 'art-letter', artLabel: '宫灯 · 辰时', tag: '随行', tagTone: 'gold', title: '宫灯还亮着。', text: '平日里换灯油的人没有来。我把灯芯拨亮一点，陛下已经往北边去了，脚步比夜里更轻。', likes: 82, comments: 25, quote: '最后陪在身边的人，往往没有名字留在大事里。', role: '替宫殿守住最后一点光的人', proximity: '你看见忠诚，不是一句口号。' },
      { id: 'li-zicheng', person: 'li-zicheng', avatarTone: 'soldier', name: '李自成', place: '德胜门 · 城外', time: '三月十九 辰时', avatar: '闯', art: 'art-map', artLabel: '城门 · 辰时', tag: '入城', tagTone: 'red', title: '城门开了。', text: '有人说北京很大，大到能装下所有人的愿望。马蹄踏进城时，我只看见一条空出来的路。', likes: 71, comments: 18, quote: '夺下城池的人，也还没握住明天。', role: '带着新秩序进入旧都的人', proximity: '你看见胜利刚刚抵达，也开始不安。' },
      { id: 'shopkeeper', person: 'shopkeeper', avatarTone: 'yang', name: '北京店主', place: '前门 · 街市', time: '三月十九 午后', avatar: '掌', art: 'art-moon', artLabel: '前门 · 午后', tag: '街市', tagTone: '', title: '招牌还要不要挂？', text: '隔壁已经把门板卸下来了，说新军进城不抢百姓。我想起昨晚没卖完的米，还是把门开了一条缝。', likes: 107, comments: 32, quote: '改朝换代，先问的是明天能不能开门。', role: '把一日三餐扛过兵荒马乱的人', proximity: '你把“改朝换代”听成了店门的一声轻响。' },
      { id: 'people', person: 'people', avatarTone: 'people', name: '北京百姓', place: '内城 · 坊巷', time: '三月十九 午后', avatar: '民', art: 'art-user', artLabel: '坊巷 · 午后', tag: '附近的人', tagTone: 'red', title: '有人喊“新皇帝”，也有人在找家人。', text: '巷子里的人挤到一起听消息。孩子问，今天还去不去井边打水。大人说，先把桶拿好。', likes: 139, comments: 44, quote: '历史喊得很大声，日子仍要一桶水一桶水地过。', role: '在巨变里照常寻找水井的人', proximity: '你看见日常，比口号更顽强。' }
    ]
  },
  humen: {
    label: '1839 · 虎门销烟', kicker: '海口的火', title: '销烟池点火前<br /><em>三</em>天', intro: '一箱烟土，怎样变成一个国家的决定？', stamp: 'HIST / 1839',
    timelines: [['现在', '你在虎门海口', 'all'], ['五月二十', '烟土缴齐', 'linzexu'], ['五月二十三', '销烟开池', 'worker'], ['六月初', '海风传讯', 'fisher']],
    note: '虎门销烟发生于1839年6月，林则徐在广东虎门公开销毁收缴的鸦片，是中国近代史的重要节点。', source: '《林则徐全集》·《清实录》', endingKicker: '1839 · 虎门海口', endingTitle: '你看到的是一场销毁，<br /><em>还是一个国家拒绝继续被麻痹？</em>', endingNote: '池里的烟土会散去。<br />海风却已经把新的问题吹向更远处。',
    people: [['linzexu', '林则徐', '虎门 · 销烟池', '林', 'xuanzong'], ['worker', '销烟工人', '虎门 · 池边', '工', 'dufu'], ['merchant', '广州行商', '十三行 · 商馆', '商', 'yang'], ['fisher', '虎门渔民', '珠江口 · 渔船', '渔', 'soldier'], ['people', '广州百姓', '虎门 · 海堤', '民', 'people']], posts: [
      { id: 'linzexu', person: 'linzexu', avatarTone: 'xuanzong', name: '林则徐', place: '虎门 · 销烟池', time: '五月二十', avatar: '林', art: 'art-map', artLabel: '虎门 · 五月', tag: '钦差', tagTone: 'red', title: '缴来的箱子，堆成了一座墙。', text: '册子上写着一箱又一箱。有人说烧掉太可惜，我说留着才是更大的祸害。今日写下的数字，明日都要算清。', likes: 95, comments: 28, quote: '禁绝不是一句态度，是一页页账本。', role: '把决心写进清册的人', proximity: '你看见反抗，先是一笔不肯含糊的记录。' },
      { id: 'worker', person: 'worker', avatarTone: 'dufu', name: '销烟工人', place: '虎门 · 池边', time: '五月二十三', avatar: '工', art: 'art-palace', artLabel: '销烟池 · 午后', tag: '开池', tagTone: 'gold', title: '石灰倒下去，水开始翻。', text: '我们按着吩咐把烟土切碎、浸泡、搅拌。风往脸上吹，谁都不敢凑近。池边站满了人，安静得只剩水声。', likes: 121, comments: 37, quote: '大事落地时，也是一双双手在做工。', role: '把命令变成现实的人', proximity: '你闻到一种难以言说的气味，正在散开。' },
      { id: 'merchant', person: 'merchant', avatarTone: 'yang', name: '广州行商', place: '十三行 · 商馆', time: '五月二十二', avatar: '商', art: 'art-letter', artLabel: '十三行 · 夜', tag: '商路', tagTone: '', title: '账房问，船还来不来。', text: '账本摊开，平码和货单都没变，变的是每个人说话的声音。海上那边会怎么回，我们谁也不知道。', likes: 57, comments: 13, quote: '商路断续之间，先被悬起来的是生计。', role: '在两种秩序之间算账的人', proximity: '你感到风暴还没来，港口已经变了。' },
      { id: 'fisher', person: 'fisher', avatarTone: 'soldier', name: '虎门渔民', place: '珠江口 · 渔船', time: '五月二十三', avatar: '渔', art: 'art-moon', artLabel: '珠江口 · 傍晚', tag: '海上', tagTone: '', title: '今天的海水，颜色不一样。', text: '孩子问岸上为什么那么多人。我说他们在办一件很大的事。网还是要下，但船不能靠得太近。', likes: 103, comments: 30, quote: '国家的决定，会先落在离海最近的人身上。', role: '在潮水里读消息的人', proximity: '你看见海风如何吹进一个家庭的晚饭。' },
      { id: 'people', person: 'people', avatarTone: 'people', name: '广州百姓', place: '虎门 · 海堤', time: '五月二十三', avatar: '民', art: 'art-gate', artLabel: '海堤 · 午后', tag: '围观', tagTone: 'red', title: '我们站在堤上，看了一整天。', text: '有人鼓掌，有人不说话。烟从池边升起来，飘过头顶的时候，谁都知道这不是一场普通的热闹。', likes: 148, comments: 48, quote: '有人围观历史，后来才发现自己就在其中。', role: '见证一池烟土化开的多数人', proximity: '你站在人群里，也被这阵风吹到了。' }
    ]
  },
  wuchang: {
    label: '1911 · 武昌起义', kicker: '枪声之后', title: '工程营枪响后<br /><em>12</em>小时', intro: '一声枪响，如何传遍一座城？', stamp: 'HIST / 1911',
    timelines: [['现在', '你在武昌城里', 'all'], ['10月10日', '工程营起事', 'soldier'], ['深夜', '楚望台易帜', 'student'], ['10月11日', '城门消息', 'shopkeeper']],
    note: '武昌起义爆发于1911年10月10日，是辛亥革命的重要开端。起义军随后占领武昌，湖北军政府成立。', source: '《辛亥革命史》·《湖北革命实录》', endingKicker: '1911 · 武昌城内', endingTitle: '你看到的是一声枪响，<br /><em>还是无数人终于决定不再沉默？</em>', endingNote: '枪声会过去。<br />但一座城已经学会，用新的名字称呼明天。',
    people: [['soldier', '工程营士兵', '武昌 · 工程营', '兵', 'soldier'], ['student', '湖北学生', '武昌 · 楚望台', '学', 'dufu'], ['tang-hualong', '谘议局议员', '武昌 · 城内', '议', 'xuanzong'], ['shopkeeper', '汉口店主', '汉口 · 江汉关', '掌', 'yang'], ['people', '武昌百姓', '武昌 · 城门', '民', 'people']], posts: [
      { id: 'soldier', person: 'soldier', avatarTone: 'soldier', name: '工程营士兵', place: '武昌 · 工程营', time: '10月10日 夜', avatar: '兵', art: 'art-map', artLabel: '工程营 · 夜', tag: '起事', tagTone: 'red', title: '枪已经响了。', text: '原先说好的人还没到齐，号角却先响起来。有人把辫子剪下塞进衣襟，说既然走到这一步，就别再回头看。', likes: 116, comments: 35, quote: '革命并不总按计划开始。', role: '把犹豫留在营门里的人', proximity: '你听见枪声，也听见许多人同时深吸一口气。' },
      { id: 'student', person: 'student', avatarTone: 'dufu', name: '湖北学生', place: '武昌 · 楚望台', time: '10月10日 深夜', avatar: '学', art: 'art-letter', artLabel: '传单 · 深夜', tag: '易帜', tagTone: 'gold', title: '城头换了旗。', text: '白天还在背课文，晚上有人把新旗递到我手里。布很轻，举起来的时候，手却一直在抖。', likes: 128, comments: 42, quote: '新世界抵达时，先被一双年轻的手举起来。', role: '把课本之外的未来举过城头的人', proximity: '你看见理想第一次有了重量。' },
      { id: 'tang-hualong', person: 'tang-hualong', avatarTone: 'xuanzong', name: '谘议局议员', place: '武昌 · 城内', time: '10月11日 凌晨', avatar: '议', art: 'art-palace', artLabel: '议事厅 · 凌晨', tag: '议事', tagTone: '', title: '城里需要一个能说话的人。', text: '枪声停下来以后，桌上只剩一盏灯。军人、士绅、学生都在等一句话，明天这座城该由谁来管。', likes: 69, comments: 17, quote: '推翻旧秩序之后，最难的是让明天开始运转。', role: '在混乱后寻找秩序的人', proximity: '你意识到，改变之后还有更长的路。' },
      { id: 'shopkeeper', person: 'shopkeeper', avatarTone: 'yang', name: '汉口店主', place: '汉口 · 江汉关', time: '10月11日 清晨', avatar: '掌', art: 'art-moon', artLabel: '江汉关 · 清晨', tag: '消息', tagTone: '', title: '今天还开门吗？', text: '船夫说武昌那边变天了。伙计问要不要把招牌收起来，我说先烧水，来问消息的人总要喝茶。', likes: 98, comments: 25, quote: '大变动来到门口，先要解决的还是一壶水。', role: '让日子在新闻里继续的人', proximity: '你看见一座城怎样在枪声后醒来。' },
      { id: 'people', person: 'people', avatarTone: 'people', name: '武昌百姓', place: '武昌 · 城门', time: '10月11日 清晨', avatar: '民', art: 'art-gate', artLabel: '城门 · 清晨', tag: '城门', tagTone: 'red', title: '城门上的告示换了。', text: '有人挤着看字，有人只看旗子。卖早点的摊子比平时早开了一会儿，每个人都想先听到下一句。', likes: 143, comments: 46, quote: '消息落到街上，才真正成为一座城的命运。', role: '在新告示前抬头的人', proximity: '你和人群一起，等一个刚刚开始的明天。' }
    ]
  },
  xuanwumen: {
    label: '626 · 玄武门之变', kicker: '宫门之前', title: '箭响之前<br /><em>一</em>个清晨', intro: '兄弟之间，谁先听见弓弦？', stamp: 'HIST / 626',
    timelines: [['现在', '你在宫门前', 'all'], ['六月初四', '秦王入宫', 'lishimin'], ['辰时', '玄武门响', 'guard'], ['午后', '太子府闭门', 'family']],
    note: '玄武门之变发生于武德九年（626）六月初四，是唐初统治集团内部的一次政变，李世民随后即位。', source: '《旧唐书》·《资治通鉴》卷一百九十一', endingKicker: '626 · 玄武门', endingTitle: '你看到的是一场政变，<br /><em>还是一个家族再也无法同桌吃饭？</em>', endingNote: '王朝从宫门里开始。<br />有些告别，也从同一扇门开始。',
    people: [['lishimin', '李世民', '秦王府 · 玄武门', '世', 'xuanzong'], ['li-jiancheng', '李建成', '东宫 · 承乾殿', '建', 'yang'], ['guard', '玄武门守卫', '北门 · 值守', '卫', 'soldier'], ['family', '秦王府家眷', '秦王府 · 后院', '家', 'dufu'], ['people', '长安百姓', '长安 · 早市', '民', 'people']], posts: [
      { id: 'lishimin', person: 'lishimin', avatarTone: 'xuanzong', name: '李世民', place: '秦王府 · 玄武门', time: '六月初四 卯时', avatar: '世', art: 'art-map', artLabel: '宫城图 · 卯时', tag: '密令', tagTone: 'red', title: '今天要进宫。', text: '佩剑擦了两遍。有人说太子已经知道，有人说还来得及。弓弦绷紧以后，连呼吸都显得多余。', likes: 52, comments: 11, quote: '他把“先下手”写成了唯一的明天。', role: '站在家国与兄弟之间的人', proximity: '你靠近一个决定，但它还没有被说出口。' },
      { id: 'li-jiancheng', person: 'li-jiancheng', avatarTone: 'yang', name: '李建成', place: '东宫 · 承乾殿', time: '六月初四 辰时', avatar: '建', art: 'art-letter', artLabel: '东宫 · 辰时', tag: '未读', tagTone: 'gold', title: '父皇今日还会召见吗？', text: '桌上放着一封没有回音的信。太子妃让人把早膳热着，我说不用等，宫门那边也许很快就有消息。', likes: 71, comments: 16, quote: '最危险的时刻，常常看起来和往常一样。', role: '在未读消息里等待的人', proximity: '你看见一场冲突如何先变成沉默。' },
      { id: 'guard', person: 'guard', avatarTone: 'soldier', name: '玄武门守卫', place: '北门 · 值守', time: '六月初四 辰时', avatar: '卫', art: 'art-gate', artLabel: '玄武门 · 辰时', tag: '值守', tagTone: '', title: '门要不要开？', text: '来的人说奉诏，身后却没有仪仗。手里的弓比往常沉，城里每一声马蹄都像在点名。', likes: 88, comments: 24, quote: '守门的人先遇到历史，也先失去选择。', role: '站在门轴上的无名之人', proximity: '你听见弓弦，不再只听见胜者的名字。' },
      { id: 'family', person: 'family', avatarTone: 'dufu', name: '秦王府家眷', place: '秦王府 · 后院', time: '六月初四 午后', avatar: '家', art: 'art-moon', artLabel: '后院 · 午后', tag: '家书', tagTone: 'gold', title: '院里的马一直没有回来。', text: '小孩子问父亲去了哪里。没有人回答。井边的水还在晃，像刚刚有人匆忙经过。', likes: 103, comments: 29, quote: '政治的余波，先落在家人等不到的午饭上。', role: '替一个王朝等待消息的人', proximity: '你把“政变”重新听成了家里的空椅子。' },
      { id: 'people', person: 'people', avatarTone: 'people', name: '长安百姓', place: '长安 · 早市', time: '六月初四 午后', avatar: '民', art: 'art-user', artLabel: '早市 · 午后', tag: '附近的人', tagTone: 'red', title: '今天的宫门，比平时安静。', text: '卖枣的人说宫里换了主人。买菜的人问，菜价会不会涨。城里的大事，落到手里还是一枚铜钱。', likes: 124, comments: 33, quote: '王朝改名的那天，市场照样要开门。', role: '把大事过成日常的人', proximity: '你看见权力变化如何落到一枚铜钱上。' }
    ]
  }
};

let currentEventId = 'anshi';
let posts = eventCatalog[currentEventId].posts;

const state = {
  activePerson: 'all',
  sort: 'story',
  interactions: 0,
  liked: new Set(),
  saved: new Set(),
  comments: {},
  noteOpen: false,
  soundOn: false,
  reflection: ''
};

const feedList = document.getElementById('feedList');
const toast = document.getElementById('toast');
let toastTimer;

const iconPaths = {
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'volume-2': '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
  'volume-1': '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>',
  'more-horizontal': '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  heart: '<path d="M20.84 8.61a5.5 5.5 0 0 0-7.78-0L12 9.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>',
  'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>',
  bookmark: '<path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  'share-2': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'pen-line': '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  'lock-keyhole': '<circle cx="12" cy="16" r="1"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>'
};

function createLocalIcons(root = document) {
  root.querySelectorAll('i[data-lucide]').forEach((element) => {
    const name = element.dataset.lucide;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', name === 'heart' ? 'none' : 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = iconPaths[name] || iconPaths.plus;
    element.replaceWith(svg);
  });
}

window.lucide = { createIcons: createLocalIcons };

function activeEvent() { return eventCatalog[currentEventId]; }

function renderPeople() {
  const peopleList = document.getElementById('peopleList');
  const people = activeEvent().people;
  peopleList.innerHTML = `
    <button class="person-filter is-active" type="button" data-person="all">
      <span class="mini-portrait all-portrait">众</span><span><b>所有人的现场</b><small>混合视角</small></span>${icon('arrow-up-right')}
    </button>
    ${people.map(([id, name, place, avatar, tone]) => `<button class="person-filter" type="button" data-person="${id}"><span class="mini-portrait ${tone}-portrait">${avatar}</span><span><b>${name}</b><small>${place}</small></span></button>`).join('')}`;
  document.getElementById('profileCount').textContent = String(people.length).padStart(2, '0');
}

function renderTimeline() {
  document.getElementById('timeline').innerHTML = activeEvent().timelines.map(([date, label, target], index) => `
    <button class="timeline-item ${index === 0 ? 'is-active' : ''}" type="button" data-jump="${target}">
      <span class="timeline-dot"></span><span class="timeline-copy"><b>${date}</b><small>${label}</small></span>
    </button>`).join('');
}

function renderEventMenu() {
  document.getElementById('eventMenu').innerHTML = Object.entries(eventCatalog).map(([id, event]) => `<button class="event-option ${id === currentEventId ? 'is-active' : ''}" type="button" data-event="${id}"><b>${event.label}</b><small>${event.intro}</small></button>`).join('');
}

function resetInteractionState() {
  state.activePerson = 'all'; state.sort = 'story'; state.interactions = 0; state.liked.clear(); state.saved.clear(); state.comments = {}; state.reflection = '';
}

function applyEvent(eventId, announce = true) {
  if (!eventCatalog[eventId]) return;
  currentEventId = eventId;
  posts = eventCatalog[currentEventId].posts;
  resetInteractionState();
  const event = activeEvent();
  document.getElementById('eventLabel').textContent = event.label;
  document.getElementById('eventKicker').textContent = event.kicker;
  document.getElementById('eventTitle').innerHTML = event.title;
  document.querySelector('.archive-stamp').textContent = event.stamp;
  document.getElementById('feedIntro').textContent = event.intro;
  document.getElementById('noteText').textContent = event.note;
  document.getElementById('sourceChip').textContent = event.source;
  document.getElementById('endingKicker').textContent = event.endingKicker;
  document.getElementById('endingTitle').innerHTML = event.endingTitle;
  document.getElementById('endingNote').innerHTML = event.endingNote;
  renderPeople(); renderTimeline(); renderEventMenu(); renderFeed();
  if (announce) showToast(`已切换到 ${event.label}`);
}

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function getVisiblePosts() {
  const ordered = state.sort === 'chronicle' ? [...posts].sort((a, b) => a.time.localeCompare(b.time, 'zh-CN')) : posts;
  return ordered;
}

function renderFeed() {
  const visible = getVisiblePosts();
  const active = state.activePerson;
  feedList.innerHTML = visible.map((post, index) => {
    const isActive = active === 'all' || active === post.person || post.person === 'you';
    const liked = state.liked.has(post.id);
    const saved = state.saved.has(post.id);
    const commentCount = post.comments + (state.comments[post.id]?.length || 0);
    return `
      <article class="post-card ${isActive ? '' : 'is-dimmed'} ${index === 0 && active === 'all' ? 'is-featured' : ''}" data-id="${post.id}">
        <div class="post-top">
          <span class="post-avatar ${post.avatarTone || post.person}">${post.avatar}</span>
          <div class="post-author"><b>${post.name}</b><span>${post.place} · ${post.time}</span></div>
          <button class="post-menu" type="button" aria-label="更多选项" title="更多选项">${icon('more-horizontal')}</button>
        </div>
        <div class="post-body"><h2>${post.title}</h2><p>${post.text}</p><div class="post-meta"><span class="tag ${post.tagTone}">${post.tag}</span><span>${post.quote}</span></div></div>
        <div class="post-art ${post.art}"><span class="art-label">${post.artLabel}</span></div>
        <div class="post-actions">
          <button class="action-button like-button ${liked ? 'is-liked' : ''}" type="button" data-action="like" aria-label="${liked ? '取消点赞' : '点赞'}" title="${liked ? '取消点赞' : '点赞'}">${icon('heart')}<span class="action-count">${post.likes + (liked ? 1 : 0)}</span></button>
          <button class="action-button comment-button" type="button" data-action="comment" aria-label="评论" title="评论">${icon('message-circle')}<span class="action-count">${commentCount}</span></button>
          <span class="action-spacer"></span>
          <button class="action-button save-button ${saved ? 'is-saved' : ''}" type="button" data-action="save" aria-label="${saved ? '取消收藏' : '收藏'}" title="${saved ? '取消收藏' : '收藏'}">${icon('bookmark')}</button>
          <button class="action-button share-button" type="button" data-action="share" aria-label="分享" title="分享">${icon('share-2')}</button>
        </div>
        <div class="comment-box" data-comment-box><input class="comment-input" data-comment-input maxlength="60" placeholder="写一句给${post.name}的话..." /><button class="comment-submit" type="button" data-action="submit-comment" aria-label="发布评论" title="发布评论">${icon('send')}</button></div>
      </article>`;
  }).join('');
  if (window.lucide) window.lucide.createIcons();
  updateSummary();
}

function activePost() {
  return posts.find((post) => post.person === state.activePerson) || posts.find((post) => post.id === 'people');
}

function updateSummary() {
  const likedCount = state.liked.size;
  const commentCount = Object.values(state.comments).reduce((sum, values) => sum + values.length, 0);
  const intensity = Math.min(94, 12 + likedCount * 11 + commentCount * 8);
  const person = activePost();
  const profile = state.activePerson === 'all' ? {
    avatar: '众', name: '所有人的现场', role: '当你不选边，城市替你承受', copy: likedCount ? '你开始在不同命运之间来回折返。再往下，信息会变得更私人。' : '你刚刚路过五种人生。继续滑，看看哪一句会留下来。'
  } : { avatar: person.avatar, name: person.name, role: person.role, copy: person.proximity };
  document.getElementById('proximityPortrait').textContent = profile.avatar;
  document.getElementById('proximityPortrait').className = `proximity-portrait ${state.activePerson === 'all' ? 'all-portrait' : `${person.avatarTone || person.person}-portrait`}`;
  document.getElementById('proximityName').textContent = profile.name;
  document.getElementById('proximityRole').textContent = profile.role;
  document.getElementById('proximityCopy').textContent = profile.copy;
  document.getElementById('proximityTemp').textContent = `${intensity}°`;
  document.getElementById('proximityTempFill').style.width = `${intensity}%`;
  document.getElementById('signalMeterFill').style.width = `${intensity}%`;
  document.getElementById('signalValue').textContent = `${intensity}°`;
  const signalTitle = document.getElementById('signalTitle');
  const signalText = document.getElementById('signalText');
  if (intensity > 70) { signalTitle.textContent = '长安 · 火光近了'; signalText.textContent = '你的轨迹已经偏向具体的人，故事不再只是远景。'; }
  else if (intensity > 35) { signalTitle.textContent = '长安 · 人声变近'; signalText.textContent = '你留下的动作被记住了，下一条动态会更靠近生活。'; }
  else { signalTitle.textContent = '长安 · 风声变了'; signalText.textContent = '你还没有选边，先听每个人说完。'; }
  document.getElementById('trajectoryCount').textContent = `${state.interactions} 次互动`;
  const trajectoryLine = document.getElementById('trajectoryLine');
  if (!state.interactions) trajectoryLine.innerHTML = '<span class="trajectory-empty">点一个赞，轨迹就会出现。</span>';
  else {
    const points = [...state.liked].slice(-5).map((id) => { const p = posts.find((item) => item.id === id); return `<span class="trajectory-point" title="${p.name}">${p.avatar}</span>`; }).join('');
    trajectoryLine.innerHTML = points;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function showShareText(text) {
  const shareText = String(text).replace(/<[^>]+>/g, '');
  showToast(`分享文案：${shareText}。请长按这条提示复制。`);
}

function handleAction(button) {
  const card = button.closest('.post-card');
  const id = card.dataset.id;
  const post = posts.find((item) => item.id === id);
  const action = button.dataset.action;
  if (action === 'like') {
    if (state.liked.has(id)) { state.liked.delete(id); state.interactions = Math.max(0, state.interactions - 1); showToast('已收回这个心意'); }
    else { state.liked.add(id); state.interactions += 1; showToast(`你在${post.name}的动态下留下了一个心`); }
    renderFeed();
  }
  if (action === 'save') {
    if (state.saved.has(id)) { state.saved.delete(id); showToast('已取消收藏'); }
    else { state.saved.add(id); state.interactions += 1; showToast('这条动态会留在你的档案里'); }
    renderFeed();
  }
  if (action === 'share') {
    state.interactions += 1;
    showShareText(`古人朋友圈 · ${post.name}：${post.title}`);
    updateSummary();
  }
  if (action === 'comment') {
    const box = card.querySelector('[data-comment-box]');
    box.classList.toggle('is-open');
    if (box.classList.contains('is-open')) card.querySelector('[data-comment-input]').focus();
  }
  if (action === 'submit-comment') {
    const input = card.querySelector('[data-comment-input]');
    const value = input.value.trim();
    if (!value) return;
    state.comments[id] = [...(state.comments[id] || []), value];
    state.interactions += 1;
    showToast('评论落在了这条时间线上');
    renderFeed();
  }
}

document.addEventListener('click', (event) => {
  if (event.target.closest('.dialog-close')) {
    document.getElementById('reflectionDialog').close();
    return;
  }
  const eventOption = event.target.closest('[data-event]');
  if (eventOption) {
    applyEvent(eventOption.dataset.event);
    document.getElementById('eventMenu').classList.remove('is-open');
    document.getElementById('eventButton').setAttribute('aria-expanded', 'false');
    return;
  }
  if (event.target.closest('#eventButton')) {
    const menu = document.getElementById('eventMenu');
    const open = menu.classList.toggle('is-open');
    document.getElementById('eventButton').setAttribute('aria-expanded', String(open));
    return;
  }
  if (!event.target.closest('.event-switcher')) {
    document.getElementById('eventMenu').classList.remove('is-open');
    document.getElementById('eventButton').setAttribute('aria-expanded', 'false');
  }
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) handleAction(actionButton);
  const personButton = event.target.closest('[data-person]');
  if (personButton) {
    state.activePerson = personButton.dataset.person;
    document.querySelectorAll('.person-filter').forEach((button) => button.classList.toggle('is-active', button === personButton));
    document.getElementById('feedIntro').textContent = state.activePerson === 'all' ? '五个身份，一次失控的夜晚' : `${activePost().name}的时间线，正在靠近`;
    renderFeed();
  }
  const sortButton = event.target.closest('[data-sort]');
  if (sortButton) {
    state.sort = sortButton.dataset.sort;
    document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('is-active', button === sortButton));
    showToast(state.sort === 'chronicle' ? '史料层已展开，按时间排列' : '故事流已恢复');
    renderFeed();
  }
  const jumpButton = event.target.closest('[data-jump]');
  if (jumpButton) {
    const target = document.querySelector(`[data-person="${jumpButton.dataset.jump}"]`);
    target?.click();
    document.querySelectorAll('.timeline-item').forEach((button) => button.classList.toggle('is-active', button === jumpButton));
    document.querySelector('.feed-column')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (event.target.closest('#noteToggle')) {
    state.noteOpen = !state.noteOpen;
    document.getElementById('noteBody').classList.toggle('is-open', state.noteOpen);
    document.getElementById('noteToggle').innerHTML = icon(state.noteOpen ? 'minus' : 'plus');
    if (window.lucide) window.lucide.createIcons();
  }
  if (event.target.closest('#soundButton')) {
    state.soundOn = !state.soundOn;
    const soundButton = document.getElementById('soundButton');
    soundButton.innerHTML = icon(state.soundOn ? 'volume-1' : 'volume-2');
    if (window.lucide) window.lucide.createIcons();
    showToast(state.soundOn ? '环境音开启，想象城门外的风' : '环境音已关闭');
  }
  if (event.target.closest('#resetButton')) {
    resetInteractionState();
    document.querySelectorAll('.person-filter').forEach((button) => button.classList.toggle('is-active', button.dataset.person === 'all'));
    document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('is-active', button.dataset.sort === 'story'));
    document.querySelectorAll('.timeline-item').forEach((button, index) => button.classList.toggle('is-active', index === 0));
    document.getElementById('feedIntro').textContent = activeEvent().intro;
    renderFeed(); showToast('时间线已重置');
  }
  if (event.target.closest('#shareEndingButton')) { state.interactions += 1; updateSummary(); showShareText(activeEvent().endingTitle); }
  if (event.target.closest('#reflectionButton')) document.getElementById('reflectionDialog').showModal();
});

document.getElementById('reflectionInput').addEventListener('input', (event) => { document.getElementById('reflectionCount').textContent = `${event.target.value.length} / 120`; });
document.getElementById('reflectionForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('reflectionInput');
  const value = input.value.trim();
  if (!value) return;
  state.reflection = value;
  state.interactions += 1;
  showToast('你的这一刻，已经进入时间线');
  input.value = ''; document.getElementById('reflectionCount').textContent = '0 / 120';
  document.getElementById('reflectionDialog').close();
  updateSummary();
});

applyEvent(currentEventId, false);
