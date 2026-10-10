/**
 * tcgCards.js — Conan TCG Card Pool, Sets & Rarity System
 * Fully generated pool matching actual card counts!
 */

/* ─── BOOSTER PACK SETS ───────────────────────────────────── */
export const TCG_SETS = [
  {
    id: 'CT-P01', code: '01',
    name: '探偵たちの切札', nameEn: 'The Detective’s Trump Card', nameTh: 'ไพ่ตายของเหล่านักสืบ',
    themeColor: '#3b82f6', secondaryColor: '#60a5fa', auraColor: 'rgba(59, 130, 246, 0.7)', bgOrb: 'rgba(37, 99, 235, 0.35)',
    packImg: 'img/pack-ctp04-gen.jpg', char: 'Conan Edogawa', featured: 'โคนัน เอโดงาวะ', desc: 'Vol.1 ชุดเปิดตัวยอดนักสืบจิ๋วโคนัน และคดีปริศนาแรก'
  },
  {
    id: 'CT-P02', code: '02',
    name: '西と東の大決戦', nameEn: 'The West & East Showdown', nameTh: 'ศึกตัดสินทิศตะวันตกและตะวันออก',
    themeColor: '#10b981', secondaryColor: '#34d399', auraColor: 'rgba(16, 185, 129, 0.75)', bgOrb: 'rgba(5, 150, 105, 0.35)',
    packImg: 'img/pack-ctp02.jpg', char: 'Heiji & Kaito Kid', featured: 'ฮัตโตริ เฮย์จิ & จอมโจรคิด', desc: 'Vol.2 ศึกปะทะแห่งทิศประจิมและบูรพา ยอดนักสืบ & จอมโจรคิด'
  },
  {
    id: 'CT-P03', code: '03',
    name: '黒影の襲来', nameEn: 'Invasion of Black Shadows', nameTh: 'การบุกจู่โจมของเงามืดชุดดำ',
    themeColor: '#8b5cf6', secondaryColor: '#ec4899', auraColor: 'rgba(139, 92, 246, 0.85)', bgOrb: 'rgba(109, 40, 217, 0.4)',
    packImg: 'img/pack-ctp03.png', char: 'Gin & Black Organization', featured: 'ยิน & องค์กรชุดดำ', desc: 'Vol.3 เงามืดจากองค์กรชุดดำ "ยิน" คืบคลานเข้าสู่การดวล'
  },
  {
    id: 'CT-P04', code: '04',
    name: '信義の絆', nameEn: 'Bonds of Trust', nameTh: 'สายใยแห่งความเชื่อใจ',
    themeColor: '#f59e0b', secondaryColor: '#f97316', auraColor: 'rgba(245, 158, 11, 0.8)', bgOrb: 'rgba(217, 119, 6, 0.35)',
    packImg: 'img/pack-ctp04-gen.jpg', char: 'Sato & Takagi', featured: 'หมวดซาโต้ & หมวดทาคางิ', desc: 'Vol.4 สายใยแห่งความยุติธรรมและความเชื่อใจของคู่หูตำรวจ'
  },
  {
    id: 'CT-P05', code: '05',
    name: '異次元の狙撃手', nameEn: 'Dimensional Sniper', nameTh: 'กระสุนมฤตยูเหนือมิติ',
    themeColor: '#dc2626', secondaryColor: '#ef4444', auraColor: 'rgba(220, 38, 38, 0.7)', bgOrb: 'rgba(185, 28, 28, 0.35)',
    packImg: 'img/pack-ctp05.jpg', char: 'Akai Shuichi', featured: 'อากาอิ ชูอิจิ', desc: 'Vol.5 กระสุนมฤตยูเหนือมิติ (Akai Shuichi)'
  },
  {
    id: 'CT-P06', code: '06',
    name: 'ゼロの執行人', nameEn: 'Zero the Enforcer', nameTh: 'ปฏิบัติการสายลับเดอะซีโร่',
    themeColor: '#fbbf24', secondaryColor: '#fcd34d', auraColor: 'rgba(251, 191, 36, 0.7)', bgOrb: 'rgba(245, 158, 11, 0.35)',
    packImg: 'img/pack-ctp06.jpg', char: 'Amuro Tooru', featured: 'อามุโร่ โทรุ', desc: 'Vol.6 ปฏิบัติการของสายลับความมั่นคง (Amuro Tooru)'
  },
  {
    id: 'CT-P07', code: '07',
    name: '紺青の拳', nameEn: 'The Fist of Blue Sapphire', nameTh: 'ศึกขุมทรัพย์อัญมณีสีคราม',
    themeColor: '#0ea5e9', secondaryColor: '#38bdf8', auraColor: 'rgba(14, 165, 233, 0.7)', bgOrb: 'rgba(2, 132, 199, 0.35)',
    packImg: 'img/pack-ctp07.jpg', char: 'Kaito Kid & Makoto', featured: 'จอมโจรคิด & เคียวโกคุ', desc: 'Vol.7 ศึกชิงอัญมณีล้ำค่า ณ สิงคโปร์'
  },
  {
    id: 'CT-P08', code: '08',
    name: '緋色の弾丸', nameEn: 'The Scarlet Bullet', nameTh: 'กระสุนสีเพลิง',
    themeColor: '#be123c', secondaryColor: '#e11d48', auraColor: 'rgba(190, 18, 60, 0.7)', bgOrb: 'rgba(159, 18, 57, 0.35)',
    packImg: 'img/pack-ctp08.jpg', char: 'Akai Family', featured: 'ครอบครัวอากาอิ', desc: 'Vol.8 รถไฟสุดไฮเทคและกระสุนสีเลือด'
  },
  {
    id: 'CT-P09', code: '09',
    name: 'ハロウィンの花嫁', nameEn: 'The Bride of Halloween', nameTh: 'เจ้าสาวฮาโลวีน',
    themeColor: '#d946ef', secondaryColor: '#e879f9', auraColor: 'rgba(217, 70, 239, 0.7)', bgOrb: 'rgba(192, 38, 211, 0.35)',
    packImg: 'img/pack-ctp09.jpg', char: 'Police Academy', featured: 'ห้าพยัคฆ์นักเรียนตำรวจ', desc: 'Vol.9 งานวิวาห์มรณะและสายใยตำรวจ'
  },
  {
    id: 'CT-P10', code: '10',
    name: '黒鉄の魚影', nameEn: 'Black Iron Submarine', nameTh: 'มฤตยูใต้น้ำสีดำ',
    themeColor: '#0f766e', secondaryColor: '#14b8a6', auraColor: 'rgba(15, 118, 110, 0.7)', bgOrb: 'rgba(17, 94, 89, 0.35)',
    packImg: 'img/pack-ctp01.png', char: 'Haibara Ai', featured: 'ไฮบาระ & องค์กรชุดดำ', desc: 'Vol.10 ปะทะองค์กรชุดดำใต้ทะเลลึก'
  }
];

