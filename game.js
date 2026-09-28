(() => {
  'use strict';

  const HERO_NAMES = [
    '异界义勇·洛恩','黄巾兵','天公将军·张角','闭月·貂蝉','飞将·吕布','昭烈·刘备',
    '武圣·关羽','翼德·张飞','常山·赵云','锦马超','老将·黄忠','魏武·曹操',
    '吴王·孙权','魔·诸葛亮','虎豹骑统领','江东都督·周瑜','黄巾力士','魔军先锋',
    '陷阵营·高顺','黄巾弓兵',
    '风痕剑士·岚','炎拳学徒·绯奈','沧枪骑士·澪','岩盾守护·戈恩','雷弦射手·凯尔',
    '冰面刺客·雪罗','炎刃武士·赤城','森灵召唤师·芙萝','虚空皇帝·塞恩','蚀星龙后·阿斯特拉'
  ];
  const ROLE_NAMES = ['守卫','战士','射手','法师','牧师','矿工','盗贼','武僧','女巫','机械师'];
  const SKILLS = ['破阵盾击','无双重斩','贯风连矢','霜星坠落','回春圣辉','探脉重击','影袭绝杀','震地掌','月蚀咒','军械超载'];
  const SKILL_DATA = [
    {type:'normal',typeName:'普通型',chance:.32,mult:1.35,armorBreak:8,evade:true},
    {type:'crit',typeName:'暴击型',chance:.24,mult:1.25,executeAt:.30,executeBonus:1.20,evade:false},
    {type:'normal',typeName:'普通型',chance:.36,mult:1.30,defensePierce:.20,evade:true},
    {type:'pure',typeName:'纯粹型',chance:.24,mult:.38,slow:6,evade:false},
    {type:'percent',typeName:'百分比型',chance:.22,percent:.26,heal:.04,evade:true},
    {type:'normal',typeName:'普通型',chance:.30,mult:1.40,bossBonus:1.20,evade:true},
    {type:'crit',typeName:'暴击型',chance:.28,mult:1.15,executeAt:.35,executeBonus:1.25,evade:false},
    {type:'pure',typeName:'纯粹型',chance:.22,mult:.42,kingSteal:2,evade:false},
    {type:'percent',typeName:'百分比型',chance:.20,percent:.36,evade:true},
    {type:'normal',typeName:'普通型',chance:.34,mult:1.25,speedBuff:5,evade:true}
  ];
  const HERO_SKILL_OVERRIDES = {
    h00:{name:'异界守誓',type:'normal',typeName:'普通型',chance:.32,mult:1.28,armorBreak:6,evade:true},
    h01:{name:'黄巾突刺',type:'normal',typeName:'普通型',chance:.30,mult:1.22,armorBreak:4,evade:true},
    h02:{name:'太平雷法',type:'pure',typeName:'纯粹型',chance:.22,mult:.34,slow:7,evade:false},
    h03:{name:'闭月离魂',type:'percent',typeName:'百分比型',chance:.20,percent:.28,slow:5,evade:true},
    h04:{name:'天下无双',type:'crit',typeName:'暴击型',chance:.25,mult:1.32,executeAt:.35,executeBonus:1.22,evade:false},
    h05:{name:'仁德昭烈',type:'percent',typeName:'百分比型',chance:.22,percent:.24,heal:.06,evade:true},
    h06:{name:'青龙偃月',type:'crit',typeName:'暴击型',chance:.24,mult:1.24,defensePierce:.22,evade:false},
    h07:{name:'燕人咆哮',type:'pure',typeName:'纯粹型',chance:.22,mult:.40,armorBreak:10,evade:false},
    h08:{name:'龙胆七探',type:'crit',typeName:'暴击型',chance:.26,mult:1.16,speedBuff:7,evade:false},
    h09:{name:'西凉铁骑',type:'normal',typeName:'普通型',chance:.32,mult:1.34,defensePierce:.18,evade:true},
    h10:{name:'百步穿杨',type:'crit',typeName:'暴击型',chance:.27,mult:1.14,executeAt:.30,executeBonus:1.25,evade:false},
    h11:{name:'魏武号令',type:'normal',typeName:'普通型',chance:.30,mult:1.30,speedBuff:6,evade:true},
    h12:{name:'江东制衡',type:'percent',typeName:'百分比型',chance:.21,percent:.27,heal:.035,evade:true},
    h13:{name:'八阵魔星',type:'pure',typeName:'纯粹型',chance:.24,mult:.38,slow:8,evade:false},
    h14:{name:'虎豹突阵',type:'normal',typeName:'普通型',chance:.33,mult:1.36,armorBreak:7,evade:true},
    h15:{name:'赤壁业火',type:'percent',typeName:'百分比型',chance:.22,percent:.30,defensePierce:.15,evade:true},
    h16:{name:'黄天蛮力',type:'pure',typeName:'纯粹型',chance:.21,mult:.39,armorBreak:8,evade:false},
    h17:{name:'魔军血刃',type:'crit',typeName:'暴击型',chance:.25,mult:1.20,executeAt:.35,executeBonus:1.23,evade:false},
    h18:{name:'陷阵之志',type:'normal',typeName:'普通型',chance:.31,mult:1.32,bossBonus:1.18,evade:true},
    h19:{name:'黄巾箭雨',type:'normal',typeName:'普通型',chance:.34,mult:1.26,defensePierce:.16,evade:true}
  };
  const BONDS = [
    {id:'taoyuan',name:'桃园结义',members:['h05','h06','h07'],bonus:.12,description:'刘备、关羽、张飞同阵，全队战力 +12%。',combo:{name:'义贯山河',chance:.16,type:'pure',typeName:'连携·纯粹',mult:.66,heal:.04,evade:false}},
    {id:'fengyi',name:'凤仪无双',members:['h03','h04'],bonus:.09,description:'吕布、貂蝉同阵，全队战力 +9%。',combo:{name:'月下无双',chance:.15,type:'crit',typeName:'连携·暴击',mult:1.30,slow:6,evade:false}},
    {id:'wuhu',name:'五虎上将',members:['h06','h07','h08','h09','h10'],bonus:.15,description:'五虎上将同阵，全队战力 +15%。'},
    {id:'sanding',name:'三分天下',members:['h05','h11','h12'],bonus:.08,description:'刘备、曹操、孙权同阵，全队战力 +8%。'},
    {id:'jiangdong',name:'江东烽火',members:['h12','h15'],bonus:.07,description:'孙权、周瑜同阵，全队战力 +7%。'},
    {id:'huangjin',name:'黄天当立',members:['h01','h02','h16','h19'],bonus:.08,description:'张角与黄巾军同阵，全队战力 +8%。'}
  ];
  const HERO_GRADES = [0,0,2,2,3,3,3,3,2,2,2,3,3,4,2,2,1,2,2,0,0,1,1,2,2,2,3,3,4,5];
  const HERO_ROLES = [0,1,8,8,1,0,1,7,0,0,2,0,0,3,0,3,7,0,0,2,1,7,0,0,2,6,1,8,3,3];
  const GRADE_NAMES = ['普通','稀有','史诗','传说','暗金','闪金'];
  const GRADE_CLASSES = ['common','rare','epic','legendary','darkgold','shiny'];
  const SAVE_KEY = 'ember_delvers_v3_sanguo';
  const REDEEM_CODES = {
    PIXEL9999999:{gems:9999999,label:'像素远征特别补给'},
    EXP9999999999:{exp:9999999999,label:'穿越者经验补给'}
  };
  const STONE_PRICE = 500;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const today = () => new Date().toISOString().slice(0,10);
  const short = n => n >= 1e9 ? `${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `${(n/1e3).toFixed(2)}K` : Math.floor(n).toString();
  const heroId = i => `h${String(i).padStart(2,'0')}`;
  const heroIndex = id => Number(id.slice(1));
  const spriteStyle = id => {
    const i=heroIndex(id),atlas=i<10?'pixel-heroes-a.png':i<20?'pixel-heroes-b.png':'pixel-heroes-c.png',cell=i%10,col=cell%5,row=Math.floor(cell/5);
    return `background-image:url('assets/${atlas}');background-size:500% 200%;background-position:${col*25}% ${row*100}%`;
  };
  const grade = i => HERO_GRADES[i]??0;
  const gradeFactor = i => 1+grade(i)*.2;
  const roleIndex = i => HERO_ROLES[i]??(i%10);
  const levelExpCostAt = (id,level) => Math.ceil(8*Math.pow(level,1.55)*(1+grade(heroIndex(id))*.25));
  const levelExpCost = id => levelExpCostAt(id,state.heroes[id].level);
  const levelBatchCost = (id,count) => Array.from({length:count},(_,step)=>levelExpCostAt(id,state.heroes[id].level+step)).reduce((sum,cost)=>sum+cost,0);
  const clearedStages = () => Math.max(0,Math.min(20,state.stage-1));
  const stageLabel = stage => `${stage<=10?1:2}-${stage<=10?stage:Math.min(10,stage-10)}`;
  const goldPerSecond = () => 2*Math.pow(1.05,clearedStages());
  const expPerSecond = () => 3.3*Math.pow(1.07,clearedStages());
  const STAGES = [
    {name:'乱世初啼',enemy:'黄巾兵 Lv.1',story:'魔王的裂隙将你送入东汉末年。村口只剩一名黄巾兵把守，露米让你用这场战斗熟悉异世界的规则。',scale:.8,enemies:[['h01',1]],pool:['h01']},
    {name:'黄巾哨岗',enemy:'黄巾兵 Lv.1 ×2',story:'山道上的哨岗亮起两支火把。黄巾军已经察觉你的到来，必须在他们报信前击破防线。',scale:.65,enemies:[['h01',1],['h19',1]],pool:['h19']},
    {name:'苍天已死',enemy:'张角 Lv.3 + 黄巾兵 ×2',story:'雷云聚向祭坛，张角高举符水，黄巾兵在妖术下悍不畏死。击败他，才有资格踏入群雄角逐的乱世。',scale:.58,enemies:[['h02',3],['h01',1],['h01',1]],pool:['h02']},
    {name:'月下离歌',enemy:'貂蝉 Lv.10',story:'月色下的舞姬挡住去路。貂蝉并非甘愿效忠魔王，她要亲自确认你是否拥有改变乱世的力量。',scale:1.6,enemies:[['h03',10]],pool:['h03']},
    {name:'辕门无双',enemy:'吕布、貂蝉 Lv.10',story:'赤兔踏碎石阶，吕布持戟立于辕门，貂蝉随侍一侧。这一次，计谋与武力将同时向你袭来。',scale:1,enemies:[['h04',10],['h03',10]],pool:['h04']},
    {name:'桃园之誓',enemy:'刘备、关羽、张飞 Lv.15',story:'刘关张受魔气蒙蔽，却仍保持着牢不可破的阵势。只有正面击败三人的合击，才能唤回桃园誓言。',scale:.74,enemies:[['h05',15],['h06',15],['h07',15]],pool:['h05','h06','h07']},
    {name:'五虎断关',enemy:'五虎上将 Lv.20',story:'五道将星封锁峡谷。关羽、张飞、赵云、马超、黄忠各守一方，阵法会把任何冒进者撕碎。',scale:.58,enemies:[['h06',20],['h07',20],['h08',20],['h09',20],['h10',20]],pool:['h08','h09','h10']},
    {name:'三分天下',enemy:'曹操、孙权、刘备 Lv.30',story:'魏、蜀、吴三面王旗同时升起。曹操、孙权与刘备暂时联手，只为阻止不属于这个时代的穿越者。',scale:.8,enemies:[['h11',30],['h12',30],['h05',30]],pool:['h11','h12']},
    {name:'群英魔阵',enemy:'全部精英 Lv.50',story:'魔王收拢了乱世中最危险的精英：虎豹骑、江东都督、黄巾力士、魔军先锋与陷阵营。前方已没有退路。',scale:.5,enemies:[['h14',50],['h15',50],['h16',50],['h17',50],['h18',50]],pool:['h14','h15','h16','h17','h18']},
    {chapter:1,local:10,boss:true,name:'八阵魔星',enemy:'魔·诸葛亮 Lv.100',story:'八阵图覆盖苍穹，魔诸葛亮在王座前睁开猩红双眼：“变量终于抵达。让我看看，你能否走出这座由命运构成的城。”',scale:1.45,enemies:[['h13',100]],pool:['h13']},
    {chapter:2,local:1,name:'风之刻印',enemy:'风痕剑士·岚 Lv.100',story:'八阵图破碎后，新的次元门在天空开启。露米将这个拥有完整灵纹等级体系的世界称为“苍穹刻印”。最弱的风之学徒，也拥有跨越百级的力量。',scale:3.52,enemies:[['h20',100]],pool:['h20']},
    {chapter:2,local:2,name:'炎拳入学祭',enemy:'岚、绯奈 Lv.100',story:'赤红擂台上，炎拳学徒绯奈向岚发起联手邀请。五大灵纹学院不会承认没有刻印的异界来客。',scale:2.31,enemies:[['h20',100],['h21',100]],pool:['h21']},
    {chapter:2,local:3,name:'沧海枪阵',enemy:'澪 Lv.110 + 两名学徒',story:'水之骑士澪展开三重枪阵。流水会记录每次攻击，并在第三回合以浪潮全部返还。',scale:2.11,enemies:[['h22',110],['h20',100],['h21',100]],pool:['h22']},
    {chapter:2,local:4,name:'大地誓垒',enemy:'岩盾守护·戈恩 Lv.130',story:'通往上层浮岛的桥梁被巨盾封死。戈恩的地脉刻印让他独自拥有一整支军团般的战力。',scale:6.14,enemies:[['h23',130]],pool:['h23']},
    {chapter:2,local:5,name:'雷鸣天塔',enemy:'凯尔、戈恩 Lv.140',story:'雷弦射手凯尔占据天塔制高点，戈恩守住唯一入口。远近协同的刻印组合开始展现这个世界真正的战斗体系。',scale:4.15,enemies:[['h24',140],['h23',140]],pool:['h24']},
    {chapter:2,local:6,name:'冰晶试炼',enemy:'雪罗与三系学徒 Lv.160',story:'冰面刺客雪罗没有留下脚印。只有同时破解风、火、水三道残影，才能逼出她的真实位置。',scale:3.20,enemies:[['h25',160],['h20',150],['h21',150],['h22',150]],pool:['h25']},
    {chapter:2,local:7,name:'炎刃天门',enemy:'赤城、雪罗 Lv.180',story:'炎刃武士赤城守在天门中央，极热刀锋与雪罗的极寒暗杀形成了无法靠单一属性破解的领域。',scale:6.52,enemies:[['h26',180],['h25',170]],pool:['h26']},
    {chapter:2,local:8,name:'森灵圣域',enemy:'芙萝与冰炎双卫 Lv.200',story:'世界树拒绝继续为战争提供灵力。召唤师芙萝唤醒远古森灵，要判断你究竟是救世者，还是新的掠夺者。',scale:5.80,enemies:[['h27',200],['h25',180],['h26',180]],pool:['h27']},
    {chapter:2,local:9,name:'虚空王庭',enemy:'虚空皇帝塞恩与全部精英 Lv.250',story:'塞恩吞噬五系灵纹，将历代精英的投影召入王庭。每种属性都将遭遇自己的克制者。',scale:4.14,enemies:[['h28',250],['h24',220],['h25',220],['h26',220],['h27',220]],pool:['h28']},
    {chapter:2,local:10,boss:true,name:'蚀星龙座',enemy:'蚀星龙后·阿斯特拉 Lv.350',story:'星空在龙翼下熄灭。阿斯特拉是五大灵纹的源头，也是魔王试图夺取的第二枚世界核心。',scale:15.15,enemies:[['h29',350]],pool:['h29']}
  ];

  function baseStats(i){
    const role=roleIndex(i);
    const table=[
      [92,178,83,40],[142,105,46,61],[136,82,55,91],[159,72,48,84],[88,96,67,76],
      [105,116,62,52],[148,76,49,104],[121,125,60,71],[151,74,53,88],[132,91,58,73]
    ][role];
    return {atk:table[0],def:table[1],dodge:table[2],speed:table[3],king:4+(i%4)};
  }
  function socketBonus(p){return (p.gemSockets||[]).reduce((sum,tier)=>sum+({1:.02,2:.05,3:.09}[tier]||0),0)}
  function heroStats(id,levelOverride=null){
    const i=heroIndex(id), p=state.heroes[id], b=baseStats(i),enemy=levelOverride!==null,level=enemy?levelOverride:p.level;
    const breakthroughMult=1+(enemy?0:p.breakthrough)*.07,equipmentMult=1+(enemy?0:p.equipmentLevel)*.03,gemMult=1+(enemy?0:socketBonus(p));
    const mult=(1+(level-1)*.055)*gradeFactor(i)*breakthroughMult*equipmentMult*gemMult;
    const kingMult=breakthroughMult*equipmentMult*gemMult,king=Math.round((b.king+grade(i)*2)*.1*kingMult*10)/10;
    return {atk:Math.round(b.atk*mult),def:Math.round(b.def*mult),dodge:Math.round(b.dodge*mult),speed:Math.round(b.speed*mult),king,power:Math.round((b.atk*2.2+b.def*1.25+b.dodge+b.speed)*mult*8)};
  }
  function skillFor(id){
    const i=heroIndex(id),base=HERO_SKILL_OVERRIDES[id]||SKILL_DATA[roleIndex(i)],factor=gradeFactor(i);
    return Object.assign({},base,{
      chance:base.chance,mult:base.mult?base.mult*factor:undefined,percent:base.percent?base.percent*factor:undefined,
      armorBreak:base.armorBreak?base.armorBreak*factor:undefined,slow:base.slow?base.slow*factor:undefined,heal:base.heal?base.heal*factor:undefined,
      defensePierce:base.defensePierce?Math.min(.65,base.defensePierce*factor):undefined,speedBuff:base.speedBuff?base.speedBuff*factor:undefined,
      kingSteal:base.kingSteal?base.kingSteal*factor:undefined,bossBonus:base.bossBonus?1+(base.bossBonus-1)*factor:undefined,
      executeBonus:base.executeBonus?1+(base.executeBonus-1)*factor:undefined
    });
  }
  function skillName(id){return HERO_SKILL_OVERRIDES[id]?.name||SKILLS[roleIndex(heroIndex(id))]}
  function entryIds(entries){return entries.map(entry=>typeof entry==='string'?entry:Array.isArray(entry)?entry[0]:entry.id)}
  function activeBonds(entries){const ids=new Set(entryIds(entries));return BONDS.filter(bond=>bond.members.every(id=>ids.has(id)))}
  function bondMultiplier(entries){return 1+activeBonds(entries).reduce((sum,bond)=>sum+bond.bonus,0)}
  function totalHeroLevels(){return Object.values(state.heroes).filter(h=>h.unlocked).reduce((sum,h)=>sum+h.level,0)}
  function slotThreshold(slot){
    if(slot<=1)return 0;if(slot===2)return 10;
    return Math.round(10*Math.pow(slot-1,Math.log(1000)/Math.log(24)));
  }
  function unlockedSlots(){
    const total=totalHeroLevels();let slots=1;
    for(let slot=2;slot<=25;slot++)if(total>=slotThreshold(slot))slots=slot;
    return slots;
  }
  function nextSlotThreshold(){const slots=unlockedSlots();return slots>=25?null:slotThreshold(slots+1)}
  function newState(){
    const heroes={};
    for(let i=0;i<HERO_GRADES.length;i++) heroes[heroId(i)]={unlocked:i===0,level:1,breakthrough:0,fragments:0,equipmentLevel:0,gemSockets:[]};
    return {
      version:4,gold:5000,exp:0,gems:30,ore:0,enhanceStones:0,socketGems:{1:0,2:0,3:0},stage:1,wins:0,poolUnlocked:['h00'],
      heroes,formation:['h00'],selected:'h00',tutorialStep:0,
      mine:{level:1,durability:30,maxDurability:30,bombs:3,seed:42,revealed:[4],player:4,job:null,depth:1,floorOffset:0,lastDurabilityAt:Date.now(),guardDepth:null,guardDefeatedDepths:[]},
      bonusDate:'',redeemedCodes:[],lastSeen:Date.now()
    };
  }
  function load(){
    try{
      const saved=JSON.parse(localStorage.getItem(SAVE_KEY));if(!saved||saved.version!==4)return newState();const base=newState(),heroes={};
      for(let i=0;i<HERO_GRADES.length;i++){const id=heroId(i);heroes[id]=Object.assign({},base.heroes[id],saved.heroes?.[id]||{});if(!Array.isArray(heroes[id].gemSockets))heroes[id].gemSockets=[]}
      const loaded=Object.assign(base,saved,{socketGems:Object.assign(base.socketGems,saved.socketGems||{}),mine:Object.assign(base.mine,saved.mine||{}),heroes});if(!Array.isArray(loaded.redeemedCodes))loaded.redeemedCodes=[];return loaded;
    }catch{return newState()}
  }
  let state=load(), activeTab='home', battle=null, battleTimer=null, mineTimer=null, toastTimer=null, saveTimer=null, adventureTimer=null, idleTicks=0;
  let adventureMode='map',selectedChapter=state.stage>10?2:1,selectedStage=state.stage>10?Math.min(state.stage,20):Math.min(state.stage,10);

  function save(){state.lastSeen=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));updateTop()}
  function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,100)}
  function formationPower(){return Math.round(state.formation.reduce((sum,id)=>sum+heroStats(id).power,0)*bondMultiplier(state.formation))}
  function updateTop(){
    $('#powerValue').textContent=short(formationPower());$('#expValue').textContent=short(state.exp);$('#goldValue').textContent=short(state.gold);$('#gemValue').textContent=short(state.gems);
  }
  function processOffline(){
    const seconds=clamp((Date.now()-(state.lastSeen||Date.now()))/1000,0,8*3600);if(seconds<30)return null;
    const gold=Math.floor(seconds*goldPerSecond()),exp=Math.floor(seconds*expPerSecond());state.gold+=gold;state.exp+=exp;recoverDurability();
    return{gold,exp,minutes:Math.floor(seconds/60)};
  }
  function navigate(tab){
    if(battle?.running&&tab!=='battle'){toast('战斗尚未结束');return}
    activeTab=tab;$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));render();
  }
  function render(){
    const screen=$('#screen');
    screen.innerHTML={home:homeView,battle:battleView,mine:mineView,arena:arenaView,summon:summonView,heroes:heroesView}[activeTab]();
    bindView();updateTop();
  }
  function heroSprite(id, cls=''){return `<div class="hero-sprite drawn-portrait ${cls}" style="${spriteStyle(id)}"></div>`}

  function homeView(){
    const party=state.formation.slice(0,3);
    return `<div class="page home-page"><section class="home-scene"><div class="home-logo pixel-title">余烬矿团<small>EMBER DELVERS</small></div><div class="home-menu">
      <button data-go="summon"><i>✦</i>召唤</button><button data-go="heroes"><i>♟</i>编队</button><button data-go="battle"><i>⚔</i>远征</button><button data-go="mine"><i>⛏</i>矿井</button><button id="shopButton"><i>◆</i>商店</button><button data-go="arena"><i>♜</i>排行</button><button id="saveInfo"><i>▣</i>存档</button>
      </div><div class="camp-party">${party.map(id=>heroSprite(id)).join('')}</div></section>
      <section class="home-cards"><button class="home-card" data-go="battle"><i>⚔</i><span><b>${state.stage>10?'苍穹刻印':'魔临三国'} ${stageLabel(Math.min(state.stage,20))}</b><small>${goldPerSecond().toFixed(1)} 金 / ${expPerSecond().toFixed(1)} EXP 每秒</small></span></button><button class="home-card" data-go="mine"><i>⛏</i><span><b>矿井深度 ${state.mine.depth}</b><small>耐久 ${state.mine.durability}/${state.mine.maxDurability} · 强化石 ${state.enhanceStones}</small></span></button><button class="home-card" data-go="heroes"><i>♟</i><span><b>${state.formation.length}/${unlockedSlots()} 上阵 · 羁绊 ${activeBonds(state.formation).length}</b><small>英雄总等级 ${totalHeroLevels()} · 总战力 ${short(formationPower())}</small></span></button><button class="home-card" data-go="summon"><i>♦</i><span><b>异界召唤台</b><small>卡池 ${state.poolUnlocked.length} · 已获得 ${unlockedCount()}</small></span></button></section></div>`;
  }
  function combatStatsForPower(power,king=0){
    const root=Math.sqrt(Math.max(1,power));return {def:Math.round(20+root*1.15),dodge:Math.round(15+root*.62),speed:Math.round(20+root*.80),king:Math.round(king*10)/10,power:Math.round(power)};
  }
  function teamStats(entries, powerScale=1){
    const total=entries.reduce((a,entry)=>{const id=typeof entry==='string'?entry:entry.id,level=typeof entry==='string'?null:entry.level,s=heroStats(id,level);a.king+=s.king;a.power+=s.power;return a},{king:0,power:0});
    return combatStatsForPower(total.power*powerScale,total.king);
  }
  function battleView(){return adventureMode==='combat'&&battle?combatView():adventureMapView()}
  function stagePower(stage){const encounter=STAGES[stage-1];return Math.round(encounter.enemies.reduce((sum,[id,level])=>sum+heroStats(id,level).power,0)*encounter.scale*bondMultiplier(encounter.enemies))}
  function adventureMapView(){
    const nodes1=[['12%','72%'],['29%','59%'],['17%','43%'],['38%','31%'],['55%','45%'],['70%','32%'],['58%','17%'],['77%','9%'],['88%','27%'],['87%','62%']],nodes2=[['14%','82%'],['48%','75%'],['73%','65%'],['39%','57%'],['68%','46%'],['82%','34%'],['57%','28%'],['36%','19%'],['66%','11%'],['88%','5%']];
    const offset=selectedChapter===2?10:0,nodes=selectedChapter===2?nodes2:nodes1,min=offset+1,max=offset+10,selected=clamp(selectedStage,min,max),canFight=selected<=state.stage,encounter=STAGES[selected-1],party=state.formation.slice(0,3),goldRate=goldPerSecond(),cleared=selectedChapter===1?Math.min(state.stage-1,10):clamp(state.stage-11,0,10),chapterTitle=selectedChapter===1?'第一章 · 魔临三国':'第二章 · 苍穹刻印';
    return `<div class="page adventure-map-page"><div class="chapter-tabs"><button data-chapter="1" class="${selectedChapter===1?'active':''}">第一章</button><button data-chapter="2" class="${selectedChapter===2?'active':''}" ${state.stage<=10?'disabled':''}>${state.stage<=10?'击败魔诸葛解锁':'第二章'}</button></div><div class="top-ribbon"><button class="map-rule" id="formulaHelp">规则</button><b>${chapterTitle}</b><span>通关 ${cleared}/10</span></div><div class="world-map ${selectedChapter===1?'sanguo-map':'aether-map'}">${nodes.map((pos,i)=>{const global=offset+i+1,local=i+1,unlocked=global<=state.stage,done=global<state.stage,current=state.stage<=20&&global===state.stage,boss=local===10;return `<button class="stage-node ${done?'done':''} ${current?'current':''} ${selected===global?'selected':''} ${boss?'boss':''}" style="left:${pos[0]};top:${pos[1]}" data-stage="${global}" ${unlocked?'':'disabled'}><i>${boss?'☯':selectedChapter===1?'旌':'✦'}</i><b>${selectedChapter}-${local}</b><small>${done?'已通关':current?'可挑战':'未解锁'}</small></button>`}).join('')}<div class="map-path"></div></div><div class="expedition-panel"><div class="expedition-copy"><b>${stageLabel(selected)} · ${encounter.name}</b><small>${canFight?`${encounter.enemy} · 推荐战力 ${short(stagePower(selected))}`:'需要先通关前一关'}</small><em id="idleGain">挂机：+${goldRate.toFixed(1)} 金/秒 · +${expPerSecond().toFixed(1)} EXP/秒</em></div><div class="explorer-line">${party.map(id=>heroSprite(id)).join('')}<div class="patrol-monster"></div><span class="patrol-hit">-1</span></div><button class="btn green" id="challengeStage" ${canFight?'':'disabled'}>${encounter.boss?'挑战章节Boss':'观看剧情并出战'}</button></div></div>`;
  }
  function combatArmy(side){
    const units=side==='p'?battle.pUnits:battle.eUnits;
    return units.filter(u=>u.hp>0).map((u,i)=>`<div class="battle-unit ${side==='e'?'enemy-unit':''}" data-side="${side}" data-uid="${u.uid}" style="--order:${i}">${heroSprite(u.id)}<small class="unit-level">Lv.${u.level}</small></div>`).join('');
  }
  function teamCurrentHp(units){return Math.max(0,Math.ceil(units.reduce((sum,u)=>sum+Math.max(0,u.hp),0)))}
  function combatView(){
    const pHp=teamCurrentHp(battle.pUnits),eHp=teamCurrentHp(battle.eUnits),pCount=battle.pUnits.filter(u=>u.hp>0).length,eCount=battle.eUnits.filter(u=>u.hp>0).length;
    const bondText=[battle.pBonds?.length?`我方：${battle.pBonds.map(b=>b.name).join('、')}`:'',battle.eBonds?.length?`敌方：${battle.eBonds.map(b=>b.name).join('、')}`:''].filter(Boolean).join(' ｜ ');
    return `<div class="page battle-page"><div class="battle-summary"><div class="battle-side"><b>我方 · ${pCount}人</b><div class="team-hp"><i id="playerHpBar" style="width:${pHp/battle.pMaxHp*100}%"></i></div><small id="playerHpText">${short(pHp)} / ${short(battle.pMaxHp)}</small><div class="battle-stats"><span id="pSpeed">先 ${battle.pStats.speed}</span><span id="pDef">防 ${battle.pStats.def}</span><span id="pDodge">闪 ${battle.pStats.dodge}</span><span id="pKing">王 ${battle.pStats.king}</span></div></div><div class="versus">VS</div><div class="battle-side right"><b>${battle.enemyTitle} · ${eCount}人</b><div class="team-hp enemy-hp"><i id="enemyHpBar" style="width:${eHp/battle.eMaxHp*100}%"></i></div><small id="enemyHpText">${short(eHp)} / ${short(battle.eMaxHp)}</small><div class="battle-stats"><span id="eSpeed">先 ${battle.eStats.speed}</span><span id="eDef">防 ${battle.eStats.def}</span><span id="eDodge">闪 ${battle.eStats.dodge}</span><span id="eKing">王 ${battle.eStats.king}</span></div></div></div><div class="battle-field"><span class="battle-round" id="roundLabel">${battle.label}</span>${bondText?`<span class="battle-bond-strip" id="battleBondStrip">${bondText}</span>`:''}<div class="army player" id="playerArmy">${combatArmy('p')}</div><div class="damage-float" id="damageFloat">-0</div><div class="combo-fx" id="comboFx"><b></b></div><div class="army enemy" id="enemyArmy">${combatArmy('e')}</div></div><div class="battle-controls"><button class="btn dark retreat" id="retreatBattle">撤退</button><div class="battle-log" id="battleLog">双方列阵完毕。每次只行动一方；前排主将完整发动技能，后续队员按自身战力提供技能支援。${bondText?`<br>已激活羁绊：${bondText}`:''}</div><button class="btn green" id="battleButton">开始战斗</button></div></div>`;
  }
  function recoverDurability(){
    const m=state.mine,now=Date.now(),interval=5*60*1000;if(m.durability>=m.maxDurability){m.lastDurabilityAt=now;return 0}
    const gained=Math.min(m.maxDurability-m.durability,Math.floor((now-(m.lastDurabilityAt||now))/interval));if(gained>0){m.durability+=gained;m.lastDurabilityAt+=gained*interval}return gained;
  }
  function durabilityCountdown(){
    const m=state.mine;if(m.durability>=m.maxDurability)return '耐久已满';const left=Math.max(0,5*60-Math.floor((Date.now()-(m.lastDurabilityAt||Date.now()))/1000));return `恢复 +1：${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;
  }
  function tileDepth(index){return state.mine.floorOffset+Math.floor(index/9)+1}
  function gemTierForDepth(depth){return depth>=500?3:depth>=300?2:depth>=100?1:0}
  function guardPower(depth){return Math.round(50000*Math.pow(1.5,Math.max(0,depth/25-1)))}
  function tileType(index){const depth=tileDepth(index),v=(index*47+state.mine.seed*31+Math.floor(index/9)*13)%100,tier=gemTierForDepth(depth),gem=tier?Math.min(15,3+Math.floor((depth-100)*.018)):0,chest=gem+Math.min(13,5+Math.floor(depth*.08));return v<gem?'gem':v<chest?'chest':v<chest+10?'enemy':v<chest+25?'ore':'rock'}
  function isAdjacent(index){const p=state.mine.player,x=index%9,y=Math.floor(index/9),px=p%9,py=Math.floor(p/9);return Math.abs(px-x)+Math.abs(py-y)===1}
  function canMine(index){return !state.mine.guardDepth&&isAdjacent(index)&&Math.floor(index/9)>=Math.floor(state.mine.player/9)}
  function checkMineGuard(){const m=state.mine,depth=m.depth;if(depth>=25&&depth%25===0&&!m.guardDefeatedDepths.includes(depth)){m.guardDepth=depth;return true}return false}
  function mineTile(index){
    const revealed=state.mine.revealed.includes(index), available=!revealed&&canMine(index), job=state.mine.job?.index===index,player=state.mine.player===index;
    const type=tileType(index), icon=revealed?'':available?(type==='gem'?'♦':type==='chest'?'▣':type==='enemy'?'☠':type==='ore'?'◆':'') : '';
    const progress=job?clamp((Date.now()-state.mine.job.start)/(state.mine.job.end-state.mine.job.start),0,1):0;
    return `<button class="mine-tile ${revealed?'path':'rock'} ${available?'available':''} ${job?'mining':''} ${player?'player-tile':''}" data-tile="${index}" style="--mine-angle:${progress*360}deg"><span class="${type==='enemy'?'small-node':''}">${icon}</span>${player?`<i class="mine-digger">${heroSprite(state.formation[0])}</i>`:''}</button>`;
  }
  function mineView(){
    const m=state.mine;recoverDurability();checkMineGuard();
    const guard=m.guardDepth,material=`强化石 ${state.enhanceStones} · 宝石 Ⅰ:${state.socketGems[1]} Ⅱ:${state.socketGems[2]} Ⅲ:${state.socketGems[3]}`;
    return `<div class="page mine-page"><div class="top-ribbon"><b>重力矿井 · 深度 ${m.depth}</b><small>奖励倍率 ×${(1+m.depth*.06).toFixed(2)}</small></div><div class="mine-materials">${material}<small>100/300/500层起产出Ⅰ/Ⅱ/Ⅲ阶宝石</small></div><div class="mine-tools"><div class="tool-card"><i>⛏</i><div><b>矿镐 Lv.${m.level}</b><small>耐久 ${m.durability}/${m.maxDurability}</small><div class="durability"><span style="width:${m.durability/m.maxDurability*100}%"></span></div><em>${durabilityCountdown()}</em></div></div><div class="tool-card"><i>◆</i><div><b>强化石</b><small>×${state.enhanceStones}</small></div></div><div class="tool-card"><i>▼</i><div><b>重力</b><small>只能向下推进</small></div></div></div>${guard?`<div class="mine-guard"><span><b>${guard}层守卫封路</b><small>战力 ${short(guardPower(guard))} · 击败后继续下潜</small></span><button class="btn orange" id="challengeMineGuard">迎战</button></div>`:`<div class="mine-progress"><span>${m.job?'开采进行中…':'只能开采小人左右或下方的邻近矿格；每25层遭遇守卫'}</span><b>${m.job?Math.max(0,Math.ceil((m.job.end-Date.now())/1000))+'秒':'待命'}</b></div>`}<div class="mine-grid-wrap"><div class="mine-grid gravity-grid">${Array.from({length:108},(_,i)=>mineTile(i)).join('')}</div></div><div class="mine-actions"><button class="btn orange" id="mineBack">← 营地</button><span class="mine-coord">本层 ${m.revealed.length}/108</span><button class="btn green" id="useBomb" ${m.bombs<1||m.job||guard?'disabled':''}>● 邻近爆破</button></div></div>`;
  }
  function equipmentCost(id){const i=heroIndex(id),p=state.heroes[id];return Math.ceil((3+p.equipmentLevel*2)*(1+grade(i)*.35))}
  function breakthroughCost(){return 10}
  function skillDescription(id){
    const i=heroIndex(id),skill=skillFor(id),chance=Math.round(skill.chance*100),power=skill.percent?`敌方当前战力 ${(skill.percent*100).toFixed(1)}%`:`${Math.round(skill.mult*100)}%倍率`,effects=[];
    if(skill.armorBreak)effects.push(`使敌方防御降低 ${Math.round(skill.armorBreak)}`);
    if(skill.slow)effects.push(`使敌方先攻降低 ${Math.round(skill.slow)}`);
    if(skill.heal)effects.push(`为己方恢复总战力上限 ${(skill.heal*100).toFixed(1)}%`);
    if(skill.defensePierce)effects.push(`计算伤害时穿透 ${Math.round(skill.defensePierce*100)}% 防御`);
    if(skill.bossBonus)effects.push(`攻击Boss时伤害额外提高 ${Math.round((skill.bossBonus-1)*100)}%`);
    if(skill.executeBonus)effects.push(`敌方低于 ${Math.round(skill.executeAt*100)}% 战力时伤害提高 ${Math.round((skill.executeBonus-1)*100)}%`);
    if(skill.kingSteal)effects.push(`夺取敌方 ${Math.round(skill.kingSteal)} 点王者`);
    if(skill.speedBuff)effects.push(`己方先攻提高 ${Math.round(skill.speedBuff)}`);
    return `${chance}%概率发动，造成${power}的${skill.typeName}伤害。${effects.length?`${effects.join('，')}。`:''}品阶加成 ${grade(i)*20}%。${skill.evade?'该伤害可以被闪避。':'该伤害无法被闪避。'}`;
  }
  function heroDetail(id){
    const i=heroIndex(id),p=state.heroes[id],s=heroStats(id),inParty=state.formation.includes(id),eqCost=equipmentCost(id),breakCost=breakthroughCost(id),skill=skillFor(id),levelCost=levelExpCost(id),level10Cost=levelBatchCost(id,10);
    const sockets=(p.gemSockets||[]).map(t=>`${['','Ⅰ','Ⅱ','Ⅲ'][t]}阶`).join('、')||'未镶嵌';
    return `<div class="hero-detail grade-${GRADE_CLASSES[grade(i)]}"><div class="detail-portrait">${heroSprite(id)}</div><div class="detail-info"><h2>${HERO_NAMES[i]} <small>${GRADE_NAMES[grade(i)]}${p.breakthrough?` +${p.breakthrough}`:''}</small></h2><p>${ROLE_NAMES[roleIndex(i)]} · <b class="skill-inline">${skillName(id)}</b> · ${skill.typeName}<br>Lv.${p.level} / 战力 ${short(s.power)} / 装备 +${p.equipmentLevel} / 碎片 ${p.fragments}<br>宝石槽：${sockets}</p><div class="exp-wallet">公共 EXP：<b>${short(state.exp)}</b> · 强化石：<b>${state.enhanceStones}</b> · 下级消耗 ${short(levelCost)}</div><div class="detail-stats"><span>先攻 ${s.speed}</span><span>防御 ${s.def}</span><span>闪避 ${s.dodge}</span><span>王者 ${s.king}</span></div><div class="detail-actions"><button class="btn green" id="levelHero" ${state.exp<levelCost?'disabled':''}>升级 Lv.${p.level+1}<br><small>${short(levelCost)} EXP</small></button><button class="btn green batch-level" id="levelHero10" ${state.exp<level10Cost?'disabled':''}>连升 10 级<br><small>${short(level10Cost)} EXP</small></button><button class="btn green" id="equipHero" ${state.enhanceStones<eqCost?'disabled':''}>装备 +1<br><small>${eqCost}强化石</small></button><button class="btn green" id="breakHero" ${p.breakthrough>=99||p.fragments<breakCost?'disabled':''}>突破 +${Math.min(99,p.breakthrough+1)}<br><small>${breakCost}碎片</small></button><button class="btn dark" id="socketGem">镶嵌宝石<br><small>${(p.gemSockets||[]).length}/3槽</small></button><button class="btn ${inParty?'orange':'dark'}" id="toggleHero">${inParty?'撤下':'上阵'}</button><button class="btn dark" id="skillDetail">技能详情</button></div></div></div>`;
  }
  function heroesView(){
    const selected=state.selected||'h00',slots=unlockedSlots(),next=nextSlotThreshold();
    const owned=Array.from({length:HERO_GRADES.length},(_,i)=>heroId(i)).filter(id=>state.heroes[id].unlocked);
    if(!state.heroes[selected]?.unlocked)state.selected=owned[0]||'h00';
    const bonds=activeBonds(state.formation);
    return `<div class="page heroes-page">${heroDetail(state.selected)}<div class="roster-toolbar"><b>已获得 ${unlockedCount()} · 出战 ${state.formation.length}/${slots}</b><span>${next?`总等级 ${totalHeroLevels()}/${next} 解锁下栏位`:'25个栏位已全部解锁'}</span><button class="bond-button ${bonds.length?'active':''}" id="bondDetail">羁绊 ${bonds.length}/${BONDS.length}</button></div><div class="roster owned-only">${owned.map(id=>{const i=heroIndex(id),p=state.heroes[id],inParty=state.formation.includes(id),g=grade(i);return `<button class="hero-card grade-${GRADE_CLASSES[g]} ${state.selected===id?'selected':''}" data-hero="${id}">${inParty?'<i class="party-dot"></i>':''}<span class="grade-label">${GRADE_NAMES[g]}${p.breakthrough?` +${p.breakthrough}`:''}</span>${heroSprite(id)}<span class="lv">Lv${p.level}</span></button>`}).join('')}</div></div>`;
  }
  function summonView(){
    return `<div class="page summon-page"><h1 class="pixel-title">异界召唤台</h1><p class="summon-note">每次首次通关都会有对应角色进入卡池<br>重复英雄统一转化为 10 枚突破碎片</p><div class="portal"></div><div class="summon-actions"><button class="btn orange" id="goldSummon" ${state.gold<3000?'disabled':''}>● 金币召唤<br><small>3,000 金币</small></button><button class="btn orange" id="goldSummon10" ${state.gold<30000?'disabled':''}>● 金币十连<br><small>30,000 金币</small></button><button class="btn green" id="diamondSummon" ${state.gems<10?'disabled':''}>♦ 血钻召唤<br><small>10 血钻</small></button><button class="btn green" id="diamondSummon10" ${state.gems<100?'disabled':''}>♦ 血钻十连<br><small>100 血钻</small></button></div><div class="summon-secondary"><button class="rate-button" id="summonRates">查看卡池与概率</button><button class="rate-button redeem-button" id="redeemCode">兑换码</button></div><p class="summon-note">当前卡池 ${state.poolUnlocked.length} 名 · 已获得 ${unlockedCount()} 名<br>金币 ${short(state.gold)} · 血钻 ${state.gems}</p></div>`;
  }
  function arenaView(){
    const ranks=['星火旅团','黑曜掘金队','灰塔守望者','余烬矿团','绿帽冒险社'];
    return `<div class="page arena-page"><div class="panel arena-board"><h1 class="pixel-title">遗迹竞技场</h1><p>根据阵容总战力生成的单机挑战排行</p><div class="rank-list">${ranks.map((name,i)=>`<div class="rank-row ${name==='余烬矿团'?'me':''}"><b>#${i+1} ${name}</b><span>${short(formationPower()*(1.28-i*.09))}</span></div>`).join('')}</div><button class="btn green" id="arenaFight">挑战镜像队伍</button></div></div>`;
  }

  function bindView(){
    $$('[data-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.go));
    const saveInfo=$('#saveInfo');if(saveInfo)saveInfo.onclick=()=>toast('进度已自动保存在本机');
    const shop=$('#shopButton');if(shop)shop.onclick=()=>showShop();
    const battleButton=$('#battleButton');if(battleButton)battleButton.onclick=startBattle;
    const formulaHelp=$('#formulaHelp');if(formulaHelp)formulaHelp.onclick=showFormulaHelp;
    $$('[data-chapter]').forEach(b=>b.onclick=()=>{const chapter=Number(b.dataset.chapter);if(chapter===2&&state.stage<=10)return;selectedChapter=chapter;selectedStage=chapter===1?Math.min(state.stage,10):Math.min(Math.max(state.stage,11),20);render()});
    $$('[data-stage]').forEach(b=>b.onclick=()=>{selectedStage=Number(b.dataset.stage);render()});
    const challenge=$('#challengeStage');if(challenge)challenge.onclick=()=>showStagePrelude(selectedStage);
    const retreat=$('#retreatBattle');if(retreat)retreat.onclick=retreatBattle;
    $$('[data-tile]').forEach(b=>b.onclick=()=>openMine(Number(b.dataset.tile)));
    const back=$('#mineBack');if(back)back.onclick=()=>navigate('home');
    const bomb=$('#useBomb');if(bomb)bomb.onclick=useBomb;
    const mineGuard=$('#challengeMineGuard');if(mineGuard)mineGuard.onclick=enterMineGuardBattle;
    $$('[data-hero]').forEach(b=>b.onclick=()=>{state.selected=b.dataset.hero;queueSave();render()});
    const level=$('#levelHero');if(level)level.onclick=levelSelected;
    const level10=$('#levelHero10');if(level10)level10.onclick=()=>levelSelected(10);
    const equip=$('#equipHero');if(equip)equip.onclick=equipSelected;
    const socket=$('#socketGem');if(socket)socket.onclick=()=>openGemSocket(state.selected);
    const breakthrough=$('#breakHero');if(breakthrough)breakthrough.onclick=breakthroughSelected;
    const toggle=$('#toggleHero');if(toggle)toggle.onclick=toggleSelected;
    const skill=$('#skillDetail');if(skill)skill.onclick=()=>openSkillDetail(state.selected);
    const bond=$('#bondDetail');if(bond)bond.onclick=showBondDetail;
    const goldSummon=$('#goldSummon');if(goldSummon)goldSummon.onclick=()=>summonHero('gold');
    const goldSummon10=$('#goldSummon10');if(goldSummon10)goldSummon10.onclick=()=>summonHero('gold',10);
    const diamondSummon=$('#diamondSummon');if(diamondSummon)diamondSummon.onclick=()=>summonHero('diamond');
    const diamondSummon10=$('#diamondSummon10');if(diamondSummon10)diamondSummon10.onclick=()=>summonHero('diamond',10);
    const summonRates=$('#summonRates');if(summonRates)summonRates.onclick=showSummonRates;
    const redeem=$('#redeemCode');if(redeem)redeem.onclick=showRedeemCode;
    const arena=$('#arenaFight');if(arena)arena.onclick=()=>{toast('镜像挑战胜利：金币 +300，公共 EXP +800');state.gold+=300;state.exp+=800;queueSave();render()};
  }
  function unlockedCount(){return Object.values(state.heroes).filter(h=>h.unlocked).length}
  function levelSelected(count=1){
    const id=state.selected,p=state.heroes[id],levels=count===10?10:1,cost=levelBatchCost(id,levels),before=unlockedSlots();if(state.exp<cost)return;state.exp-=cost;p.level+=levels;queueSave();toast(`${HERO_NAMES[heroIndex(id)]} 连升 ${levels} 级，达到 Lv.${p.level}${unlockedSlots()>before?`，出战栏位解锁至 ${unlockedSlots()}`:''}`);render();
  }
  function equipSelected(){
    const id=state.selected,p=state.heroes[id],cost=equipmentCost(id);if(state.enhanceStones<cost)return;state.enhanceStones-=cost;p.equipmentLevel++;queueSave();toast(`${HERO_NAMES[heroIndex(id)]} 装备强化至 +${p.equipmentLevel}，消耗 ${cost} 强化石`);render();
  }
  function openGemSocket(id){
    const p=state.heroes[id],names=['','Ⅰ阶','Ⅱ阶','Ⅲ阶'],bonuses=['','2%','5%','9%'],slots=Array.from({length:3},(_,slot)=>{const tier=p.gemSockets[slot];return `<div class="gem-slot"><b>槽位 ${slot+1}</b>${tier?`<span class="gem tier-${tier}">◆ ${names[tier]}宝石</span><small>全属性 +${bonuses[tier]}</small><button class="btn orange" data-remove-gem="${slot}">卸下</button>`:`<span class="gem empty">空槽</span><small>可镶嵌任意阶宝石</small>`}</div>`}).join('');
    showModal(`<h2 class="modal-title">装备宝石镶嵌</h2><p>${HERO_NAMES[heroIndex(id)]} · 每名英雄最多 3 个槽位；同阶效果可以叠加。</p><div class="gem-slots">${slots}</div><div class="gem-inventory">${[1,2,3].map(tier=>`<button class="btn green" data-socket-tier="${tier}" ${p.gemSockets.length>=3||state.socketGems[tier]<1?'disabled':''}>${names[tier]}宝石 ×${state.socketGems[tier]}<small>全属性 +${bonuses[tier]}</small></button>`).join('')}</div><div class="modal-actions"><button class="btn dark" data-close>完成</button></div>`);
    $$('[data-socket-tier]').forEach(button=>button.onclick=()=>{const tier=Number(button.dataset.socketTier);if(p.gemSockets.length>=3||state.socketGems[tier]<1)return;state.socketGems[tier]--;p.gemSockets.push(tier);queueSave();openGemSocket(id)});
    $$('[data-remove-gem]').forEach(button=>button.onclick=()=>{const slot=Number(button.dataset.removeGem),tier=p.gemSockets.splice(slot,1)[0];if(tier)state.socketGems[tier]++;queueSave();openGemSocket(id)});
  }
  function breakthroughSelected(){
    const id=state.selected,p=state.heroes[id],cost=breakthroughCost(id);if(p.breakthrough>=99||p.fragments<cost)return;p.fragments-=cost;p.breakthrough++;queueSave();toast(`${HERO_NAMES[heroIndex(id)]} 突破 +${p.breakthrough}，全属性倍率 +7%`);render();
  }
  function toggleSelected(){
    const id=state.selected,at=state.formation.indexOf(id);
    if(at>=0){if(state.formation.length<=1){toast('至少保留一名佣兵');return}state.formation.splice(at,1)}
    else{const slots=unlockedSlots();if(state.formation.length>=slots){const next=nextSlotThreshold();toast(next?`栏位未解锁：英雄总等级达到 ${next}`:'25个阵容栏位已满');return}state.formation.push(id)}
    queueSave();render();
  }

  function showFormulaHelp(){
    showModal(`<h2 class="modal-title">战斗伤害规则</h2><div class="formula-sheet"><p><b>战力就是强度</b>：全队战力为所有上阵英雄战力之和，同时决定总血量与基础伤害。队伍防御、闪避、先攻再由总战力单调换算，因此新增任何队员都不会降低队伍属性。地图推荐战力等于敌方进入战斗后的实际总战力。</p><p><b>技能协同</b>：每次仍然由双方交替行动。最前方存活英雄是主将，使用完整技能概率；其他队员按自身与主将的战力比例提供额外技能支援，加入队员只会增加支援机会。</p><p><b>基础伤害</b>＝当前战力×0.2＋总战力×0.1</p><p><b>王者</b>：单个英雄基数为原来的 0.1，完全不受等级倍率影响；队伍王者为全体成员直接相加。突破、装备和宝石仍会提供全属性加成。<br><b>王者差</b>＝己方王者－敌方王者，最小为0<br><b>增伤系数</b>＝1＋0.01×王者差<br><b>防御系数</b>＝1－敌方防御÷（100＋敌方防御）</p><hr><p><b>普通</b>＝倍率×基础伤害×防御系数×增伤系数<br><b>纯粹</b>＝倍率×基础伤害×增伤系数<br><b>暴击</b>＝（倍率＋0.005×先攻）×基础伤害×防御系数×增伤系数<br><b>百分比</b>＝技能百分比血量×防御系数×增伤系数</p><p>普通型和百分比型可以被闪避；纯粹型和暴击型无视闪避。品阶只提高技能效果，不会再把触发率同时放大。所有伤害最终向上取整。</p></div><div class="modal-actions"><button class="btn green" data-close>明白了</button></div>`);
  }
  function showBondDetail(){
    const current=activeBonds(state.formation),activeIds=new Set(current.map(bond=>bond.id));
    showModal(`<h2 class="modal-title">阵容羁绊</h2><p class="bond-note">指定英雄同时存活并上阵即可激活。战力加成为地图与战斗中的真实战力；拥有连携技的羁绊还会在本方行动时概率发动。</p><div class="bond-list">${BONDS.map(bond=>{const active=activeIds.has(bond.id),members=bond.members.map(id=>HERO_NAMES[heroIndex(id)]).join(' · '),combo=bond.combo?`<span class="bond-combo">连携技「${bond.combo.name}」：${Math.round(bond.combo.chance*100)}%概率，${bond.combo.typeName}伤害${bond.combo.heal?'并回复全队':''}${bond.combo.slow?'并降低敌方先攻':''}</span>`:'';return `<article class="bond-row ${active?'active':''}"><header><b>${bond.name}</b><em>${active?'已激活':'未激活'}</em></header><small>${members}</small><p>${bond.description}</p>${combo}</article>`}).join('')}</div><div class="modal-actions"><button class="btn green" data-close>返回编队</button></div>`);
  }
  function showStagePrelude(stage){
    if(stage>state.stage)return;const encounter=STAGES[stage-1],poolNames=encounter.pool.map(id=>HERO_NAMES[heroIndex(id)]).join('、'),chapter=stage<=10?'第一章 · 魔临三国':'第二章 · 苍穹刻印';
    showModal(`<div class="stage-story"><small>${chapter}</small><h2>${stageLabel(stage)} ${encounter.name}</h2><p>${encounter.story}</p><div class="enemy-preview"><b>敌方阵容</b><span>${encounter.enemy}</span><em>推荐战力 ${short(stagePower(stage))}</em></div>${poolNames?`<p class="pool-hint">首次通关后，${poolNames} 将加入召唤池。</p>`:''}</div><div class="modal-actions"><button class="btn dark" data-close>返回整备</button><button class="btn green" id="confirmStage">进入战斗</button></div>`);
    const confirm=$('#confirmStage');if(confirm)confirm.onclick=()=>{closeModal();enterCombat(stage)};
  }
  function skillFormulaLabel(skill){
    const pierce=skill.defensePierce?`（穿透${Math.round(skill.defensePierce*100)}%防御）`:'';
    if(skill.type==='normal')return `${Math.round(skill.mult*100)}% × 基础伤害 × 防御系数${pierce} × 增伤系数`;
    if(skill.type==='pure')return `${Math.round(skill.mult*100)}% × 基础伤害 × 增伤系数`;
    if(skill.type==='crit')return `（${Math.round(skill.mult*100)}%＋0.5%×先攻）× 基础伤害 × 防御系数 × 增伤系数`;
    return `敌方当前总战力的 ${(skill.percent*100).toFixed(1)}% × 防御系数 × 增伤系数`;
  }
  function openSkillDetail(id){
    const i=heroIndex(id),role=roleIndex(i),skill=skillFor(id),s=heroStats(id),p=state.heroes[id];
    const lore=i===0?'随穿越者进入魔临三国的第一名义勇兵，负责在陌生时代保护探险队。':i>=20?`${HERO_NAMES[i]}是“苍穹刻印”世界的灵纹持有者。净化被魔王扭曲的刻印后，便会通过召唤台响应穿越者。`:`${HERO_NAMES[i]}曾被魔气卷入错乱的三国时空。击破其执念后，便能通过点将台响应召唤。`;
    const related=BONDS.filter(bond=>bond.members.includes(id)).map(bond=>`${bond.name}${bond.combo?` / ${bond.combo.name}`:''}`).join('、')||'暂无';
    showModal(`<div class="skill-profile"><div class="skill-profile-head grade-${GRADE_CLASSES[grade(i)]}">${heroSprite(id)}<div><h2>${HERO_NAMES[i]}</h2><p>${ROLE_NAMES[role]} · ${GRADE_NAMES[grade(i)]} · 突破 +${p.breakthrough}</p><span class="skill-type ${skill.type}">${skill.typeName}</span></div></div><div class="skill-panel"><h3>个人技：${skillName(id)}</h3><p>${skillDescription(id)}</p><dl><dt>触发概率</dt><dd>主将 ${Math.round(skill.chance*100)}%；支援位按相对战力折算</dd><dt>伤害公式</dt><dd>${skillFormulaLabel(skill)}</dd><dt>相关羁绊</dt><dd>${related}</dd><dt>品阶加成</dt><dd>属性与技能效果 +${grade(i)*20}%（不重复放大概率）</dd><dt>闪避规则</dt><dd>${skill.evade?'可以被敌方闪避':'无视敌方闪避'}</dd></dl></div><div class="skill-four"><span>先攻<b>${s.speed}</b></span><span>防御<b>${s.def}</b></span><span>闪避<b>${s.dodge}</b></span><span>王者<b>${s.king}</b></span></div><div class="lore"><b>人物背景</b><p>${lore}</p></div></div><div class="modal-actions"><button class="btn green" data-close>返回英雄列表</button></div>`);
  }

  function createBattleUnit(id,side,index,scale=1,level=null){
    const actualLevel=level??state.heroes[id].level,maxHp=Math.max(100,Math.round(heroStats(id,level).power*scale));
    return {uid:`${side}${index}-${Date.now()}`,id,level:actualLevel,maxHp,hp:maxHp};
  }
  function enterCombat(stage){
    if(stage>state.stage||stage<1||stage>20)return;
    clearTimeout(battleTimer);const encounter=STAGES[stage-1],boss=!!encounter.boss,enemyScale=encounter.scale;
    const enemySpecs=encounter.enemies.map(([id,level])=>({id,level})),pIds=state.formation.slice(0,25),pBonds=activeBonds(pIds),eBonds=activeBonds(enemySpecs),pScale=bondMultiplier(pIds),eScale=enemyScale*bondMultiplier(enemySpecs);
    const pUnits=pIds.map((id,i)=>createBattleUnit(id,'p',i,pScale)),eUnits=enemySpecs.map((unit,i)=>createBattleUnit(unit.id,'e',i,eScale,unit.level));
    battle={kind:'stage',stage,boss,label:`${stageLabel(stage)} · ${encounter.name}`,enemyTitle:encounter.enemy,enemyBaseScale:enemyScale,enemyPowerScale:eScale,pPowerScale:pScale,pBonds,eBonds,running:false,round:1,turn:'p',pUnits,eUnits,pStats:teamStats(pIds,pScale),eStats:teamStats(enemySpecs,eScale),pMods:{def:0,dodge:0,speed:0,king:0},eMods:{def:0,dodge:0,speed:0,king:0}};
    battle.pMaxHp=teamCurrentHp(pUnits);battle.eMaxHp=teamCurrentHp(eUnits);battle.turn=battle.pStats.speed>=battle.eStats.speed?'p':'e';adventureMode='combat';render();
  }
  function enterMineGuardBattle(){
    const depth=state.mine.guardDepth;if(!depth)return;clearTimeout(battleTimer);
    const targetPower=guardPower(depth),enemyId='h17',enemyLevel=Math.max(10,Math.round(depth*.6)),pIds=state.formation.slice(0,25),pBonds=activeBonds(pIds),pScale=bondMultiplier(pIds),pUnits=pIds.map((id,i)=>createBattleUnit(id,'p',i,pScale)),eUnit=createBattleUnit(enemyId,'e',0,1,enemyLevel);
    eUnit.maxHp=targetPower;eUnit.hp=targetPower;const eStats=combatStatsForPower(targetPower,.5+depth/250);
    battle={kind:'mineGuard',guardDepth:depth,boss:true,label:`矿洞 ${depth} 层守卫`,enemyTitle:`深渊守卫 · 战力 ${short(targetPower)}`,running:false,round:1,turn:'p',pUnits,eUnits:[eUnit],pPowerScale:pScale,pBonds,eBonds:[],pStats:teamStats(pIds,pScale),eStats,pMods:{def:0,dodge:0,speed:0,king:0},eMods:{def:0,dodge:0,speed:0,king:0}};
    battle.pMaxHp=teamCurrentHp(pUnits);battle.eMaxHp=targetPower;battle.turn=battle.pStats.speed>=battle.eStats.speed?'p':'e';activeTab='battle';adventureMode='combat';$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='battle'));render();
  }
  function restartBattle(){if(!battle)return;if(battle.kind==='mineGuard')enterMineGuardBattle();else enterCombat(battle.stage)}

  function startBattle(){
    if(!battle||battle.running)return;
    if(teamCurrentHp(battle.pUnits)<=0||teamCurrentHp(battle.eUnits)<=0){restartBattle();return}
    battle.running=true;const button=$('#battleButton');button.disabled=true;button.textContent='轮流战斗中';
    const retreat=$('#retreatBattle');if(retreat)retreat.disabled=true;
    logBattle(`${battle.turn==='p'?'我方':'敌方'}先攻更高，率先行动。`);battleTimer=setTimeout(battleStep,450);
  }
  function calculateDamage(side,skill){
    const atkUnits=side==='p'?battle.pUnits:battle.eUnits,defUnits=side==='p'?battle.eUnits:battle.pUnits;
    const atkStats=side==='p'?battle.pStats:battle.eStats,defStats=side==='p'?battle.eStats:battle.pStats;
    const currentPower=teamCurrentHp(atkUnits),totalPower=side==='p'?battle.pMaxHp:battle.eMaxHp,enemyCurrent=teamCurrentHp(defUnits),enemyMax=side==='p'?battle.eMaxHp:battle.pMaxHp;
    const base=currentPower*.2+totalPower*.1,kingDiff=Math.max(0,atkStats.king-defStats.king),boost=1+.01*kingDiff,effectiveDef=defStats.def*(1-(skill.defensePierce||0)),defense=1-effectiveDef/(100+effectiveDef);
    let damage;if(skill.type==='pure')damage=skill.mult*base*boost;
    else if(skill.type==='crit')damage=(skill.mult+.005*atkStats.speed)*base*defense*boost;
    else if(skill.type==='percent')damage=skill.percent*enemyCurrent*defense*boost;
    else damage=skill.mult*base*defense*boost;
    if(skill.bossBonus&&battle.boss&&side==='p')damage*=skill.bossBonus;
    if(skill.executeBonus&&enemyCurrent/enemyMax<=skill.executeAt)damage*=skill.executeBonus;
    return Math.ceil(damage);
  }
  function applyTeamDamage(units,damage){
    const dead=[];let remaining=damage;
    for(const unit of units){
      if(unit.hp<=0)continue;const hit=Math.min(unit.hp,remaining);unit.hp-=hit;remaining-=hit;if(unit.hp<=0)dead.push(unit.uid);if(remaining<=0)break;
    }
    return dead;
  }
  function healTeam(units,amount){
    let left=amount,healed=0;for(const unit of units){if(unit.hp<=0||unit.hp>=unit.maxHp)continue;const value=Math.min(unit.maxHp-unit.hp,left);unit.hp+=value;left-=value;healed+=value;if(left<=0)break}return Math.ceil(healed);
  }
  function applySkillEffect(side,skill){
    const ownStats=side==='p'?battle.pStats:battle.eStats,targetStats=side==='p'?battle.eStats:battle.pStats,ownMods=side==='p'?battle.pMods:battle.eMods,targetMods=side==='p'?battle.eMods:battle.pMods,ownUnits=side==='p'?battle.pUnits:battle.eUnits,ownMax=side==='p'?battle.pMaxHp:battle.eMaxHp,notes=[];
    if(skill.armorBreak){const amount=Math.min(targetStats.def,Math.round(skill.armorBreak));targetStats.def-=amount;targetMods.def-=amount;notes.push(`敌方防御 -${amount}`)}
    if(skill.slow){const amount=Math.min(targetStats.speed,Math.round(skill.slow));targetStats.speed-=amount;targetMods.speed-=amount;notes.push(`敌方先攻 -${amount}`)}
    if(skill.heal){const healed=healTeam(ownUnits,ownMax*skill.heal);if(healed)notes.push(`己方恢复 ${healed.toLocaleString()} 战力`)}
    if(skill.speedBuff){const amount=Math.round(skill.speedBuff);ownStats.speed+=amount;ownMods.speed+=amount;notes.push(`己方先攻 +${amount}`)}
    if(skill.kingSteal){const amount=Math.min(targetStats.king,Math.round(skill.kingSteal));targetStats.king-=amount;targetMods.king-=amount;ownStats.king+=amount;ownMods.king+=amount;notes.push(`夺取 ${amount} 点王者`)}
    return notes.length?`技能附加效果：${notes.join('，')}。`:'';
  }
  function aliveUnits(units){return units.filter(u=>u.hp>0)}
  function refreshBattleStats(side){
    const units=aliveUnits(side==='p'?battle.pUnits:battle.eUnits);if(!units.length)return;const entries=side==='p'?units.map(unit=>unit.id):units.map(unit=>({id:unit.id,level:unit.level})),mods=side==='p'?battle.pMods:battle.eMods,bonds=activeBonds(entries),scale=(side==='e'?(battle.enemyBaseScale||1):1)*bondMultiplier(entries),base=teamStats(entries,scale),stats={def:Math.max(0,base.def+mods.def),dodge:Math.max(0,base.dodge+mods.dodge),speed:Math.max(0,base.speed+mods.speed),king:Math.max(0,Math.round((base.king+mods.king)*10)/10),power:base.power};if(side==='p'){battle.pStats=stats;battle.pBonds=bonds;battle.pPowerScale=scale}else if(battle.kind!=='mineGuard'){battle.eStats=stats;battle.eBonds=bonds;battle.enemyPowerScale=scale}
  }
  function selectTeamAction(side,attackers){
    const leader=attackers[0],candidates=[];attackers.forEach(unit=>{const personal=skillFor(unit.id),supportFactor=unit===leader?1:.5*Math.min(1,unit.maxHp/leader.maxHp),chance=personal.chance*supportFactor;if(Math.random()<chance)candidates.push({unit,skill:personal,damage:calculateDamage(side,personal)})});
    const bonds=side==='p'?battle.pBonds:battle.eBonds;bonds.filter(bond=>bond.combo).forEach(bond=>{const combo=Object.assign({},bond.combo,{comboId:bond.id,comboName:bond.combo.name});if(Math.random()<combo.chance)candidates.push({unit:leader,skill:combo,damage:calculateDamage(side,combo),comboId:bond.id,comboName:combo.comboName})});
    if(!candidates.length)return {attacker:leader,skill:{type:'normal',typeName:'普通型',mult:1,evade:true},triggered:false};
    candidates.sort((a,b)=>b.damage-a.damage);return {attacker:candidates[0].unit,skill:candidates[0].skill,triggered:true,comboId:candidates[0].comboId,comboName:candidates[0].comboName};
  }
  function battleStep(){
    if(!battle?.running)return;
    const pAlive=aliveUnits(battle.pUnits),eAlive=aliveUnits(battle.eUnits);if(!pAlive.length||!eAlive.length){finishBattle(!eAlive.length);return}
    const side=battle.turn,attackers=side==='p'?pAlive:eAlive,defenders=side==='p'?eAlive:pAlive,action=selectTeamAction(side,attackers),attacker=action.attacker,skill=action.skill,triggered=action.triggered,actionName=action.comboName||skillName(attacker.id);
    const atkStats=side==='p'?battle.pStats:battle.eStats,defStats=side==='p'?battle.eStats:battle.pStats;
    const dodgeChance=skill.evade?clamp(defStats.dodge/(100+defStats.dodge)*.55,0,.48):0;
    const atkEl=$(`[data-side="${side}"][data-uid="${attacker.uid}"]`),target=defenders[0],targetSide=side==='p'?'e':'p',targetEl=$(`[data-side="${targetSide}"][data-uid="${target.uid}"]`);
    atkEl?.classList.add('attack');setTimeout(()=>atkEl?.classList.remove('attack'),210);if(action.comboId)showComboEffect(action.comboId,action.comboName,side);
    if(Math.random()<dodgeChance){showDamage('闪避',side);targetEl?.classList.add('dodge');setTimeout(()=>targetEl?.classList.remove('dodge'),300);logBattle(`${side==='p'?'我方':'敌方'} ${HERO_NAMES[heroIndex(attacker.id)]} 的${triggered?'「'+actionName+'」':'普通攻击'}被闪避。`)}
    else{
      const damage=calculateDamage(side,skill),defUnits=side==='p'?battle.eUnits:battle.pUnits,dead=applyTeamDamage(defUnits,damage);if(dead.length)refreshBattleStats(targetSide);
      showDamage(damage,side);targetEl?.classList.add('hit');setTimeout(()=>targetEl?.classList.remove('hit'),240);
      logBattle(`${side==='p'?'我方':'敌方'} ${HERO_NAMES[heroIndex(attacker.id)]}${triggered?(action.comboId?'触发羁绊连携「':'发动「')+actionName+'」':'普通攻击'}，造成 ${damage.toLocaleString()} 点${skill.typeName||'普通型'}伤害。`);const effectNote=triggered?applySkillEffect(side,skill):'';if(effectNote)logBattle(effectNote);
      setTimeout(()=>dead.forEach(uid=>$(`[data-side="${targetSide}"][data-uid="${uid}"]`)?.classList.add('dying')),120);
      setTimeout(()=>updateBattleArmies(),610);updateBattleHud();
    }
    battle.turn=side==='p'?'e':'p';battle.round++;const label=$('#roundLabel');if(label)label.textContent=`${battle.label} · 回合 ${battle.round} · ${battle.turn==='p'?'我方':'敌方'}行动`;
    battleTimer=setTimeout(battleStep,900);
  }
  function updateBattleHud(){
    if(!battle)return;const p=teamCurrentHp(battle.pUnits),e=teamCurrentHp(battle.eUnits),pb=$('#playerHpBar'),eb=$('#enemyHpBar');if(pb)pb.style.width=`${p/battle.pMaxHp*100}%`;if(eb)eb.style.width=`${e/battle.eMaxHp*100}%`;const pt=$('#playerHpText'),et=$('#enemyHpText');if(pt)pt.textContent=`${short(p)} / ${short(battle.pMaxHp)}`;if(et)et.textContent=`${short(e)} / ${short(battle.eMaxHp)}`;[['pSpeed','先 ',battle.pStats.speed],['pDef','防 ',battle.pStats.def],['pDodge','闪 ',battle.pStats.dodge],['pKing','王 ',battle.pStats.king],['eSpeed','先 ',battle.eStats.speed],['eDef','防 ',battle.eStats.def],['eDodge','闪 ',battle.eStats.dodge],['eKing','王 ',battle.eStats.king]].forEach(([id,prefix,value])=>{const el=$(`#${id}`);if(el)el.textContent=prefix+value});const bondStrip=$('#battleBondStrip');if(bondStrip)bondStrip.textContent=[battle.pBonds?.length?`我方：${battle.pBonds.map(b=>b.name).join('、')}`:'',battle.eBonds?.length?`敌方：${battle.eBonds.map(b=>b.name).join('、')}`:''].filter(Boolean).join(' ｜ ');
  }
  function updateBattleArmies(){const p=$('#playerArmy'),e=$('#enemyArmy');if(p)p.innerHTML=combatArmy('p');if(e)e.innerHTML=combatArmy('e')}
  function showDamage(value,side){const el=$('#damageFloat');if(!el)return;el.textContent=typeof value==='number'?`-${value.toLocaleString()}`:value;el.classList.toggle('enemy-turn',side==='e');el.classList.remove('show');void el.offsetWidth;el.classList.add('show')}
  function showComboEffect(comboId,name,side){const el=$('#comboFx'),field=$('.battle-field');if(!el)return;el.className=`combo-fx ${comboId} ${side==='e'?'enemy-combo':''}`;const label=el.querySelector('b');if(label)label.textContent=name;void el.offsetWidth;el.classList.add('show');field?.classList.add('combo-shake');setTimeout(()=>{el.classList.remove('show');field?.classList.remove('combo-shake')},720)}
  function logBattle(text){const el=$('#battleLog');if(el){el.innerHTML+=`<br>${text}`;el.scrollTop=el.scrollHeight}}
  function finishBattle(won){
    clearTimeout(battleTimer);battle.running=false;const button=$('#battleButton');if(button){button.disabled=false;button.textContent=won?'战斗结束':'再次挑战'};const retreat=$('#retreatBattle');if(retreat)retreat.disabled=false;
    if(won&&battle.kind==='mineGuard'){
      const depth=battle.guardDepth,tier=gemTierForDepth(depth),stones=Math.ceil(8*(1+depth/75)),gold=Math.ceil(900*(1+depth*.025));state.mine.guardDefeatedDepths.push(depth);state.mine.guardDepth=null;state.enhanceStones+=stones;state.gold+=gold;if(tier)state.socketGems[tier]++;state.wins++;queueSave();showModal(`<h2 class="modal-title">${depth}层守卫已击败</h2><p>封锁解除，现在可以继续向更深处开采。下一名守卫战力将提高为本次的 1.5 倍。</p><div class="modal-actions"><span>强化石 +${stones}</span><span>● ${short(gold)}</span>${tier?`<span>${['','Ⅰ','Ⅱ','Ⅲ'][tier]}阶宝石 +1</span>`:''}</div><div class="modal-actions"><button class="btn green" id="returnToMine">返回矿洞</button></div>`);setTimeout(()=>{const back=$('#returnToMine');if(back)back.onclick=()=>{closeModal();battle=null;adventureMode='map';activeTab='mine';$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='mine'));render()}},0);return;
    }
    if(won){const cleared=battle.stage,encounter=STAGES[cleared-1],gold=1700+cleared*230,exp=290+cleared*41,gems=encounter.boss?25:cleared%5===0?10:2,firstClear=cleared===state.stage;state.gold+=gold;state.exp+=exp;state.gems+=gems;state.wins++;let added=[];if(firstClear){encounter.pool.forEach(id=>{if(!state.poolUnlocked.includes(id)){state.poolUnlocked.push(id);added.push(id)}});state.stage=Math.min(21,state.stage+1)}selectedChapter=cleared>=10?2:1;selectedStage=cleared===10?11:Math.min(state.stage,selectedChapter*10);const poolNote=added.length?`<p class="unlock-note">新卡加入召唤池：${added.map(id=>HERO_NAMES[heroIndex(id)]).join('、')}</p>`:'',victoryCopy=cleared===10?'魔诸葛亮的八阵图崩解，“苍穹刻印”世界已经解锁！':cleared===20?'蚀星龙座熄灭，第二枚世界核心已被收复。':'下一处关卡已经解锁，挂机金币倍率 +5%、EXP倍率 +7%。';queueSave();showModal(`<h2 class="modal-title">${stageLabel(cleared)} 战斗胜利</h2><p>${victoryCopy}</p>${poolNote}<div class="modal-actions"><span>● ${short(gold)}</span><span>EXP ${short(exp)}</span><span>♦ ${gems}</span></div><div class="modal-actions"><button class="btn green" id="returnToMap">返回地图</button></div>`);setTimeout(()=>{const back=$('#returnToMap');if(back)back.onclick=()=>{closeModal();adventureMode='map';battle=null;render()}},0)}
    else{logBattle('我方总战力归零，队伍败退。');toast('挑战失败，不损失资源');if(button)button.onclick=restartBattle}
  }
  function retreatBattle(){if(battle?.running)return;clearTimeout(battleTimer);const returnToMine=battle?.kind==='mineGuard';battle=null;adventureMode='map';if(returnToMine){activeTab='mine';$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='mine'))}render()}

  function openMine(index){
    const m=state.mine;if(m.guardDepth){toast(`必须先击败 ${m.guardDepth} 层守卫`);return}if(m.job){toast('当前已有矿格正在开采');return}if(m.revealed.includes(index)){if(isAdjacent(index)){m.player=index;applyMineGravity();queueSave();render()}return}if(!canMine(index)){toast('只能向两侧或向下开采小人附近的矿格');return}if(m.durability<1){toast(`矿镐耐久不足，${durabilityCountdown()}`);return}
    const type=tileType(index),tier=gemTierForDepth(tileDepth(index)),names={gem:`${['','Ⅰ','Ⅱ','Ⅲ'][tier]}阶宝石矿`,chest:'古代宝箱',enemy:'守矿魔像',ore:'强化石矿',rock:'普通岩层'},seconds={gem:8,chest:7,enemy:6,ore:5,rock:3}[type];
    showModal(`<h2 class="modal-title">开采矿石</h2><p>确定开采「${names[type]}」吗？<br>预计耗时 ${seconds} 秒，消耗 1 点耐久。</p><div class="modal-actions"><button class="btn orange" data-close>取消</button><button class="btn green" id="confirmMine">确认</button></div>`);
    setTimeout(()=>{const b=$('#confirmMine');if(b)b.onclick=()=>startMineJob(index,seconds)},0);
  }
  function startMineJob(index,seconds){
    state.mine.job={index,start:Date.now(),end:Date.now()+seconds*1000};queueSave();closeModal();render();startMineTimer();
  }
  function applyMineGravity(){
    const m=state.mine;let below=m.player+9;while(below<108&&m.revealed.includes(below)){m.player=below;below+=9}m.depth=tileDepth(m.player);if(Math.floor(m.player/9)===11)descendMineLayer();else if(checkMineGuard())toast(`${m.depth}层守卫出现，击败它才能继续下潜`);
  }
  function descendMineLayer(){
    const m=state.mine;m.floorOffset+=12;m.seed=(m.seed*17+31)%997;m.revealed=[4];m.player=4;m.depth=m.floorOffset+1;if(checkMineGuard())toast(`${m.depth}层守卫封住矿道，击败它才能继续下潜`);else toast(`重力坠落至地下 ${m.depth} 层，奖励进一步提高`);
  }
  function startMineTimer(){
    clearInterval(mineTimer);if(!state.mine.job)return;
    mineTimer=setInterval(()=>{if(!state.mine.job){clearInterval(mineTimer);return}if(Date.now()>=state.mine.job.end){completeMine();return}if(activeTab==='mine')render()},500);
  }
  function completeMine(){
    clearInterval(mineTimer);const m=state.mine,index=m.job.index,type=tileType(index),depth=tileDepth(index),wasFull=m.durability===m.maxDurability;if(!m.revealed.includes(index))m.revealed.push(index);m.job=null;m.durability=Math.max(0,m.durability-1);if(wasFull)m.lastDurabilityAt=Date.now();m.player=index;m.depth=depth;
    const base={gem:[180,2,0],chest:[650,7,1],enemy:[420,5,0],ore:[120,5,0],rock:[90,1,0]}[type],mult=1+depth*.06,gold=Math.ceil(base[0]*mult),stones=Math.ceil(base[1]*(1+depth*.012)),diamonds=base[2],tier=type==='gem'?gemTierForDepth(depth):0;state.gold+=gold;state.enhanceStones+=stones;state.ore+=type==='ore'?Math.ceil(4*(1+depth*.02)):0;state.gems+=diamonds;if(tier)state.socketGems[tier]++;applyMineGravity();queueSave();toast(`深度 ${depth} 收获：金币 +${gold}，强化石 +${stones}${tier?`，${['','Ⅰ','Ⅱ','Ⅲ'][tier]}阶宝石 +1`:''}${diamonds?`，血钻 +${diamonds}`:''}`);if(activeTab==='mine')render();
  }
  function useBomb(){
    if(state.mine.bombs<1||state.mine.job||state.mine.guardDepth)return;const targets=[];for(let i=0;i<108;i++)if(!state.mine.revealed.includes(i)&&canMine(i))targets.push(i);if(!targets.length)return;
    state.mine.bombs--;let foundGems=0;targets.forEach(i=>{state.mine.revealed.push(i);const depth=tileDepth(i),mult=1+depth*.06,tier=tileType(i)==='gem'?gemTierForDepth(depth):0;state.gold+=Math.ceil(60*mult);state.enhanceStones+=Math.ceil(1+depth*.008);if(tier){state.socketGems[tier]++;foundGems++}});const below=targets.find(i=>i===state.mine.player+9);state.mine.player=below??targets[0];applyMineGravity();queueSave();toast(`邻近爆破 ${targets.length} 格：获得强化石${foundGems?`，发现 ${foundGems} 枚宝石`:''}`);render();
  }
  function pickWeightedGrade(weights){
    let roll=Math.random()*weights.reduce((a,b)=>a+b,0);for(let g=0;g<weights.length;g++){roll-=weights[g];if(roll<=0)return g}return 0;
  }
  function effectivePoolRates(weights){
    const openGrades=new Set(state.poolUnlocked.map(id=>grade(heroIndex(id)))),effective=weights.map((weight,g)=>openGrades.has(g)?weight:0),total=effective.reduce((a,b)=>a+b,0)||1;return effective.map(weight=>weight/total*100);
  }
  function showSummonRates(){
    const gold=[70,23,6.5,.5,0,0],diamond=[5,38,32,17,7,1],currentGold=effectivePoolRates(gold),currentDiamond=effectivePoolRates(diamond),pool=state.poolUnlocked.map(id=>HERO_NAMES[heroIndex(id)]).join('、');
    showModal(`<h2 class="modal-title">点将概率</h2><div class="rate-sheet"><div class="rate-head"><b>品阶</b><b>金币基础</b><b>血钻基础</b><b>当前金币</b><b>当前血钻</b></div>${GRADE_NAMES.map((name,g)=>`<div><span>${name}</span><span>${gold[g]}%</span><span>${diamond[g]}%</span><span>${currentGold[g].toFixed(1)}%</span><span>${currentDiamond[g].toFixed(1)}%</span></div>`).join('')}</div><p class="rate-note">只会抽到已经进入卡池的英雄。尚未开放的品阶权重会被移除，其余已开放品阶按比例重新计算；同品阶内的每名英雄等概率。</p><div class="pool-list"><b>当前卡池</b><p>${pool}</p></div><div class="modal-actions"><button class="btn green" data-close>返回点将台</button></div>`);
  }
  function showRedeemCode(){
    showModal(`<h2 class="modal-title">兑换码</h2><div class="redeem-sheet"><p>输入兑换码领取单机测试版补给，同一存档中的每个兑换码只能使用一次。</p><input id="redeemInput" maxlength="24" autocomplete="off" placeholder="请输入兑换码"><small id="redeemMessage">兑换码不区分大小写</small></div><div class="modal-actions"><button class="btn dark" data-close>取消</button><button class="btn green" id="confirmRedeem">确认兑换</button></div>`);const confirm=$('#confirmRedeem');if(confirm)confirm.onclick=redeemEnteredCode;
  }
  function redeemEnteredCode(){
    const input=$('#redeemInput'),message=$('#redeemMessage'),code=(input?.value||'').trim().toUpperCase(),reward=REDEEM_CODES[code];
    if(!reward){if(message){message.textContent='兑换码无效，请检查后重试';message.className='error'}return false}
    if(state.redeemedCodes.includes(code)){if(message){message.textContent='该兑换码已经领取过了';message.className='error'}return false}
    if(reward.gems)state.gems+=reward.gems;if(reward.exp)state.exp+=reward.exp;state.redeemedCodes.push(code);save();const lines=[reward.gems?`血钻 +${reward.gems.toLocaleString()}`:'',reward.exp?`公共 EXP +${reward.exp.toLocaleString()}`:''].filter(Boolean);showModal(`<h2 class="modal-title">兑换成功</h2><div class="redeem-success"><i>${reward.exp?'EXP':'♦'}</i><b>${lines.join('<br>')}</b><small>${reward.label}</small></div><p>奖励已经加入当前本地存档。</p><div class="modal-actions"><button class="btn green" data-close data-rerender>确认领取</button></div>`);return true;
  }
  function showShop(message=''){
    const max=Math.floor(state.gold/STONE_PRICE);
    showModal(`<h2 class="modal-title">营地商店</h2><div class="shop-wallet"><span>● 金币 <b>${state.gold.toLocaleString()}</b></span><span>◆ 强化石 <b>${state.enhanceStones.toLocaleString()}</b></span></div><div class="shop-item"><i>◆</i><div><h3>装备强化石</h3><p>用于提升英雄装备强化等级</p><b>单价：● ${STONE_PRICE} / 个</b></div></div>${message?`<p class="shop-message">${message}</p>`:''}<div class="shop-quick">${[1,10,100].map(qty=>`<button class="btn ${qty===100?'orange':'green'}" data-buy-stones="${qty}" ${max<qty?'disabled':''}>购买 ${qty} 个<br><small>● ${(qty*STONE_PRICE).toLocaleString()}</small></button>`).join('')}<button class="btn dark" data-buy-stones="${Math.max(1,max)}" ${max<1?'disabled':''}>最大 ${max} 个<br><small>用完可用金币</small></button></div><div class="shop-custom"><input id="stoneAmount" type="number" min="1" max="${Math.max(1,max)}" value="${Math.min(10,Math.max(1,max))}" ${max<1?'disabled':''}><button class="btn green" id="buyCustomStones" ${max<1?'disabled':''}>按数量购买</button></div><small class="shop-rule">当前最多可购买 ${max.toLocaleString()} 个；购买后立即加入背包。</small><div class="modal-actions"><button class="btn dark" data-close data-rerender>离开商店</button></div>`);$$('[data-buy-stones]').forEach(button=>button.onclick=()=>buyEnhanceStones(Number(button.dataset.buyStones)));const custom=$('#buyCustomStones');if(custom)custom.onclick=()=>buyEnhanceStones(Number($('#stoneAmount')?.value));
  }
  function buyEnhanceStones(amount){
    const qty=Math.floor(Number(amount)),max=Math.floor(state.gold/STONE_PRICE);if(!Number.isFinite(qty)||qty<1){toast('请输入有效购买数量');return false}if(qty>max){toast(`金币不足，当前最多购买 ${max} 个`);return false}const cost=qty*STONE_PRICE;state.gold-=cost;state.enhanceStones+=qty;save();showShop(`购买成功：强化石 +${qty.toLocaleString()}，金币 -${cost.toLocaleString()}`);return true;
  }
  function rollSummonHero(pool){
    const isGold=pool==='gold';
    const weights=isGold?[70,23,6.5,.5,0,0]:[5,38,32,17,7,1],available=state.poolUnlocked.filter(id=>state.heroes[id]),effective=weights.map((weight,g)=>available.some(id=>grade(heroIndex(id))===g)?weight:0);let g=pickWeightedGrade(effective),candidates=available.filter(id=>grade(heroIndex(id))===g);
    const id=candidates[Math.floor(Math.random()*candidates.length)],i=heroIndex(id),p=state.heroes[id],isNew=!p.unlocked;g=grade(i);const fragments=10;
    if(isNew)p.unlocked=true;else p.fragments+=fragments;return{id,i,g,isNew,fragments};
  }
  function summonHero(pool,count=1){
    const isGold=pool==='gold',pulls=count===10?10:1,unitCost=isGold?3000:10,cost=unitCost*pulls;if(isGold?state.gold<cost:state.gems<cost)return;
    if(isGold)state.gold-=cost;else state.gems-=cost;const results=Array.from({length:pulls},()=>rollSummonHero(pool));queueSave();
    if(pulls===1){const result=results[0],{id,i,g,isNew,fragments}=result;showModal(`<div class="summon-reveal-sequence ${isGold?'gold-pull':'diamond-pull'} grade-${GRADE_CLASSES[g]}"><div class="summon-sky"><i class="summon-ring one"></i><i class="summon-ring two"></i><i class="summon-flash"></i><div class="modal-reveal">${heroSprite(id)}</div></div><h2 class="modal-title">${isNew?'新英雄响应召唤':'英魂再次响应'}</h2><p><b>${HERO_NAMES[i]}</b> · ${GRADE_NAMES[g]} · ${ROLE_NAMES[roleIndex(i)]}<br>${isNew?`个人技：${skillName(id)}`:`重复英雄转化为 ${fragments} 枚突破碎片`}</p><div class="summon-result-tag">${isNew?'NEW · 已收入英雄库':`碎片 +${fragments}`}</div><div class="modal-actions summon-confirm"><button class="btn green" data-close data-rerender>确认</button></div></div>`);}
    else{const newCount=results.filter(result=>result.isNew).length,totalFragments=results.filter(result=>!result.isNew).reduce((sum,result)=>sum+result.fragments,0);showModal(`<div class="ten-pull-reveal ${isGold?'gold-pull':'diamond-pull'}"><i class="ten-pull-flash"></i><h2 class="modal-title">十连召唤结果</h2><div class="ten-pull-grid">${results.map((result,index)=>`<div class="ten-pull-card grade-${GRADE_CLASSES[result.g]}" style="--delay:${index*.07}s">${heroSprite(result.id)}<b>${HERO_NAMES[result.i]}</b><small>${result.isNew?'NEW':`碎片 +${result.fragments}`}</small></div>`).join('')}</div><p>新英雄 ${newCount} 名 · 突破碎片 ${totalFragments} 枚</p><div class="modal-actions summon-confirm"><button class="btn green" data-close data-rerender>全部收入英雄库</button></div></div>`);}updateTop();
  }

  function adventureTick(){
    const gold=goldPerSecond(),exp=expPerSecond();state.gold+=gold;state.exp+=exp;recoverDurability();
    idleTicks++;updateTop();
    if(activeTab==='battle'&&adventureMode==='map'){
      const gain=$('#idleGain');if(gain)gain.textContent=`挂机：+${gold.toFixed(1)} 金/秒 · +${exp.toFixed(1)} EXP/秒`;
      const hit=$('.patrol-hit');if(hit){hit.classList.remove('pop');void hit.offsetWidth;hit.textContent=`+${Math.max(1,Math.floor(gold))}金`;hit.classList.add('pop')}
    }
    if(activeTab==='mine'&&idleTicks%5===0)render();
    if(idleTicks%10===0)save();
  }
  function startAdventureLoop(){clearInterval(adventureTimer);adventureTimer=setInterval(adventureTick,1000)}

  const TUTORIAL_STEPS=[
    ['序章 · 魔王城醒来','你在魔王城的传送阵中醒来。魔王把无数历史世界扭曲成领地，而第一道裂隙正通往群雄割据的三国时代。'],
    ['引导精灵 · 露米','“我是露米。我们的第一站叫作『魔临三国』。从黄巾之乱开始，击破被魔气控制的英雄，把他们逐步加入点将卡池。”'],
    ['第一名同伴','普通英雄「异界义勇·洛恩」加入队伍。探险队会持续清理小怪，金币和 EXP 都会进入公共资源栏；英雄不会自动升级。'],
    ['新手目标','进入英雄详情，手动消耗 EXP 提升等级。普通英雄从 1 级升至 10 级所需 EXP，约等于 1-1 挂机 5 分钟的收益；10 级后会解锁第二个出战栏位。']
  ];
  function showTutorial(){
    const index=state.tutorialStep||0;if(index>=TUTORIAL_STEPS.length)return;const [title,copy]=TUTORIAL_STEPS[index],last=index===TUTORIAL_STEPS.length-1;
    showModal(`<div class="story-panel"><img class="tutorial-fairy" src="assets/guide-fairy.png" alt="引导精灵露米"><div><small>引导精灵 露米</small><h2>${title}</h2><p>${copy}</p></div></div><div class="modal-actions"><button class="btn green" id="tutorialNext">${last?'开始收复异世界':'继续'}</button></div>`);
    setTimeout(()=>{const next=$('#tutorialNext');if(next)next.onclick=()=>{state.tutorialStep=index+1;queueSave();closeModal();if(!last)showTutorial();else{activeTab='battle';$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='battle'));render()}}},0);
  }

  function showModal(html){$('#modalRoot').innerHTML=`<div class="modal-backdrop"><div class="modal">${html}</div></div>`;$$('[data-close]').forEach(b=>b.onclick=()=>{const rerender=b.hasAttribute('data-rerender');closeModal();if(rerender)render()})}
  function closeModal(){$('#modalRoot').innerHTML=''}
  function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1900)}
  function claimBonus(){if(state.bonusDate===today()){toast('今日补给已经领取');return}state.bonusDate=today();state.gems+=20;state.gold+=2000;queueSave();toast('每日补给：血钻 +20，金币 +2K')}

  $$('.bottom-nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.tab));
  $('#bonusButton').onclick=claimBonus;
  window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
  const offline=processOffline();if(state.mine.job&&Date.now()>=state.mine.job.end)completeMine();else if(state.mine.job)startMineTimer();render();startAdventureLoop();save();
  if(state.tutorialStep<TUTORIAL_STEPS.length)setTimeout(showTutorial,180);
  else if(offline)setTimeout(()=>showModal(`<h2 class="modal-title">挂机收益</h2><p>离线 ${offline.minutes} 分钟，探险队持续清理魔王城外围。</p><div class="modal-actions"><span>● ${short(offline.gold)}</span><span>公共 EXP ${short(offline.exp)}</span></div><p>EXP 已进入公共资源栏，可前往英雄详情手动升级。</p><div class="modal-actions"><button class="btn green" data-close>全部领取</button></div>`),250);
})();
