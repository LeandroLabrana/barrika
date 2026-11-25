import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error("Faltan variables NEXT_PUBLIC_FIREBASE_* en .env.local");
}

const db = getFirestore(initializeApp(firebaseConfig));

await setDoc(doc(db, "settings", "general"), {
  takeawayMultiplier: 1.5,
  onPremiseMultiplier: 2,
  takeawayVatRate: 0.21,
  onPremiseVatRate: 0.1,
  purchaseVatRate: 0.21,
}, { merge: true });

const wines = [
  { id: "barrika-crianza", name: "Barrika Crianza", winery: "Bodega Barrika", appellation: "Rioja Alavesa", vintage: 2021, supplier: "Bodega Barrika", purchasePriceExVatCents: 1000, purchaseVatRate: 0.21, vatDeductible: true, takeawayMultiplierOverride: null, onPremiseMultiplierOverride: null, stock: 8, minStock: 10, targetStock: 24, unitsPerOrder: 6, location: "Sala principal" },
  { id: "txakoli-itsas", name: "Itsas Txakoli", winery: "Etxeondo", appellation: "Getariako Txakolina", vintage: 2023, supplier: "Distribuciones Norte", purchasePriceExVatCents: 780, purchaseVatRate: 0.21, vatDeductible: true, takeawayMultiplierOverride: null, onPremiseMultiplierOverride: 2.1, stock: 18, minStock: 8, targetStock: 18, unitsPerOrder: 6, location: "Nevera 1" },
  { id: "garnacha-larga", name: "Garnacha Larga", winery: "Viñas del Sur", appellation: "Calatayud", vintage: 2022, supplier: "", purchasePriceExVatCents: 650, purchaseVatRate: 0.21, vatDeductible: true, takeawayMultiplierOverride: 1.6, onPremiseMultiplierOverride: null, stock: 0, minStock: 5, targetStock: 12, unitsPerOrder: 6, location: "Almacén" },
];

await Promise.all(wines.map((wine) => setDoc(doc(db, "wines", wine.id), wine, { merge: true })));
console.log(`Firebase preparado: settings/general y ${wines.length} vinos creados en ${firebaseConfig.projectId}.`);
process.exit(0);
