#!/usr/bin/env node
/**
 * One-time script to seed Firestore with initial unit and member data.
 * Run: node scripts/seed-firestore.mjs
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCdlP-E0Rkj_06la33KkwsLvEHT4qE23iI',
  authDomain: 'cashcount-bc75a.firebaseapp.com',
  projectId: 'cashcount-bc75a',
  storageBucket: 'cashcount-bc75a.firebasestorage.app',
  messagingSenderId: '601550607533',
  appId: '1:601550607533:web:010c142eda942d4139a224',
}

// ---- CONFIGURE THESE ----
const UNIT_ID = 'unit-001'
const UNIT_NAME = 'My Unit'
const MEMBER_EMAIL = 'oriel.absin@gmail.com'
const MEMBER_NAME = 'Oriel Absin'
// --------------------------

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  console.log('Seeding Firestore...')

  // 1. Create unit document
  await setDoc(doc(db, 'units', UNIT_ID), {
    name: UNIT_NAME,
    createdAt: serverTimestamp(),
  })
  console.log(`Created unit: ${UNIT_ID} (${UNIT_NAME})`)

  // 2. Create member document
  await setDoc(doc(db, 'units', UNIT_ID, 'members', MEMBER_EMAIL), {
    displayName: MEMBER_NAME,
    role: 'admin',
    addedAt: serverTimestamp(),
  })
  console.log(`Added member: ${MEMBER_EMAIL}`)

  // 3. Create userUnits lookup document
  await setDoc(doc(db, 'userUnits', MEMBER_EMAIL), {
    unitId: UNIT_ID,
    unitName: UNIT_NAME,
  })
  console.log(`Created userUnits lookup for: ${MEMBER_EMAIL}`)

  console.log('\nDone! You can now sign in to the app.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
