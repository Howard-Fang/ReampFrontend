import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import "./Cases.css"
import { useNavigate } from "react-router-dom";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const getResponse = await apiClient.get("Agent");
        console.log("Response:", getResponse.data);
        setAgents(getResponse.data.data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch agent data");
      }
    };
    fetchAgents();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`Agent/${deleteId}`);
      setAgents((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  }

  const CancelDelete = () => {
    setDeleteId(null);
  }

  const handleEditClick = (id) => {
    navigate(`/home/editAgent/${id}`)
  };

  const handleAddAgent = () => {
    navigate(`/home/addAgent`)
  }

  return (
    <div className="cases-table-container">
      <div className="user-profile">
        <h3>Agent management</h3>
        <button className="btn create-btn" onClick={handleAddAgent}>Create Agent</button>
      </div>
      <table className="cases-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Company Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.id}</td>
              <td>{agent.agentFirstName}</td>
              <td>{agent.agentLastName}</td>
              <td>{agent.companyName}</td>
              <td>
                <button
                  className="btn case-edit-btn"
                  onClick={() => handleEditClick(agent.id)}
                >
                  Edit
                </button>
                <button
                  className="btn case-delete-btn"
                  onClick={() => handleDeleteClick(agent.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deleteId !== null && (
        <div className="confirm-delete-info">
          <p>Warning: Are you sure you want to delete?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={CancelDelete}>No</button>
        </div>
      )}
    </div>
  );
}

export default Agents