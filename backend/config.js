import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "./key.json" assert { type: "json" };

initializeApp({
    credential: cert(serviceAccount),
});

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
