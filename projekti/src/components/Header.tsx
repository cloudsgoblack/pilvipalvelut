import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../palvelimet/firebase";
import { useAuth } from "../palvelimet/AuthContext";

export default function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/kirjaudu");
    };

    return (
        <header className="app-header">
            <nav className="nav">
                <div className="nav-left">
                    <Link to="/etusivu" className="nav-link">
                        Etusivu
                    </Link>
                    <Link to="/tapahtumat" className="nav-link">
                        Tapahtumat
                    </Link>
                    <Link to="/omat-tapahtumat" className="nav-link">
                        Omat tapahtumat
                    </Link>
                    <Link to="/koirat" className="nav-link">
                        Omat koirat
                    </Link>
                </div>

                <div className="nav-right">
                    <span className="nav-user">{user.email}</span>
                    <button onClick={handleLogout} className="nav-logout">
                        Kirjaudu ulos
                    </button>
                </div>
            </nav>
        </header>
    );
}