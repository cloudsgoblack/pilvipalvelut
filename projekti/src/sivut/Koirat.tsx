import { useEffect, useState } from "react";
import { useAuth } from "../palvelimet/AuthContext";
import { lisaaKoira, listaaKoirat, poistaKoira } from "../palvelimet/koirat";
import type { Koira } from "../palvelimet/koirat";

export default function Koirat() {
    const { user } = useAuth();

    const [koirat, setKoirat] = useState<Koira[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [nimi, setNimi] = useState<string>("");
    const [rotu, setRotu] = useState<string>("");
    const [syntymavuosi, setSyntymavuosi] = useState<string>("");

    const [adding, setAdding] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const data = await listaaKoirat(user.uid);
                setKoirat(data);
            } catch (e) {
                setError("Koirien haku epäonnistui.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        setError(null);
        setAdding(true);

        if (!nimi.trim()) {
            setError("Koiran nimi on pakollinen.");
            setAdding(false);
            return;
        }

        const vuosi = syntymavuosi.trim() ? Number(syntymavuosi) : undefined;

        const koiraData = {
            nimi: nimi.trim(),
            rotu: rotu.trim() || undefined,
            syntymavuosi: vuosi !== undefined && !Number.isNaN(vuosi) ? vuosi : undefined,
        };

        try {
            const id = await lisaaKoira(user.uid, koiraData);

            setKoirat((prev) => [{ id, ...koiraData }, ...prev]);

            setNimi("");
            setRotu("");
            setSyntymavuosi("");
        } catch (e) {
            console.error(e);
            setError("Koiran lisääminen epäonnistui.");
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (koiraId: string) => {
        if (!user) return;

        const backup = koirat;
        setKoirat((prev) => prev.filter((k) => k.id !== koiraId));

        try {
            await poistaKoira(user.uid, koiraId);
        } catch (e) {
            setKoirat(backup);
            setError("Koiran poistaminen epäonnistui.");
        }
    };

    return (
        <main>
            <h1>Omat koirat</h1>
            <p>Lisää omat koirasi sivustolle, niin voit listata niitä myös tallentamiisi tapahtumiin.</p>

            <form
                className="koirat-form"
                onSubmit={handleAdd}
                style={{ maxWidth: 520, margin: "0 auto" }}
            >
                <div className="form-row">
                    <label className="form-label" htmlFor="nimi">
                        Koiran nimi *
                    </label>
                    <input
                        id="nimi"
                        className="form-input"
                        value={nimi}
                        onChange={(e) => setNimi(e.target.value)}
                        placeholder="Esim. Risto"
                        required
                    />
                </div>

                <div className="form-row">
                    <label className="form-label" htmlFor="rotu">
                        Rotu
                    </label>
                    <input
                        id="rotu"
                        className="form-input"
                        value={rotu}
                        onChange={(e) => setRotu(e.target.value)}
                        placeholder="Esim. belgianpaimenkoira"
                    />
                </div>

                <div className="form-row">
                    <label className="form-label" htmlFor="syntymavuosi">
                        Syntymävuosi
                    </label>
                    <input
                        id="syntymavuosi"
                        className="form-input"
                        value={syntymavuosi}
                        onChange={(e) => setSyntymavuosi(e.target.value)}
                        placeholder="Esim. 2022"
                        inputMode="numeric"
                    />
                </div>

                <button className="login-button" type="submit" disabled={adding}>
                    {adding ? "Lisätään koiraa..." : "Lisää koira"}
                </button>

                {error && <p className="login-message error">{error}</p>}
            </form>

            {loading && <p>Ladataan koiria…</p>}

            {!loading && koirat.length === 0 && (
                <p>Et ole vielä lisännyt yhtään koiraa.</p>
            )}

            {!loading && koirat.length > 0 && (
                <section className="cards-grid" aria-label="Omat koirat">
                    {koirat.map((d) => (
                        <article className="event-card" key={d.id}>
                            <h2 className="event-title">{d.nimi}</h2>
                            <div className="event-meta">
                                <div><strong>Rotu:</strong> {d.rotu || "-"}</div>
                                <div><strong>Syntymävuosi:</strong> {d.syntymavuosi || "-"}</div>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>

                                <button
                                    className="card-button"
                                    type="button"
                                    onClick={() => handleRemove(d.id)}
                                    aria-label={`Poista koira ${d.nimi}`}
                                >
                                    Poista
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )
            }
        </main >
    );
}