/* ─── RARITY DEFINITIONS ──────────────────────────────────── */
export const RARITIES = {
  C: { id: 'C', label: 'Common', short: 'C', color: '#94a3b8', glow: 'rgba(148,163,184,0.2)', holographic: false, particles: false, shake: false, border: 'rgba(148,163,184,0.25)', badgeBg: 'rgba(148,163,184,0.15)' },
  CP: { id: 'CP', label: 'Character Plus', short: 'CP', color: '#ec4899', glow: 'rgba(236,72,153,0.3)', holographic: true, particles: false, shake: false, border: 'rgba(236,72,153,0.35)', badgeBg: 'rgba(236,72,153,0.15)' },
  CP2: { id: 'CP2', label: 'Character Plus 2', short: 'CP2', color: '#f43f5e', glow: 'rgba(244,63,94,0.3)', holographic: true, particles: true, shake: false, border: 'rgba(244,63,94,0.35)', badgeBg: 'rgba(244,63,94,0.15)' },
  R: { id: 'R', label: 'Rare', short: 'R', color: '#38bdf8', glow: 'rgba(56,189,248,0.35)', holographic: false, particles: false, shake: false, border: 'rgba(56,189,248,0.3)', badgeBg: 'rgba(56,189,248,0.15)' },
  RP: { id: 'RP', label: 'Rare Parallel', short: 'RP', color: '#7dd3fc', glow: 'rgba(125,211,252,0.45)', holographic: true, particles: false, shake: false, border: 'rgba(125,211,252,0.4)', badgeBg: 'rgba(125,211,252,0.15)' },
  SR: { id: 'SR', label: 'Super Rare', short: 'SR', color: '#a855f7', glow: 'rgba(168,85,247,0.45)', holographic: true, particles: false, shake: false, border: 'rgba(168,85,247,0.4)', badgeBg: 'rgba(168,85,247,0.15)' },
  SRP: { id: 'SRP', label: 'SR Parallel', short: 'SRP', color: '#d8b4fe', glow: 'rgba(216,180,254,0.5)', holographic: true, particles: true, shake: false, border: 'rgba(216,180,254,0.45)', badgeBg: 'rgba(216,180,254,0.15)' },
  SRCP: { id: 'SRCP', label: 'SR Character Plus', short: 'SRCP', color: '#d946ef', glow: 'rgba(217,70,239,0.5)', holographic: true, particles: true, shake: false, border: 'rgba(217,70,239,0.45)', badgeBg: 'rgba(217,70,239,0.15)' },
  MR: { id: 'MR', label: 'Master Rare', short: 'MR', color: '#f59e0b', glow: 'rgba(245,158,11,0.5)', holographic: true, particles: true, shake: false, border: 'rgba(245,158,11,0.45)', badgeBg: 'rgba(245,158,11,0.15)' },
  MRP: { id: 'MRP', label: 'Master Rare Parallel', short: 'MRP', color: '#fcd34d', glow: 'rgba(252,211,77,0.6)', holographic: true, particles: true, shake: false, border: 'rgba(252,211,77,0.5)', badgeBg: 'rgba(252,211,77,0.15)' },
  MRCP: { id: 'MRCP', label: 'MR Character Plus', short: 'MRCP', color: '#fb923c', glow: 'rgba(251,146,60,0.6)', holographic: true, particles: true, shake: false, border: 'rgba(251,146,60,0.5)', badgeBg: 'rgba(251,146,60,0.15)' },
  SEC: { id: 'SEC', label: 'Secret', short: 'SEC', color: '#fff', glow: 'rgba(255,255,255,0.6)', holographic: true, particles: true, shake: true, border: 'rgba(255,255,255,0.5)', badgeBg: 'transparent', rainbow: true },
  SECSign: { id: 'SECSign', label: 'Secret Sign', short: 'SEC★', color: '#fff', glow: 'rgba(255,255,255,0.8)', holographic: true, particles: true, shake: true, border: 'rgba(255,255,255,0.8)', badgeBg: 'transparent', rainbow: true }
};

