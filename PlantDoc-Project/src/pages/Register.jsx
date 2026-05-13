import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        const user = {
            name,
            email,
            password,
        };

        localStorage.setItem("plantdocUser", JSON.stringify(user));

        alert("Registration successful!");
        navigate("/login");
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