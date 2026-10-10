#!/usr/bin/env node
/**
 * setup-admin.js
 * สคริปต์สำหรับเพิ่ม/ลบสิทธิ์ Admin ใน Firestore
 * วิธีใช้:
 *   node setup-admin.js add <UID>
 *   node setup-admin.js remove <UID>
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const COLLECTION = 'admins';
const PROJECT_ID = 'conancard-3f557';

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('\n❌  ไม่พบไฟล์ serviceAccountKey.json');
  console.error('📌  ให้ดาวน์โหลดจาก Firebase Console → Project settings → Service accounts → Generate new private key');
  console.error('    แล้วบันทึกไว้ที่: ' + keyPath);
  process.exit(1);
}

const serviceAccount = require(keyPath);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const [,, action, uid] = process.argv;

if (!['add','remove'].includes(action) || !uid) {
  console.log('\n📖  วิธีใช้:');
  console.log('   node setup-admin.js add    <UID>   ← เพิ่มสิทธิ์ Admin');
  console.log('   node setup-admin.js remove <UID>   ← ลบสิทธิ์ Admin');
  process.exit(0);
}

async function run() {
  const ref = db.collection(COLLECTION).doc(uid);
  if (action === 'add') {
    await ref.set({ grantedAt: new Date().toISOString() });
    console.log(`\n✅  เพิ่ม Admin สำเร็จ! UID: ${uid}`);
    console.log('   ให้ผู้ใช้ Logout แล้ว Login ใหม่เพื่อรับสิทธิ์\n');
  } else {
    await ref.delete();
    console.log(`\n🗑️  ลบ Admin สำเร็จ! UID: ${uid}\n`);
  }
  process.exit(0);
}

run().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