/* ─── HANDCRAFTED HIGHLIGHT CARDS ─────────────────────────── */
const CUSTOM_CARDS = [
  /* ═══════════ SET CT-P01 ═══════════ */
  { id:'ct001', num:'001', name:'Inspector Megure', nameEn:'Inspector Megure', set:'CT-P01', rarity:'C',   color1:'#1e3a5f', color2:'#0f2040', emoji:'' },
  { id:'ct002', num:'002', name:'Dr. Agasa',        nameEn:'Dr. Agasa',       set:'CT-P01', rarity:'C',   color1:'#2d4a1e', color2:'#162310', emoji:'‍' },
  { id:'ct003', num:'003', name:'Genta Kojima',     nameEn:'Genta Kojima',    set:'CT-P01', rarity:'C',   color1:'#3d1e1e', color2:'#1a0a0a', emoji:'' },
  { id:'ct004', num:'004', name:'Ayumi Yoshida',    nameEn:'Ayumi Yoshida',   set:'CT-P01', rarity:'C',   color1:'#3d1e3d', color2:'#1a0a1a', emoji:'' },
  { id:'ct005', num:'005', name:'Mitsuhiko Tsuburaya', nameEn:'Mitsuhiko',   set:'CT-P01', rarity:'C',   color1:'#1e3d2e', color2:'#0a1a14', emoji:'' },
  { id:'ct006', num:'006', name:'Sonoko Suzuki',    nameEn:'Sonoko Suzuki',   set:'CT-P01', rarity:'C',   color1:'#3d2e1e', color2:'#1a1408', emoji:'' },
  { id:'ct007', num:'007', name:'Ran Mouri',        nameEn:'Ran Mouri',       set:'CT-P01', rarity:'R',   color1:'#1a2e4a', color2:'#0a1828', emoji:'' },
  { id:'ct008', num:'008', name:'Kogoro Mouri',     nameEn:'Kogoro Mouri',    set:'CT-P01', rarity:'R',   color1:'#2a1a3a', color2:'#150d20', emoji:'' },
  { id:'ct009', num:'009', name:'Conan Edogawa',    nameEn:'Conan Edogawa',   set:'CT-P01', rarity:'SR',  color1:'#1e3a8a', color2:'#0f172a', emoji:'' },
  { id:'ct010', num:'010', name:'Conan: Crimson Bowtie', nameEn:'Conan Bowtie', set:'CT-P01', rarity:'SRP', color1:'#991b1b', color2:'#450a0a', emoji:'' },
  { id:'ct011', num:'011', name:'Conan & Ran: Irreplaceable', nameEn:'Conan & Ran', set:'CT-P01', rarity:'CP', color1:'#831843', color2:'#500724', emoji:'' },
  { id:'ct012', num:'012', name:'Conan: The Silver Bullet', nameEn:'Silver Bullet Conan', set:'CT-P01', rarity:'SEC', color1:'#eab308', color2:'#7f1d1d', emoji:'' },

  /* ═══════════ SET CT-P02 ═══════════ */
  { id:'ct013', num:'013', name:'Kazuha Toyama',    nameEn:'Kazuha Toyama',   set:'CT-P02', rarity:'C',   color1:'#14532d', color2:'#052e16', emoji:'' },
  { id:'ct014', num:'014', name:'Ginshiro Toyama',  nameEn:'Ginshiro Toyama', set:'CT-P02', rarity:'C',   color1:'#1e293b', color2:'#0f172a', emoji:'️' },
  { id:'ct015', num:'015', name:'Makoto Kyogoku',   nameEn:'Makoto Kyogoku',  set:'CT-P02', rarity:'R',   color1:'#1e1e3a', color2:'#0a0a1e', emoji:'' },
  { id:'ct016', num:'016', name:'Subaru Okiya',     nameEn:'Subaru Okiya',    set:'CT-P02', rarity:'R',   color1:'#1a2e2e', color2:'#0a1818', emoji:'' },
  { id:'ct017', num:'017', name:'Ai Haibara',       nameEn:'Ai Haibara',      set:'CT-P02', rarity:'SR',  color1:'#2a0a3a', color2:'#150420', emoji:'' },
  { id:'ct018', num:'018', name:'Heiji Hattori',    nameEn:'Heiji Hattori',   set:'CT-P02', rarity:'SR',  color1:'#166534', color2:'#052e16', emoji:'' },
  { id:'ct019', num:'019', name:'Kaito Kid: Moonlight Magician', nameEn:'Kaito Kid Moon', set:'CT-P02', rarity:'SRP', color1:'#065f46', color2:'#022c22', emoji:'' },
  { id:'ct020', num:'020', name:'Heiji & Conan: West Meets East', nameEn:'West & East Duo', set:'CT-P02', rarity:'SRP', color1:'#047857', color2:'#064e3b', emoji:'️' },
  { id:'ct021', num:'021', name:'Kaito Kid & Conan', nameEn:'Kid & Conan Rivals', set:'CT-P02', rarity:'CP', color1:'#0d9488', color2:'#134e4a', emoji:'' },
  { id:'ct022', num:'022', name:'Kaito Kid: 1412 Miracle', nameEn:'Kid 1412 Miracle', set:'CT-P02', rarity:'SEC', color1:'#0f766e', color2:'#042f2e', emoji:'️' },

  /* ═══════════ SET CT-P03 ═══════════ */
  { id:'ct023', num:'023', name:'Vodka',            nameEn:'Vodka',           set:'CT-P03', rarity:'C',   color1:'#18181b', color2:'#09090b', emoji:'️' },
  { id:'ct024', num:'024', name:'Tequila',          nameEn:'Tequila',         set:'CT-P03', rarity:'C',   color1:'#27272a', color2:'#18181b', emoji:'' },
  { id:'ct025', num:'025', name:'Chianti',          nameEn:'Chianti',         set:'CT-P03', rarity:'R',   color1:'#4c0519', color2:'#2e020d', emoji:'' },
  { id:'ct026', num:'026', name:'Korn',             nameEn:'Korn',            set:'CT-P03', rarity:'R',   color1:'#312e81', color2:'#1e1b4b', emoji:'' },
  { id:'ct027', num:'027', name:'Vermouth: A Secret', nameEn:'Vermouth Secret', set:'CT-P03', rarity:'SR',  color1:'#581c87', color2:'#3b0764', emoji:'' },
  { id:'ct028', num:'028', name:'Shuichi Akai: Silver Bullet', nameEn:'Akai Sniper', set:'CT-P03', rarity:'SR', color1:'#3b0764', color2:'#18181b', emoji:'' },
  { id:'ct029', num:'029', name:'Bourbon: Triple Face', nameEn:'Bourbon Furuya', set:'CT-P03', rarity:'SRP', color1:'#701a75', color2:'#4a044e', emoji:'' },
  { id:'ct030', num:'030', name:'Gin: Black Syndicate Executioner', nameEn:'Gin Executioner', set:'CT-P03', rarity:'SRP', color1:'#3f3f46', color2:'#18181b', emoji:'️' },
  { id:'ct031', num:'031', name:'Gin & Vermouth: Dark Syndicate', nameEn:'Gin & Vermouth', set:'CT-P03', rarity:'CP', color1:'#6b21a8', color2:'#1e1b4b', emoji:'' },
  { id:'ct032', num:'032', name:'Gin: Nightmare in the Fog', nameEn:'Gin Nightmare SEC', set:'CT-P03', rarity:'SEC', color1:'#4c1d95', color2:'#020617', emoji:'️' },

  /* ═══════════ SET CT-P04 ═══════════ */
  { id:'ct033', num:'033', name:'Kazunobu Chiba',   nameEn:'Chiba Police',    set:'CT-P04', rarity:'C',   color1:'#451a03', color2:'#1c1917', emoji:'' },
  { id:'ct034', num:'034', name:'Yumi Miyamoto',    nameEn:'Yumi Traffic Police', set:'CT-P04', rarity:'C', color1:'#7c2d12', color2:'#292524', emoji:'' },
  { id:'ct035', num:'035', name:'Ninzaburo Shiratori', nameEn:'Inspector Shiratori', set:'CT-P04', rarity:'R', color1:'#78350f', color2:'#1c1917', emoji:'' },
  { id:'ct036', num:'036', name:'Masumi Sera',      nameEn:'Masumi Sera',     set:'CT-P04', rarity:'SR',  color1:'#9a3412', color2:'#431407', emoji:'' },
  { id:'ct037', num:'037', name:'Wataru Takagi',    nameEn:'Takagi Detective', set:'CT-P04', rarity:'SR', color1:'#b45309', color2:'#78350f', emoji:'️' },
  { id:'ct038', num:'038', name:'Miwako Sato',      nameEn:'Sato Detective',  set:'CT-P04', rarity:'SR',  color1:'#c2410c', color2:'#7c2d12', emoji:'' },
  { id:'ct039', num:'039', name:'Sato & Takagi: Bonds of Justice', nameEn:'Sato & Takagi Bonds', set:'CT-P04', rarity:'SRP', color1:'#d97706', color2:'#92400e', emoji:'' },
  { id:'ct040', num:'040', name:'Metropolitan Police Duo', nameEn:'Police Duo CP', set:'CT-P04', rarity:'CP', color1:'#ea580c', color2:'#9a3412', emoji:'' },
  { id:'ct041', num:'041', name:'Sato & Takagi: Eternal Partner', nameEn:'Sato & Takagi SEC', set:'CT-P04', rarity:'SEC', color1:'#f59e0b', color2:'#78350f', emoji:'' },
  { id:'ct042', num:'042', name:'Yuya Kazami: PSB', nameEn:'Yuya Kazami',     set:'CT-P04', rarity:'R',   color1:'#854d0e', color2:'#422006', emoji:'' },
];

