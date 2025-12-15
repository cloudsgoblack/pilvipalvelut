import { arrayUnion, arrayRemove, doc, updateDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type SavedEvent = {
    eventId: string;
    title: string;
    date: string;
    location: string;
    raw?: any;
};

export async function saveEvent(uid: string, event: SavedEvent) {
    const ref = doc(db, "users", uid, "savedEvents", event.eventId);
    await setDoc(ref, { ...event, createdAt: serverTimestamp() }, { merge: true });
}

export async function removeSavedEvent(uid: string, eventId: string) {
    const ref = doc(db, "users", uid, "savedEvents", eventId);
    await deleteDoc(ref);
}

export async function liitaKoiraTapahtumaan(uid: string, eventId: string, koiraId: string) {
    const ref = doc(db, "users", uid, "savedEvents", eventId);
    await updateDoc(ref, {
        koiraIds: arrayUnion(koiraId),
    });
}

export async function poistaKoiraTapahtumasta(uid: string, eventId: string, koiraId: string) {
    const ref = doc(db, "users", uid, "savedEvents", eventId);
    await updateDoc(ref, {
        koiraIds: arrayRemove(koiraId),
    });
}

export async function lisaaOmaTapahtuma(
    uid: string,
    data: { title: string; date: string; location: string }
) {
    const eventId = crypto.randomUUID();
    const ref = doc(db, "users", uid, "savedEvents", eventId);

    await setDoc(ref, {
        eventId,
        title: data.title,
        date: data.date,
        location: data.location,
        koiraIds: [],
        createdAt: serverTimestamp(),
        source: "manual",
    });

    return eventId;
}