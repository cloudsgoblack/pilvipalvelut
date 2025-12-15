import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { auth } from "./palvelimet/firebase";
import { useNavigate } from "react-router-dom";

function Kirjautumislomake() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setErrorMessage(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Käyttäjä " + userCredential.user.email + " kirjautui sisään.");
            setMessage("Kirjautuminen onnistui!");
            navigate("/etusivu");
        } catch (error) {
            console.error("Sisäänkirjautuminen epäonnistui:", error);
            setErrorMessage("Kirjautuminen epäonnistui - tarkista sähköposti ja salasana.");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Kirjaudu sisään</h2>

            <form onSubmit={handleLogin} className="login-form">
                <div className="form-row">
                    <label htmlFor="email" className="form-label">
                        Sähköpostiosoite
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        placeholder="testaaja@pilvi.fi"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="password" className="form-label">
                        Salasana
                    </label>
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-input password-input"
                            placeholder="testaaja-salis"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                </div>

                <button type="submit" className="login-button">
                    Kirjaudu sisään
                </button>

            </form>

            {message && <p className="login-message success">{message}</p>}
            {errorMessage && <p className="login-message error">{errorMessage}</p>}

        </div>
    )
}

export default Kirjautumislomake;