/* ─── DYNAMIC CARD GENERATOR ──────────────────────────────── */
// The actual requested distribution sizes for the sets!
const SET_RARITY_COUNTS = {
  'CT-P01': { C:75, CP:40, CP2:0, R:16, RP:10, SR:11, MR:0, SRP:6, SRCP:0, MRP:0, MRCP:0, SEC:1, SECSign:1 },
  'CT-P02': { C:66, CP:34, CP2:0, R:14, RP:11, SR:11, MR:0, SRP:9, SRCP:0, MRP:0, MRCP:0, SEC:2, SECSign:2 },
  'CT-P03': { C:108, CP:37, CP2:0, R:19, RP:15, SR:11, MR:0, SRP:9, SRCP:2, MRP:0, MRCP:0, SEC:2, SECSign:2 },
  'CT-P04': { C:65, CP:27, CP2:0, R:20, RP:10, SR:11, MR:0, SRP:9, SRCP:2, MRP:0, MRCP:0, SEC:2, SECSign:2 },
  'CT-P05': { C:91, CP:38, CP2:0, R:16, RP:8, SR:7, MR:6, SRP:10, SRCP:1, MRP:6, MRCP:1, SEC:2, SECSign:2 },
  'CT-P06': { C:69, CP:42, CP2:0, R:24, RP:16, SR:8, MR:6, SRP:6, SRCP:2, MRP:5, MRCP:1, SEC:2, SECSign:2 },
  'CT-P07': { C:70, CP:34, CP2:0, R:20, RP:16, SR:8, MR:6, SRP:8, SRCP:1, MRP:6, MRCP:2, SEC:2, SECSign:2 },
  'CT-P08': { C:41, CP:9, CP2:0, R:24, RP:13, SR:7, MR:6, SRP:6, SRCP:1, MRP:6, MRCP:1, SEC:2, SECSign:2 },
  'CT-P09': { C:80, CP:38, CP2:1, R:19, RP:15, SR:8, MR:6, SRP:9, SRCP:2, MRP:6, MRCP:0, SEC:2, SECSign:2 },
  'CT-P10': { C:66, CP:28, CP2:0, R:21, RP:14, SR:8, MR:6, SRP:11, SRCP:1, MRP:7, MRCP:0, SEC:2, SECSign:2 },
};

