import * as admin from "firebase-admin";
import * as  dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY as any) ;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-next13-default-rtdb.firebaseio.com"
});
const DATA_BASE = admin.firestore();
const RTDB = admin.database();

export { DATA_BASE, RTDB };
