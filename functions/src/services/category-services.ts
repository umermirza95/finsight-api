import {firestore} from "firebase-admin";
import FSCategory from "../interface/FSCategory";

export async function getCategoryByName(name: string, uid: string): Promise<FSCategory | null> {
  const snapshot = await firestore().collection("users").doc(uid).collection("categories").where("name", "==", name).get();
  if (snapshot.empty || !snapshot.docs.length) {
    return null;
  }
  return snapshot.docs[0].data() as FSCategory;
}