export const CARD_POOL = [...CUSTOM_CARDS];

Object.entries(SET_RARITY_COUNTS).forEach(([setId, counts]) => {
  let currentCardIndex = CARD_POOL.filter(c => c.set === setId).length + 1;

  Object.entries(counts).forEach(([rarity, targetCount]) => {
    // How many cards of this rarity we already have handcrafted
    const existing = CARD_POOL.filter(c => c.set === setId && c.rarity === rarity).length;
    const toGenerate = targetCount - existing;

    for (let i = 0; i < toGenerate; i++) {
      const numStr = String(currentCardIndex).padStart(3, '0');
      CARD_POOL.push({
        id: `${setId.toLowerCase().replace('-', '')}_${rarity.toLowerCase()}_${numStr}`,
        num: numStr,
        name: `Unknown Character [${rarity}]`,
        nameEn: `Character ${numStr}`,
        set: setId,
        rarity: rarity,
        color1: '#1e293b',
        color2: '#0f172a',
        emoji: '️',
      });
      currentCardIndex++;
    }
  });
});


/* ─── PULL WEIGHTS (Drop Rates) ───────────────────────────────
   Scaled so total = 989 ≈ 100%. Each unit ≈ 0.101%
   C     35.2%  → 352
   R     25.0%  → 250
   CP    12.0%  → 120
   RP     8.0%  →  80
   D      6.0%  →  60
   SR     5.0%  →  50
   MR     3.0%  →  30
   SRP    2.0%  →  20
   MRP    1.2%  →  12
   SRCP   0.8%  →   8
   MRCP   0.6%  →   6
   SEC    0.1%  →   1
   ─────────────────────────────────────────────────────────── */
