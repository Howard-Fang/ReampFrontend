import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import "./AssignCase.css"

const AssignCase = ({user}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/Agent");
                setAgents(response.data.data);
            } catch (error) {
                console.error('Error fetching agents:', error);
                setError("Failed to fetch agents")
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedAgent) {
            setError("Please select an agent")
            return;
        };
        try {
            setLoading(true);
            const agentListingCaseDto = {
                agentId: selectedAgent,
                listingCaseId: parseInt(id)
            };
            await apiClient.post("/AgentListingCase", agentListingCaseDto);
            navigate('/home/cases');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errorMessage); // << read backend error message
            } else {
                setError("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        const isAdminOrPhotograhyCompany = user.roles?.includes("Admin") || user.roles?.includes("PhotographyCompany");
        const isAgent = user.roles?.includes("Agent");
        if (isAdminOrPhotograhyCompany) {
            navigate('/home/cases');
        }
        if (isAgent) {
            navigate('/home/assignedcases');
        }
    }
    return (
        <div>
            <h2>Assign Case ID: {id}</h2>
            {error && <p className='assign-p'>{error}</p>}
            {loading && <p className='assign-p'>Loading...</p>}
            <form className="assign-form" onSubmit={handleAssign}>
                <div>
                    <label className="select-label" htmlFor="agent">Select Agent:</label>
                    <select id="agent" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                        <option value="">Select an agent</option>
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>{agent.agentFirstName} {agent.agentLastName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button type='submit'>Assign</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default AssignCase