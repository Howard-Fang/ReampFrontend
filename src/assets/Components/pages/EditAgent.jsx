import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import "./Edit.css"

const EditAgent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agent, setAgent] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await apiClient.get(`Agent/${id}`);
                setAgent(response.data.data)
            } catch (error) {
                console.error("Failed to fetch listing:", error);
            }
        };
        fetchListing();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setAgent((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await apiClient.put(`Agent/${id}`, agent)
            navigate('/home/agents')
        } catch (error) {
            console.error("Failed to update listing:", error);
        }
    }

    if (!agent) return <p>Loading...</p>
    return (
        <div className='edit-container'>
            <div className='edit-middle-container'>
                <div className='edit-title'>
                    <h2>Agent details</h2>
                    <p>Please complete following details for agent Id: {id}</p>
                    <div className="line"></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='form-div-section'>
                        <label htmlFor="first-name">First Name</label>
                        <input
                            className='normal-input'
                            type="text"
                            id='first-name'
                            name='agentFirstName'
                            value={agent.agentFirstName}
                            onChange={handleChange}
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
                </form>
            </div>
        </div>
    )
}

export default EditAgent