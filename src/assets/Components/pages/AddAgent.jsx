import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import "./Edit.css"

const AddAgent = () => {
    const navigate = useNavigate();
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [agent, setAgent] = useState({
        username: '',
        password: '',
        email: '',
        agentFirstName: '',
        agentLastName: "",
        avatarUrl: '',
        companyName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setAgent((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("");
        setPasswordError('');
        setEmailError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        if (!emailRegex.test(agent.email)) { setEmailError('Please enter a valid email address.'); }
        if (!strongPasswordRegex.test(agent.password1)) { 
            setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character. Passwords should match.'); }
        if (password1 !== password2) {
            setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character. Passwords should match.');
            return;
        }
        const agentToSubmit={...agent, password:password1 };
        try {
                console.log("Submitting Agent:", agentToSubmit);
                await apiClient.post(`User/AgentRegister`, agentToSubmit)
                navigate('/home/agents')
            } catch (error) {
                if (error.response) {
                    console.error("Backend error:", error.response.data);
                    setErrorMessage(error.response.data.message || 'Registration failed.');
                } else {
                    // Unexpected error
                    console.error("Failed to update listing:", error);
                    setErrorMessage("An unexpected error occurred.");
                }
            }
    }
    return (
        <div className='edit-container'>
            <div className='edit-middle-container'>
                <div className='edit-title'>
                    <h2>Agent details</h2>
                    <p>Please complete following details.</p>
                    <div className="line"></div>
                </div>
                {emailError && (<p>{emailError}</p>)}
                {passwordError && (<p>{passwordError}</p>)}
                <form onSubmit={handleSubmit}>
                    <div className='form-div-section'>
                        <label htmlFor="agent-username">UserName</label>
                        <input
                            className='normal-input'
                            type="text"
                            id='agent-username'
                            name='username'
                            value={agent.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="agent-password1">Password</label>
                        <input
                            className='normal-input'
                            type="password"
                            id='agent-password1'
                            name='password1'
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="agent-password2">Confirm Password</label>
                        <input
                            className='normal-input'
                            type="password"
                            id='agent-password2'
                            name='password2'
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="agent-email">Email</label>
                        <input
                            className='normal-input'
                            type="text"
                            id='agent-email'
                            name='email'
                            value={agent.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="first-name">First Name</label>
                        <input
                            className='normal-input'
                            type="text"
                            id='first-name'
                            name='agentFirstName'
                            value={agent.agentFirstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="last-name">Last Name</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="last-name"
                            name="agentLastName"
                            value={agent.agentLastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="company-name">Company Name</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="company-name"
                            name="companyName"
                            value={agent.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="line edit-line"></div>
                    <div className='btn-div'>
                        <button
                            type="button"
                            className='btn cancel-btn'
                            onClick={() => navigate('/home/agents')}
                        >Cancel</button>
                        <button type="submit" className='btn save-btn'>Save</button>
                    </div>
                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default AddAgent