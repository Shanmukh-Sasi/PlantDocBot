import { useState } from "react";
import "../App.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
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
const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert(data.message);
};