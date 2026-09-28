const fs = require('fs');
const vm = require('vm');

class ElementMock {
  constructor() {
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.onclick = null;
    this.dataset = {};
    this.style = {};
    this.disabled = false;
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this.offsetWidth = 1;
    this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } };
  }
  hasAttribute() { return false; }
}

const elements = new Map();
const get = selector => {
  if (!elements.has(selector)) elements.set(selector, new ElementMock());
  return elements.get(selector);
};
const store = new Map();
const navButtons = ['home','battle','mine','arena','summon','heroes'].map(tab => {
  const button = new ElementMock();
  button.dataset.tab = tab;
  return button;
});

const context = {
  console,
  Date,
  Math,
  JSON,
  setTimeout,
  clearTimeout,
  setInterval() { return 0; },
  clearInterval() {},
  localStorage: {
    getItem(key) { return store.get(key) || null; },
    setItem(key, value) { store.set(key, value); }
  },
  document: {
    querySelector: get,
    querySelectorAll(selector) { return selector === '.bottom-nav button' ? navButtons : []; },
    addEventListener() {}
  },
  window: { addEventListener() {} }
};
vm.createContext(context);
const gameSource = fs.readFileSync(require.resolve('../game.js'), 'utf8');
const runtimeSource = gameSource.replace(/\}\)\(\);\s*$/, 'globalThis.__balance={state,teamStats,stagePower,skillFor,skillName,activeBonds,bondMultiplier,spriteStyle,formationPower};})();');
vm.runInContext(runtimeSource, context);

