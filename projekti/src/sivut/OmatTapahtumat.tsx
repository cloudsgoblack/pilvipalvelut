import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../palvelimet/firebase";
import { removeSavedEvent, liitaKoiraTapahtumaan, poistaKoiraTapahtumasta } from "../palvelimet/tallennetutTapahtumat";
import { useAuth } from "../palvelimet/AuthContext";
import type { Koira } from "../palvelimet/koirat";
import { listaaKoirat } from "../palvelimet/koirat";

type SavedEvent = {
    eventId: string;
    title: string;
    date: string;
    location: string;
    koiraIds?: string[];
};

export default function OmatTapahtumat() {
    const { user } = useAuth();
    const [items, setItems] = useState<SavedEvent[]>([]);
    const [koirat, setKoirat] = useState<Koira[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const koiraMap = useMemo(() => new Map(koirat.map((k) => [k.id, k.nimi])), [koirat]);

    useEffect(() => {
        const load = async () => {
            if (user === undefined) {
                return;
            }

            if (!user) {
                setItems([]);
                setKoirat([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const q = query(collection(db, "users", user.uid, "savedEvents"));
                const snap = await getDocs(q);

                const list = snap.docs.map((d) => {
                    const data = d.data() as Omit<SavedEvent, "eventId">;
                    return { eventId: d.id, ...data };
                });

                setItems(list);

                const dogData = await listaaKoirat(user.uid);
                setKoirat(dogData);
            } catch (e) {
                console.error(e);
                setError("Tallennettujen tapahtumien haku epäonnistui.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    function formatDateFI(value: string) {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return new Intl.DateTimeFormat("fi-FI").format(d);
    }

    const sortedItems = [...items].sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();

        if (Number.isNaN(da) && Number.isNaN(db)) return 0;
        if (Number.isNaN(da)) return 1;
        if (Number.isNaN(db)) return -1;

        return db - da;
    });

    const handleRemoveEvent = async (eventId: string) => {
        if (!user) return;

        const backup = items;
        setItems((prev) => prev.filter((e) => e.eventId !== eventId));

        try {
            await removeSavedEvent(user.uid, eventId);
        } catch (e) {
            console.error("Poistaminen epäonnistui", e);
            setItems(backup);
            setError("Tapahtuman poistaminen epäonnistui.");
        }
    };

    const handleLinkDog = async (eventId: string, koiraId: string) => {
        if (!user || !koiraId) return;

        setItems((prev) =>
            prev.map((ev) =>
                ev.eventId === eventId
                    ? { ...ev, koiraIds: Array.from(new Set([...(ev.koiraIds ?? []), koiraId])) }
                    : ev
            )
        );

        try {
            await liitaKoiraTapahtumaan(user.uid, eventId, koiraId);
        } catch (e) {
            console.error("Koiran liittäminen tapahtumaan epäonnistui", e);
            setItems((prev) =>
                prev.map((ev) =>
                    ev.eventId === eventId
                        ? { ...ev, koiraIds: (ev.koiraIds ?? []).filter((id) => id !== koiraId) }
                        : ev
                )
            );
            setError("Koiran liittäminen tapahtumaan epäonnistui.");
        }
    };

    const handleUnlinkDog = async (eventId: string, koiraId: string) => {
        if (!user) return;

        setItems((prev) =>
            prev.map((ev) =>
                ev.eventId === eventId
                    ? { ...ev, koiraIds: (ev.koiraIds ?? []).filter((id) => id !== koiraId) }
                    : ev
            )
        );

        try {
            await poistaKoiraTapahtumasta(user.uid, eventId, koiraId);
        } catch (e) {
            console.error("Koiran poisto tapahtumasta epäonnistui", e);
            setItems((prev) =>
                prev.map((ev) =>
                    ev.eventId === eventId
                        ? { ...ev, koiraIds: Array.from(new Set([...(ev.koiraIds ?? []), koiraId])) }
                        : ev
                )
            );
            setError("Koiran poistaminen tapahtumasta epäonnistui.");
        }
    };

    return (
        <main>
            <h1>Tallennetut tapahtumat</h1>

            <p>Täältä näet tallentamasi tapahtumat ja voit lisätä niihin osallistuvat koirat.</p>

            {loading && <p>Ladataan tallennettuja tietoja…</p>}

            {!loading && error && <p className="login-message error">{error}</p>}

            {!loading && !error && items.length === 0 && (
                <p>Et ole vielä tallentanut yhtään tapahtumaa.</p>
            )}

            {!loading && !error && items.length > 0 && (
                <section className="cards-grid saved-events-grid" aria-label="Omat näyttelyt">
                    {sortedItems.map((it) => {
                        const linkedDogIds = it.koiraIds ?? [];

                        return (
                            <article className="event-card" key={it.eventId}>
                                <h2 className="event-title">{it.title}</h2>

                                <div className="event-meta">
                                    <div>
                                        <strong>Päivä:</strong> {formatDateFI(it.date)}
                                    </div>
                                    <div>
                                        <strong>Paikka:</strong> {it.location || "-"}
                                    </div>
                                    <div>
                                        <strong>Osallistuvat koirat: </strong>{" "}
                                        {linkedDogIds.length === 0
                                            ? "-"
                                            : linkedDogIds.map((id) => koiraMap.get(id) ?? id).join(", ")}
                                    </div>
                                </div>

                                {koirat.length > 0 && (
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                                        <label className="form-label" htmlFor={`koira-${it.eventId}`} style={{ margin: 0 }}>
                                            Lisää koira:
                                        </label>

                                        <select
                                            id={`koira-${it.eventId}`}
                                            className="form-input saved-select"
                                            style={{ maxWidth: 260 }}
                                            defaultValue=""
                                            onChange={async (e) => {
                                                const koiraId = e.target.value;
                                                if (!koiraId) return;
                                                await handleLinkDog(it.eventId, koiraId);
                                                e.currentTarget.value = "";
                                            }}
                                        >
                                            <option value="">Valitse koira…</option>
                                            {koirat
                                                .filter((k) => !linkedDogIds.includes(k.id))
                                                .map((k) => (
                                                    <option key={k.id} value={k.id}>
                                                        {k.nimi}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                {linkedDogIds.length > 0 && (
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                                        {linkedDogIds.map((kid) => (
                                            <button
                                                key={kid}
                                                type="button"
                                                className="dog-chip"
                                                onClick={() => handleUnlinkDog(it.eventId, kid)}
                                                aria-label={`Poista koira ${koiraMap.get(kid) ?? kid} tapahtumalta`}
                                            >
                                                Poista: {koiraMap.get(kid) ?? kid}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button
                                    className="card-button"
                                    type="button"
                                    onClick={() => handleRemoveEvent(it.eventId)}
                                >
                                    Poista
                                </button>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}