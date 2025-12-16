import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type Koira = {
    id: string;
    nimi: string;
    rotu?: string;
    syntymavuosi?: number;
};

export async function lisaaKoira(uid: string, data: Omit<Koira, "id">) {
    const ref = await addDoc(collection(db, "users", uid, "koirat"), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function listaaKoirat(uid: string): Promise<Koira[]> {
    const snap = await getDocs(collection(db, "users", uid, "koirat"));
    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Koira, "id">),
    }));
}

export async function poistaKoira(uid: string, koiraId: string) {
    await deleteDoc(doc(db, "users", uid, "koirat", koiraId));
}