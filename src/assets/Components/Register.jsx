import apiClient from "../api/apiClient";
import { useState } from "react";
import { Link} from "react-router-dom";
import "./Register.css"

export default function SignInContainer() {
    const [photographyCompanyName, setPhotographyCompanyName] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [isPwdMatch, setIsPwdMatch]=useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isRegisterSuccessful, setIRegisterSuccessful]=useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        setPasswordError('');
        setEmailError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        if (!emailRegex.test(email)) {setEmailError('Please enter a valid email address.');}
        if (!strongPasswordRegex.test(password1)) {setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');}
        if (!strongPasswordRegex.test(password2)) {setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');}
        if (password1===password2) {
            setIsPwdMatch(true);
            try {
            const response = await apiClient.post('User/PhotographyCompanyRegister', { photographyCompanyName, password:password1, email });
            console.log('Register success:', response.data);
            setIRegisterSuccessful(true);
            } catch (error) {
                console.log('Register failed:', error?.response?.data || error.message);
            }
        } else {
            setIsPwdMatch(false);
        }
    }

    return (
        <div className="big-container">
            <form className="registerContainer" onSubmit={handleSubmit}>
                <div className="registerContainer-part1">
                    <h2>Register</h2>
                    <p className="text-under-register">Enter details to register your account</p>
                </div>
                <div className="registerContainer-part2">
                    <div className="register-input-container">
                        <label htmlFor="photographyCompanyName">Company Name</label>
                        <input
                            type="text"
                            name="photographyCompanyName"
                            id="photographyCompanyName"
                            placeholder="Enter your company name"
                            onChange={(e) => setPhotographyCompanyName(e.target.value)}
                            value={photographyCompanyName}
                            required
                        />
                    </div>
                    <div className="register-input-container">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>
                    <div className="register-input-container">
                        <label htmlFor="password1">Password</label>
                        <input
                            type="password"
                            name="password1"
                            id="password1"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword1(e.target.value)}
                            value={password1}
                            required
                        />
                    </div>
                    <div className="register-input-container">
                        <label htmlFor="password2">Confirm Password</label>
                        <input
                            type="password"
                            name="password2"
                            id="password2"
                            placeholder="Enter your password again"
                            onChange={(e) => setPassword2(e.target.value)}
                            value={password2}
                            required
                        />
                    </div>
                    <button type="submit" className="register-btn">Register</button>
                </div>
                <div className="registerContainer-part3">
                    {hasSubmitted && !isPwdMatch && <p>Passwords do not match, please try again</p>}
                    {emailError && (<p>{emailError}</p>)}
                    {passwordError && (<p>{passwordError}</p>)}
                    {isRegisterSuccessful && <p>Register successfully<Link className="sign-up-link" to="/">Sign in</Link></p>}
                </div>
            </form>
        </div>

    )
}