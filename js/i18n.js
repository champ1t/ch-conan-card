/**
 * i18n — TH/EN Professional Translation
 * CH.จุ่มการ์ดโคนัน Brand Website
 * Written by a bilingual professional copywriter
 */

let _lang = localStorage.getItem('cl_lang') || 'th';
const _listeners = new Set();

export const TRANSLATIONS = {
  /* ── NAV ─────────────────────────────────────────────── */
  nav_home:           { th: 'หน้าหลัก',       en: 'Home' },
  nav_shop:           { th: 'ร้านค้า',          en: 'Shop' },
  nav_live:           { th: 'ไลฟ์สด',          en: 'Live' },
  nav_highlights:     { th: 'ไฮไลท์',           en: 'Highlights' },
  nav_track:          { th: 'ติดตามพัสดุ',      en: 'Track Order' },
  nav_daily:          { th: 'เช็คจุ่มรายวัน', en: 'Daily Pull' },
  nav_store:          { th: 'AI Store',       en: 'AI Store' },
  nav_jumm:           { th: '⚡ JUMM',         en: '⚡ JUMM' },
  nav_join_drop:      { th: 'จองจุ่ม',    en: 'Book Drop' },
  nav_admin:          { th: 'ลงชื่อเข้าใช้',           en: 'Login' },

  /* ── HERO ────────────────────────────────────────────── */
  hero_eyebrow:       { th: 'Official Card Store · ของแท้ทุกชิ้น',  en: 'Official Card Store · Authentic Every Piece' },
  hero_title:         { th: 'CH.จุ่มการ์ดโคนัน',                    en: 'CH.จุ่มการ์ดโคนัน' },
  hero_subtitle:      { th: 'ซื้อ ลุ้น สะสม การ์ดโคนันหายาก\nชม Live เปิดการ์ดสด และดูไฮไลท์ Rare Pull', en: 'Buy, collect & chase rare Conan cards.\nWatch live pack openings and epic rare pull highlights.' },
  hero_cta_shop:      { th: 'เลือกซื้อเลย',    en: 'Shop Now' },
  hero_cta_drop:      { th: 'จองจุ่ม',    en: 'Book Drop' },
  hero_stat_orders:   { th: 'คำสั่งซื้อ',       en: 'Orders' },
  hero_stat_drops:    { th: 'Drop Sessions',     en: 'Drop Sessions' },
  hero_stat_live:     { th: 'ทุกสัปดาห์',       en: 'Weekly' },
  hero_scroll:        { th: 'เลื่อนลง',          en: 'Scroll' },

  /* ── FEATURES ────────────────────────────────────────── */
  feat_drop_title:    { th: 'ระบบจุ่มการ์ด',        en: 'Card Drop System' },
  feat_drop_desc:     { th: 'จองเลข เปิดพร้อมกัน',  en: 'Book a number, open together' },
  feat_live_title:    { th: 'ไลฟ์เปิดการ์ด',         en: 'Live Pack Opening' },
  feat_live_desc:     { th: 'ชมสด ลุ้นพร้อมกัน',    en: 'Watch live, pull together' },
  feat_result_title:  { th: 'ผลการเปิดการ์ด',        en: 'Opening Results' },
  feat_result_desc:   { th: 'อัปเดตทันที หลังเปิด',  en: 'Instant updates after every drop' },
  feat_ship_title:    { th: 'จัดส่งรวดเร็ว',          en: 'Fast Shipping' },
  feat_ship_desc:     { th: 'ส่งทั่วไทย',              en: 'Nationwide delivery' },

  /* ── FEATURED PRODUCTS ───────────────────────────────── */
  featured_eyebrow:   { th: 'สินค้าแนะนำ',             en: 'Featured' },
  featured_title:     { th: 'สินค้าแนะนำ',             en: 'Featured Products' },
  featured_see_all:   { th: 'ดูทั้งหมด →',              en: 'See All →' },
  product_packs_label:{ th: 'ข้อมูลกล่อง',              en: 'Box Info' },
  product_view:       { th: 'ดูรายละเอียด',             en: 'View Details' },
  available:          { th: 'พร้อมจำหน่าย',             en: 'In Stock' },
  soldout:            { th: 'สินค้าหมด',                en: 'Sold Out' },
  preorder:           { th: 'พรีออเดอร์',               en: 'Pre-Order' },

  /* ── CATEGORIES ──────────────────────────────────────── */
  cat_eyebrow:        { th: 'เลือกซื้อตามหมวด',         en: 'Categories' },
  cat_title:          { th: 'เลือกซื้อตามหมวดหมู่',    en: 'Shop by Category' },
  cat_all:            { th: 'ทั้งหมด',                  en: 'All' },
  cat_cards:          { th: 'การ์ด',                    en: 'Cards' },
  cat_cards_count:    { th: '200+ ใบ',                  en: '200+ Singles' },
  cat_boxes:          { th: 'กล่อง',                    en: 'Boxes' },
  cat_boxes_count:    { th: '10+ Series',               en: '10+ Series' },
  cat_packs:          { th: 'แพ็ค',                     en: 'Packs' },
  cat_packs_count:    { th: '50+ แพ็ค',                 en: '50+ Packs' },
  cat_other:          { th: 'อื่นๆ',                    en: 'Accessories' },
  cat_other_count:    { th: 'Accessories',              en: 'Sleeves & More' },

  /* ── LIVE ─────────────────────────────────────────────── */
  live_eyebrow:       { th: 'ไลฟ์สด',                   en: 'Live' },
  live_title:         { th: 'ไลฟ์ล่าสุด',               en: 'Latest Live Sessions' },
  live_see_all:       { th: 'ดูทั้งหมด →',               en: 'See All →' },
  live_coming:        { th: 'ยังไม่มี Live ขณะนี้',      en: 'No live session at the moment' },
  live_coming_desc:   { th: 'ติดตาม Live เปิดการ์ดสดทุกสัปดาห์บน Facebook & YouTube', en: 'Follow us for weekly live pack openings on Facebook & YouTube' },
  live_watch_btn:     { th: 'เข้าชม Live',              en: 'Watch Live' },
  live_facebook:      { th: 'Facebook Live',             en: 'Facebook Live' },
  live_recent:        { th: 'RECENT LIVES',              en: 'RECENT LIVES' },

  /* ── HIGHLIGHTS ──────────────────────────────────────── */
  hl_eyebrow:         { th: 'ไฮไลท์',                   en: 'Highlights' },
  hl_title:           { th: 'ไฮไลท์ & Rare Pull',       en: 'Highlights & Rare Pulls' },
  hl_see_all:         { th: 'ดูทั้งหมด →',               en: 'See All →' },

  /* ── CARD SHOWCASE ───────────────────────────────────── */
  cards_eyebrow:      { th: 'Card Showcase',             en: 'Card Showcase' },
  cards_title:        { th: 'การ์ดสุดหายาก',             en: 'Rare Card Collection' },
  cards_see_all:      { th: 'ดูทั้งหมด →',               en: 'See All →' },

  /* ── BOX SHOWCASE ────────────────────────────────────── */
  boxes_eyebrow:      { th: 'Box Showcase',              en: 'Box Showcase' },
  boxes_title:        { th: 'กล่องการ์ดทั้งหมด',         en: 'Card Boxes' },
  boxes_see_all:      { th: 'ดูทั้งหมด →',               en: 'See All →' },

  /* ── TRACK ORDER ─────────────────────────────────────── */
  track_eyebrow:      { th: 'ติดตามคำสั่งซื้อ',          en: 'Track Order' },
  track_title:        { th: 'ติดตามคำสั่งซื้อ',          en: 'Track Your Order' },
  track_desc:         { th: 'ค้นหาด้วยเบอร์โทรหรือ Tracking Number ไม่ต้องสมัครสมาชิก', en: 'Look up your order using your phone number or tracking number — no account needed.' },
  track_tab_phone:    { th: 'เบอร์โทรศัพท์',             en: 'Phone Number' },
  track_tab_tracking: { th: 'Tracking Number',           en: 'Tracking Number' },
  track_ph_phone:     { th: 'กรอกเบอร์โทรศัพท์ เช่น 0812345678', en: 'e.g. 0812345678' },
  track_ph_tracking:  { th: 'กรอก Tracking Number เช่น TH123456789TH', en: 'e.g. TH123456789TH' },
  track_search_btn:   { th: '🔍 ค้นหา',                  en: '🔍 Search' },
  track_label_phone:  { th: 'เบอร์โทรศัพท์',             en: 'Phone Number' },
  track_label_track:  { th: 'Tracking Number',           en: 'Tracking Number' },
  track_full_page:    { th: 'ไปหน้าติดตามพัสดุเต็มๆ →', en: 'Go to full tracking page →' },
  track_searching:    { th: 'กำลังค้นหา...',              en: 'Searching...' },
  track_not_found:    { th: 'ไม่พบข้อมูล',                en: 'No results found' },
  track_not_found_hint: { th: 'ลองใช้ข้อมูลสำหรับทดสอบ:', en: 'Try the demo number:' },
  track_no_input:     { th: 'กรุณากรอกข้อมูลก่อนค้นหา',  en: 'Please enter your search term first.' },

  /* ── STATUS TIMELINE ─────────────────────────────────── */
  status_confirmed:   { th: 'ยืนยันคำสั่งซื้อ',          en: 'Order Confirmed' },
  status_packed:      { th: 'แพ็คสินค้าแล้ว',            en: 'Packed & Ready' },
  status_shipped:     { th: 'จัดส่งแล้ว',                 en: 'Shipped' },
  status_transit:     { th: 'กำลังจัดส่ง',                en: 'In Transit' },
  status_delivered:   { th: 'ส่งสำเร็จ',                  en: 'Delivered' },

  /* ── ABOUT ───────────────────────────────────────────── */
  about_eyebrow:      { th: 'เกี่ยวกับร้าน',              en: 'About Us' },
  about_title:        { th: 'เกี่ยวกับ\nCH.จุ่มการ์ดโคนัน', en: 'About\nCH.Conan Card' },
  about_desc:         { th: 'ร้านจำหน่ายการ์ดสะสมโคนันแบบออฟฟิเชียล พร้อมระบบจุ่มการ์ดออนไลน์ที่เปิด Live สดทุกสัปดาห์ ให้แฟนๆ ได้ลุ้น Rare Card ไปพร้อมกัน ซื้อการ์ด กล่อง แพ็ค หรือสะสมแบบเดี่ยวก็ได้ครับ', en: 'Your official destination for Detective Conan trading cards. We host weekly live pack-opening drops where fans can join the excitement together — whether you\'re hunting a specific rare, building your collection, or grabbing a full box.' },
  about_line:         { th: 'ติดต่อ',              en: 'Contact' },
  about_drop:         { th: '🎴 จองจุ่ม',            en: '🎴 Book Drop' },
  about_tag_1:        { th: 'การ์ดโคนัน',                  en: 'Conan Cards' },
  about_tag_2:        { th: 'จุ่มการ์ด',                   en: 'Card Drop System' },
  about_tag_3:        { th: 'Live Opening',               en: 'Live Opening' },
  about_tag_4:        { th: 'Rare Pull',                  en: 'Rare Pull' },
  about_tag_5:        { th: 'ส่งทั่วไทย',                  en: 'Nationwide Shipping' },
  about_tag_6:        { th: 'ของแท้ 100%',                en: '100% Authentic' },

  /* ── FOOTER ──────────────────────────────────────────── */
  footer_brand_desc:  { th: 'ร้านการ์ดสะสมโคนัน — ซื้อ ลุ้น เก็บสะสม\nLive ทุกสัปดาห์ · ส่งทั่วไทย', en: 'Official Conan trading card store.\nWeekly live drops · Nationwide shipping.' },
  footer_col_shop:    { th: 'ร้านค้า',                    en: 'Shop' },
  footer_col_drop:    { th: 'ระบบจุ่ม',                   en: 'Card Drop' },
  footer_col_contact: { th: 'ติดต่อ',                     en: 'Contact' },
  footer_shop_1:      { th: 'ร้านค้า',                    en: 'All Products' },
  footer_shop_2:      { th: 'การ์ด',                      en: 'Cards' },
  footer_shop_3:      { th: 'กล่อง',                      en: 'Boxes' },
  footer_shop_4:      { th: 'แพ็ค',                       en: 'Packs' },
  footer_drop_1:      { th: 'เข้าจุ่มการ์ด',              en: 'Join a Drop' },
  footer_drop_2:      { th: 'ดู Live',                    en: 'Watch Live' },
  footer_drop_3:      { th: 'ไฮไลท์',                    en: 'Highlights' },
  footer_drop_4:      { th: 'ติดตามพัสดุ',                en: 'Track Order' },
  footer_copy:        { th: '© 2025 CH.จุ่มการ์ดโคนัน · สงวนลิขสิทธิ์', en: '© 2025 CH.Conan Card · All Rights Reserved' },
  footer_tagline:     { th: 'Premium Trading Card Store',  en: 'Premium Trading Card Store' },

  /* ── HOME SPECIFIC ─────────────────────────────────────── */
  home_hud_cross_t:   { th: '┼ CT-P10',                   en: '┼ CT-P10' },
  home_hud_cross_b:   { th: '┼ SECRET',                en: '┼ SECRET' },
  home_hud_rare:      { th: 'RARE DETECTED',              en: 'RARE DETECTED' },
  home_hud_series:    { th: 'CT-P10<br>SERIES',           en: 'CT-P10<br>SERIES' },
  home_hud_rare_type: { th: 'MR<br>RARE',                 en: 'MR<br>RARE' },
  feat_hl_title:      { th: 'Highlight',                  en: 'Highlights' },
  feat_hl_desc:       { th: 'คลิปหายาก Rare Pull',        en: 'Epic Rare Pull Clips' },
  feat_track_title:   { th: 'ติดตามพัสดุ',                en: 'Track Order' },
  feat_track_desc:    { th: 'ส่งทั่วไทย รวดเร็ว',         en: 'Fast Nationwide Shipping' },
  live_recent_lives:  { th: 'ไลฟ์ย้อนหลัง',               en: 'RECENT LIVES' },
  live_coming_soon:   { th: 'COMING SOON',                en: 'COMING SOON' },
  btn_see_details:    { th: 'ดูรายละเอียด',               en: 'View Details' },

  /* ── SHOP PAGE ───────────────────────────────────────── */
  shop_eyebrow:       { th: 'ร้านค้า',                    en: 'Shop' },
  shop_title:         { th: 'สินค้าทั้งหมด',               en: 'All Products' },
  shop_search_ph:     { th: 'ค้นหาสินค้า เช่น โคนัน, SSR, CT-P10 …', en: 'Search products, e.g. Conan, SSR, CT-P10 …' },
  shop_filter_rarity: { th: 'Rarity',                     en: 'Rarity' },
  shop_sort_label:    { th: 'เรียงตาม',                   en: 'Sort by' },
  shop_sort_default:  { th: 'จัดเรียงปกติ',               en: 'Default' },
  shop_sort_price_hi: { th: 'ราคา: มาก → น้อย',           en: 'Price: High → Low' },
  shop_sort_price_lo: { th: 'ราคา: น้อย → มาก',           en: 'Price: Low → High' },
  shop_sort_az:       { th: 'ตัวอักษร A → Z',             en: 'Name: A → Z' },
  shop_sort_th:       { th: 'ตัวอักษร ก → ฮ',             en: 'Name: ก → ฮ' },
  shop_result_count:  { th: (n) => `พบ ${n} รายการ`,       en: (n) => `${n} results` },
  shop_no_result:     { th: 'ไม่พบสินค้าที่ค้นหา',         en: 'No products found' },
  shop_no_result_hint:{ th: 'ลองเปลี่ยน Keyword หรือ Filter', en: 'Try adjusting your search or filters' },
  shop_all_rarity:    { th: 'ทุก Rarity',                 en: 'All Rarities' },
  shop_add_to_line:   { th: 'สั่งผ่าน LINE',              en: 'Order via LINE' },

  /* ── LIVE PAGE ───────────────────────────────────────── */
  live_page_title:    { th: 'ไลฟ์สดและอาร์ไคฟ์',          en: 'Live & Archive' },
  live_no_live:       { th: 'ยังไม่มี Live ขณะนี้',        en: 'No active live session' },
  live_no_live_desc:  { th: 'ติดตาม Live เปิดการ์ดสดทุกสัปดาห์', en: 'Follow our weekly live pack opening sessions' },
  live_archive_title: { th: 'Live ที่ผ่านมา',              en: 'Past Live Sessions' },
  live_join_drop:     { th: '🔴 จองจุ่ม',             en: '🔴 Book Drop' },

  /* ── HIGHLIGHTS PAGE ─────────────────────────────────── */
  hl_page_title:      { th: 'ไฮไลท์ & Rare Pull',          en: 'Highlights & Rare Pulls' },
  hl_type_all:        { th: 'ทั้งหมด',                     en: 'All' },
  hl_type_rare:       { th: 'Rare Pull 🌟',                en: 'Rare Pull 🌟' },
  hl_type_box:        { th: 'Box Opening 📦',             en: 'Box Opening 📦' },
  hl_type_reaction:   { th: 'Reaction 😱',                en: 'Reaction 😱' },

  /* ── TRACK PAGE ──────────────────────────────────────── */
  track_page_title:   { th: 'ติดตามคำสั่งซื้อ',            en: 'Track Your Order' },
  track_order_id:     { th: 'หมายเลขคำสั่งซื้อ',           en: 'ORDER ID' },

  /* ── ADMIN ───────────────────────────────────────────── */
  admin_login_title:  { th: 'เข้าสู่ระบบ Admin',           en: 'Admin Login' },
  admin_demo_hint:    { th: 'Demo: admin@cardlab.com / admin123', en: 'Demo: admin@cardlab.com / admin123' },
  admin_login_btn:    { th: 'เข้าสู่ระบบ',                 en: 'Sign In' },
  admin_logout:       { th: '🚪 ออกจากระบบ',               en: '🚪 Logout' },
  admin_wrong_cred:   { th: 'Email หรือ Password ไม่ถูกต้อง', en: 'Incorrect email or password.' },

  /* ── PRODUCT DETAIL ──────────────────────────────────── */
  back_btn:           { th: '← ย้อนกลับ',                  en: '← Back' },
  order_via_line:     { th: '💬 สั่งซื้อผ่าน LINE',         en: '💬 Order via LINE' },
  see_other:          { th: '← ดูสินค้าอื่น',              en: '← Browse more' },
  related_title:      { th: 'สินค้าที่เกี่ยวข้อง',          en: 'Related Products' },

  /* ── 404 ─────────────────────────────────────────────── */
  not_found_title:    { th: '404 — ไม่พบหน้านี้',           en: '404 — Page Not Found' },
  not_found_desc:     { th: 'ลองกลับหน้าหลักหรือเลือกเมนูด้านบน', en: 'Try going back to the homepage or using the menu above.' },
  back_home:          { th: 'กลับหน้าหลัก',                en: 'Back to Home' },
};

export function t(key) {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  const val = entry[_lang] ?? entry.th ?? key;
  return typeof val === 'function' ? val : val;
}

export function tf(key, ...args) {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  const fn = entry[_lang] ?? entry.th;
  return typeof fn === 'function' ? fn(...args) : fn;
}

export function getLang()  { return _lang; }
export function isEn()     { return _lang === 'en'; }

export function setLang(lang) {
  _lang = lang;
  localStorage.setItem('cl_lang', lang);
  document.documentElement.lang = lang;
  _listeners.forEach(fn => fn(lang));
}

export function onLangChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function toggleLang() {
  setLang(_lang === 'th' ? 'en' : 'th');
}
