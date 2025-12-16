import { useAuth } from "../palvelimet/AuthContext";

export default function Etusivu() {
    const { user } = useAuth();

    return (
        <main>
            <h1>
                {user ? `Tervetuloa ${user.email}!` : "Tervetuloa harjoitustyösovellukseeni :)"}
            </h1>

            <div className="card">
                <h2 className="event-title">Nopeat ohjeet sivuston käyttöön</h2>

                <div className="event-meta">
                    <p>
                        <strong>Tapahtumat</strong>-sivulta pääset lisäämään sivuille uuden tapahtuman tai selaamaan Jalostusnetti-sivulle ladattuja koiranäyttelyitä. Voit lisätä tapahtumia Omat tapahtumat -sivulle käyttöä varten"
                    </p>

                    <p>
                        <strong>Omat tapahtumat</strong>-sivulla näet sinne tallentamasi näyttelyt tai itse luomasi tapahtumat. Voit lisätä tapahtumakorttiin siihen osallistuvan koirasi (käy luomassa ne Koirat-sivulla).
                    </p>

                    <p>
                        <strong>Koirat</strong>-sivulla voit lisätä ja poistaa koiriasi.
                    </p>

                    <p>
                        Vain sisäänkirjautuneena näet sivuston sisällön. :)
                    </p>

                    <br></br><a
                        href="https://cloudsgoblack.github.io/pilvipalvelut/raportti"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="login-button"
                    >
                        Palaa raporttiin
                    </a>

                </div>
            </div>
        </main>
    );
}
