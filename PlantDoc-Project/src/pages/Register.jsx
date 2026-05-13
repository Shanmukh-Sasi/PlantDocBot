import { useState } from "react";
import "../App.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
    };

    return (
        <div className="app-container">
            <div className="auth-wrapper">
                <div className="glass-card auth-card">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="subtitle">Join PlantDoc AI today</p>

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="auth-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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

                    <button className="predict-btn" onClick={handleRegister}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
const handleRegister = async () => {
    const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message);
};