const WEIGHTS = {
  C:    352,
  R:    250,
  CP:   120,
  RP:    80,
  D:     60,
  SR:    50,
  MR:    30,
  SRP:   20,
  MRP:   12,
  SRCP:   8,
  MRCP:   6,
  SEC:    1,
  SECSign: 1,
};

/**
 * Draw cards from a specific set
 * Guaranteed at least 1 holographic in the 5 cards!
 */
export function drawCards(n = 5, targetSet = 'CT-P01', pityState = null) {
  let pool = CARD_POOL.filter(c => c.set === targetSet);
  if (!pool.length) pool = CARD_POOL;

  const PURPLE_RAR = ['SR', 'MR'];
  const GOLD_RAR = ['SRP', 'MRP', 'SRCP', 'MRCP'];
  const RED_RAR = ['SEC', 'SECSign'];

  const results = [];
  for (let i = 0; i < n; i++) {
    let pickPool = pool;
    let forceRarities = null;

    if (pityState && i === 0) { // Apply pity on the first card of the pack if triggered
      if (pityState.red >= 300) { forceRarities = RED_RAR; }
      else if (pityState.gold >= 20) { forceRarities = GOLD_RAR; }
      else if (pityState.purple >= 10) { forceRarities = PURPLE_RAR; }
    }

    if (forceRarities) {
      pickPool = pool.filter(c => forceRarities.includes(c.rarity));
      if (!pickPool.length) pickPool = pool;
    } else if (i === n - 1 && !results.some(c => RARITIES[c.rarity] && RARITIES[c.rarity].holographic)) {
      pickPool = pool.filter(c => RARITIES[c.rarity] && RARITIES[c.rarity].holographic);
    }

    const activePool = pickPool.length ? pickPool : pool;
    const totalW = activePool.reduce((s, c) => s + (WEIGHTS[c.rarity] || 10), 0);
    let r = Math.random() * totalW;

    for (const card of activePool) {
      r -= (WEIGHTS[card.rarity] || 10);
      if (r <= 0) { results.push(card); break; }
    }
    if (results.length <= i) results.push(activePool[0]);

    // Reset pity if pulled naturally (or forced)
    if (pityState) {
      const pulled = results[results.length - 1].rarity;
      if (RED_RAR.includes(pulled)) { pityState.red = 0; pityState.gold = 0; pityState.purple = 0; }
      else if (GOLD_RAR.includes(pulled)) { pityState.gold = 0; pityState.purple = 0; }
      else if (PURPLE_RAR.includes(pulled)) { pityState.purple = 0; }
    }
  }
  return results;
}