if (!store.has('ember_delvers_v3_sanguo')) throw new Error('Initial save was not created');
const initialState = JSON.parse(store.get('ember_delvers_v3_sanguo'));
if (initialState.formation.length !== 1) throw new Error('New game should start with one formation hero');
if (Object.values(initialState.heroes).filter(hero => hero.unlocked).length !== 1) throw new Error('New game should start with one unlocked hero');
if (!get('#screen').innerHTML.includes('home-page')) throw new Error('Home screen did not render');
navButtons.find(button => button.dataset.tab === 'heroes').onclick();
if (!get('#screen').innerHTML.includes('普通')) throw new Error('Grade-based hero screen did not render');
if (!get('#screen').innerHTML.includes('突破 +1')) throw new Error('Breakthrough control did not render');
if (!get('#screen').innerHTML.includes('10碎片')) throw new Error('Fixed 10-fragment breakthrough cost did not render');
if (!get('#screen').innerHTML.includes('公共 EXP')) throw new Error('Manual EXP leveling did not render');
if (!get('#screen').innerHTML.includes('强化石')) throw new Error('Enhancement-stone equipment upgrade did not render');
if (!get('#screen').innerHTML.includes('镶嵌宝石')) throw new Error('Gem socket control did not render');
if (!get('#screen').innerHTML.includes('羁绊 0/6')) throw new Error('Bond entry did not render');
if (get('#screen').innerHTML.includes('天公将军·张角')) throw new Error('Unowned heroes should be hidden');
get('#bondDetail').onclick();
if (!get('#modalRoot').innerHTML.includes('桃园结义') || !get('#modalRoot').innerHTML.includes('义贯山河')) throw new Error('Bond detail did not render');
navButtons.find(button => button.dataset.tab === 'battle').onclick();
if (!get('#screen').innerHTML.includes('adventure-map-page')) throw new Error('Adventure map did not render');
if (!get('#screen').innerHTML.includes('挂机：+')) throw new Error('Live exploration rewards did not render');
if (!get('#screen').innerHTML.includes('魔临三国')) throw new Error('Three Kingdoms chapter did not render');
get('#formulaHelp').onclick();
if (!get('#modalRoot').innerHTML.includes('普通型和百分比型可以被闪避')) throw new Error('Formula help did not render');
get('#challengeStage').onclick();
if (!get('#modalRoot').innerHTML.includes('乱世初啼')) throw new Error('Stage pre-battle story did not render');
get('#confirmStage').onclick();
if (!get('#screen').innerHTML.includes('team-hp')) throw new Error('Live battle HUD did not render');
if (!get('#screen').innerHTML.includes('playerArmy')) throw new Error('Battle formations did not render');
navButtons.find(button => button.dataset.tab === 'mine').onclick();
if (!get('#screen').innerHTML.includes('重力矿井')) throw new Error('Gravity mine did not render');
if (!get('#screen').innerHTML.includes('耐久已满')) throw new Error('Durability recovery did not render');
if (!get('#screen').innerHTML.includes('100/300/500层')) throw new Error('Gem depth rules did not render');
navButtons.find(button => button.dataset.tab === 'summon').onclick();
get('#goldSummon').onclick();
if (!get('#modalRoot').innerHTML.includes('summon-reveal-sequence')) throw new Error('Animated summon reveal did not render');
get('#summonRates').onclick();
if (!get('#modalRoot').innerHTML.includes('金币基础')) throw new Error('Summon probability table did not render');
navButtons.find(button => button.dataset.tab === 'summon').onclick();
get('#redeemCode').onclick();
if (!get('#modalRoot').innerHTML.includes('兑换码不区分大小写')) throw new Error('Redeem code panel did not render');
get('#redeemInput').value = 'pixel9999999';
get('#confirmRedeem').onclick();
if (!get('#modalRoot').innerHTML.includes('血钻 +9,999,999')) throw new Error('Redeem reward did not render');
if (context.__balance.state.gems !== 10000029 || !context.__balance.state.redeemedCodes.includes('PIXEL9999999')) throw new Error('Redeem code reward was not persisted');
navButtons.find(button => button.dataset.tab === 'summon').onclick();
get('#redeemCode').onclick();
get('#redeemInput').value = 'PIXEL9999999';
get('#confirmRedeem').onclick();
if (context.__balance.state.gems !== 10000029) throw new Error('Redeem code can be claimed more than once');
if (!gameSource.includes("name:'蚀星龙座'") || !fs.readFileSync(require.resolve('../progression.css'), 'utf8').includes('chapter2-map.png')) throw new Error('Chapter 2 content is missing');
if (!gameSource.includes('50000*Math.pow(1.5') || !gameSource.includes("kind:'mineGuard'")) throw new Error('Mine guard progression is missing');
if (!gameSource.includes('a.king+=s.king')) throw new Error('Team king must be summed');
const debug = context.__balance;
debug.state.heroes.h00.level = 100;
debug.state.heroes.h01.level = 1;
const solo = debug.teamStats(['h00']);
const withRecruit = debug.teamStats(['h00', 'h01']);
for (const key of ['power','def','dodge','speed','king']) {
  if (withRecruit[key] <= solo[key]) throw new Error(`Adding a living hero must increase ${key}`);
}
for (let i = 1; i < 30; i++) {
  const id = `h${String(i).padStart(2, '0')}`;
  debug.state.heroes[id].level = 1;
  const expanded = debug.teamStats(['h00', id]);
  for (const key of ['power','def','dodge','speed','king']) {
    if (expanded[key] <= solo[key]) throw new Error(`Adding ${id} must increase ${key}`);
  }
}
if (debug.stagePower(10) !== 76949) throw new Error('Stage 1-10 displayed power must equal its battle HP rating');
if (debug.skillFor('h13').chance !== 0.24) throw new Error('Grade must not multiply skill trigger probability');
if (debug.skillName('h04') !== '天下无双' || debug.skillName('h06') !== '青龙偃月') throw new Error('Chapter 1 signature skills are missing');
if (!debug.spriteStyle('h05').includes('pixel-heroes-a.png') || !debug.spriteStyle('h15').includes('pixel-heroes-b.png') || !debug.spriteStyle('h25').includes('pixel-heroes-c.png')) throw new Error('Unified pixel hero atlases are not wired');
const oath = debug.activeBonds(['h05','h06','h07']);
if (oath.length !== 1 || oath[0].id !== 'taoyuan' || Math.abs(debug.bondMultiplier(['h05','h06','h07']) - 1.12) > 1e-9) throw new Error('Peach Garden bond did not activate');
debug.state.formation = ['h05','h06','h07'];
debug.state.heroes.h05.level = 15;
debug.state.heroes.h06.level = 15;
debug.state.heroes.h07.level = 15;
const rawOathPower = ['h05','h06','h07'].reduce((sum,id) => sum + debug.teamStats([id]).power, 0);
if (debug.formationPower() !== Math.round(rawOathPower * 1.12)) throw new Error('Bond bonus is not reflected in displayed formation power');
if (!gameSource.includes("comboName:'义贯山河'") && !gameSource.includes("name:'义贯山河'")) throw new Error('Peach Garden combo is missing');
if (!gameSource.includes("name:'月下无双'")) throw new Error('Lu Bu and Diaochan combo is missing');
console.log('Runtime smoke test passed');
