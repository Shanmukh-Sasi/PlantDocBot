import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        const storedUser = JSON.parse(localStorage.getItem("plantdocUser"));

        if (!storedUser) {
            alert("No user found. Please register first.");
            return;
        }

        if (
            storedUser.email === email &&
            storedUser.password === password
        ) {
            alert("Login successful!");
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "/";
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="app-container">
            <div className="auth-wrapper">
                <div className="glass-card auth-card">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="subtitle">Login to continue plant diagnosis</p>

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="predict-btn" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}