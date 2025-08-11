import { useState } from "react"
import apiClient from '../api/apiClient';
import { Link, useNavigate } from "react-router-dom";

const LOGIN_URL = 'User/Login';

export default function SignInContainer({ setUser }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post(LOGIN_URL, { username, password });
            console.log('Login success:', response.data);
            const token = response.data.data;
            localStorage.setItem('token', token);

            const userResponse = await apiClient.get("User/me");
            const freshUser = userResponse.data.data;
            setUser(freshUser);
            setUsername('');
            setPassword('');
            const isAdmin = freshUser.roles?.includes("Admin");
            const isPhotographyCompany = freshUser.roles?.includes("PhotographyCompany");
            const isAgent = freshUser.roles?.includes("Agent");

            if (isAdmin || isPhotographyCompany) {
                navigate("/home/cases");
            }
            if (isAgent) {
                navigate("/home/assignedcases");
            }
        } catch (error) {
            console.log('Login failed:', error?.response?.data || error.message);
        }

    }

    return (
        <form className="signInContainer" onSubmit={handleSubmit}>
            <div className="signInContainer-part1">
                <h2>Sign In</h2>
                <p className="text-under-signIn">Enter details to sign in your account</p>
            </div>
            <div className="signInContainer-part2">
                <div className="input-container">
                    <label htmlFor="username">Username/Company Name</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                    />
                </div>
                <div className="input-container">
                    <div className="password-above-text-div">
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="password-div">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="sign-in-btn">Sign In</button>
            </div>
            <div className="signInContainer-part3">
                <p>Don't have an account?<Link className="sign-up-link" to="/Register">Sign up</Link></p>
            </div>
        </form>
    )
}
