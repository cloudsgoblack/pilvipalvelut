import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

function LoginForm() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessage(null);
        setErrorMessage(null);

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Käyttäjä ' + user.email + ' kirjautui sisään.');
                setMessage("Kirjautuminen onnistui!");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sisäänkirjautuminen epäonnistui:', errorCode, errorMessage);
                setErrorMessage("Kirjautuminen epäonnistui - tarkista sähköposti ja salasana.");
            });
    }

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
                            type={showPassword ? "text" : "password"}   // 👈 vaihtuu näkyväksi
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

                <p><a href="https://cloudsgoblack.github.io/pilvipalvelut/">Palaa edelliselle sivulle.</a></p>
            </form>

            {message && <p className="login-message success">{message}</p>}
            {errorMessage && <p className="login-message error">{errorMessage}</p>}

        </div>
    )
}

export default LoginForm;