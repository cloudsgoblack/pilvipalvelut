import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../palvelimet/firebase";
import { saveEvent, removeSavedEvent, lisaaOmaTapahtuma } from "../palvelimet/tallennetutTapahtumat";
import { useAuth } from "../palvelimet/AuthContext";
import { fetchShows } from "../palvelimet/jalostusnetti";

export default function Tapahtumat() {
    const [items, setItems] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    const [manualTitle, setManualTitle] = useState("");
    const [manualDate, setManualDate] = useState("");
    const [manualLocation, setManualLocation] = useState("");
    const [manualSaving, setManualSaving] = useState(false);
    const [manualSuccess, setManualSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadSaved = async () => {
            if (!user) return;
            const snap = await getDocs(collection(db, "users", user.uid, "savedEvents"));
            setSavedIds(new Set(snap.docs.map((d) => d.id)));
        };
        loadSaved();
    }, [user]);

    const handleFetch = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchShows();
            const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
            setItems(list);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Tuntematon virhe");
            setItems(null);
        } finally {
            setLoading(false);
        }
    };

    function formatDateFI(value: unknown) {
        if (!value) return "";
        const d = new Date(String(value));
        if (Number.isNaN(d.getTime())) return String(value);
        return new Intl.DateTimeFormat("fi-FI").format(d);
    }

    function pickTitle(it: any) {
        return it?.location || it?.city || it?.paikkakunta || it?.name || it?.title || "Tapahtuma";
    }

    function toSavedEvent(it: any) {
        const eventId = String(it?.id ?? it?.eventId ?? it?._id ?? "");
        const location = String(it?.location ?? it?.city ?? "");
        const date = String(it?.date ?? it?.startDate ?? it?.start_time ?? "");
        const title = String(it?.name ?? it?.title ?? location ?? "Tapahtuma");

        return { eventId, title, date, location, raw: it };
    }

    const handleToggleSave = async (it: any) => {
        if (!user) return;

        const ev = toSavedEvent(it);
        if (!ev.eventId) return;

        const isSaved = savedIds.has(ev.eventId);

        if (isSaved) {
            setSavedIds((prev) => {
                const next = new Set(prev);
                next.delete(ev.eventId);
                return next;
            });

            try {
                await removeSavedEvent(user.uid, ev.eventId);
            } catch (e) {
                setSavedIds((prev) => new Set(prev).add(ev.eventId));
                console.error("Poisto epäonnistui", e);
            }
        } else {
            setSavedIds((prev) => new Set(prev).add(ev.eventId));

            try {
                await saveEvent(user.uid, ev);
            } catch (e) {
                setSavedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(ev.eventId);
                    return next;
                });
                console.error("Tallennus epäonnistui", e);
            }
        }
    };

    const handleManualSave = async () => {
        if (!user) return;

        if (!manualTitle.trim() || !manualDate.trim() || !manualLocation.trim()) {
            setError("Täytä nimi, päivä ja paikkakunta.");
            return;
        }

        setManualSaving(true);
        setError(null);
        setManualSuccess(null);

        try {
            await lisaaOmaTapahtuma(user.uid, {
                title: manualTitle.trim(),
                date: manualDate.trim(),
                location: manualLocation.trim(),
            });

            setManualTitle("");
            setManualDate("");
            setManualLocation("");
            setManualSuccess("Tapahtuma lisätty omiin tapahtumiin!");

        } catch (e) {
            console.error(e);
            setError("Uuden tapahtuman tallennus epäonnistui.");
        } finally {
            setManualSaving(false);
        }
    };

    return (
        <main>
            <h1>Lisää tapahtuma tai hae koiranäyttelyitä</h1>
            <p>Voit lisätä vapaavalintaisen tapahtuman tai selata koiranäyttelyitä Jalostusnetin rajapinnalta.</p>

            <div className="manual-event-card">
                <h2 className="event-title">Lisää uusi tapahtuma</h2>

                <div className="form-row">
                    <label className="form-label" htmlFor="manualTitle">Tapahtuman nimi</label>
                    <input
                        id="manualTitle"
                        className="form-input"
                        value={manualTitle}
                        onChange={(e) => setManualTitle(e.target.value)}
                        placeholder="Esim. Agilitykisat"
                        required
                    />
                </div>

                <div className="form-row">
                    <label className="form-label" htmlFor="manualDate">Päivämäärä</label>
                    <input
                        id="manualDate"
                        className="form-input"
                        type="date"
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <label className="form-label" htmlFor="manualLocation">Paikkakunta</label>
                    <input
                        id="manualLocation"
                        className="form-input"
                        value={manualLocation}
                        onChange={(e) => setManualLocation(e.target.value)}
                        placeholder="Esim. Tuusula"
                        required
                    />
                </div>

                <button
                    className="login-button"
                    type="button"
                    onClick={handleManualSave}
                    disabled={manualSaving || !user}
                    style={{ width: "90%" }}
                >
                    {manualSaving ? "Tallennetaan..." : "Tallenna omiin tapahtumiin"}
                </button>
                {manualSuccess && (
                    <p className="login-message success">{manualSuccess}</p>
                )}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="login-button" onClick={handleFetch} disabled={loading} style={{ width: "450px" }}>
                    {loading ? "Haetaan..." : "Hae koiranäyttelyitä"}
                </button>
            </div>

            {error && <p className="login-message error">{error}</p>}

            {items && (
                <section className="cards-grid" aria-label="Näyttelyt">
                    {items.map((it, idx) => {
                        const eventId = String(it?.id ?? it?.eventId ?? it?._id ?? idx);
                        const isSaved = savedIds.has(eventId);

                        return (
                            <article className="event-card" key={eventId}>
                                <h2 className="event-title">{pickTitle(it)}</h2>

                                <div className="event-meta">
                                    <div>
                                        <strong>Päivä:</strong> {formatDateFI(it?.date ?? it?.startDate ?? it?.start_time)}
                                    </div>
                                    <div>
                                        <strong>Paikka:</strong> {it?.location ?? it?.city ?? "-"}
                                    </div>
                                </div>

                                <button
                                    className="card-button"
                                    type="button"
                                    onClick={() => handleToggleSave(it)}
                                    disabled={!user}
                                >
                                    {isSaved ? "Tallennettu" : "Lisää omiin"}
                                </button>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}
