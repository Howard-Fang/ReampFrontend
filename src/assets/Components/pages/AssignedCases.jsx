import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { propertyTypeMap, listcaseStatusMap } from "../../Helper/Enum";
import "./Cases.css"
import { useNavigate } from "react-router-dom";

const AssignedCases = ({ user }) => {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCases = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const getResponse = await apiClient.get(`ListingCase/listingCasesByAgentId?agentId=${user.id}`);
          console.log("Response:", getResponse.data);
          setCases(getResponse.data);
        } catch (error) {
          console.error("Error:", error);
          setError("Failed to fetch user data");
          localStorage.removeItem("token");
        }
      }
    };
    fetchCases();
  }, []);

  const handleAssignClick = (id) => {
    navigate(`/home/assignCase/${id}`)
  }

  const handleSelectMedia = (id) => {
    navigate(`/home/selectMedia/${id}`)
  }

  const handlePreviewWebsite = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="cases-table-container">
      <div className="user-profile">
        <h3>Welcome {user.userName}</h3>
      </div>
      <table className="cases-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Property Type</th>
            <th>Address</th>
            <th>Created Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td>{caseItem.id}</td>
              <td>{propertyTypeMap[caseItem.propertyType]}</td>
              <td>{caseItem.street},{caseItem.city},{caseItem.state},{caseItem.postcode}</td>
              <td>{new Date(caseItem.createdAt).toLocaleDateString('en-AU',
                { year: '2-digit', month: 'short', day: '2-digit' }
              )}</td>
              <td>{listcaseStatusMap[caseItem.listcaseStatus]}</td>
              <td>
                <button
                  className="btn case-assign-btn"
                  onClick={() => handleAssignClick(caseItem.id)}
                >
                  Assign
                </button>
                {caseItem.listcaseStatus === 2 && (
                  <button
                    className="btn case-assign-btn"
                    onClick={() => handleSelectMedia(caseItem.id)}
                  >
                    Select Media
                  </button>
                )}
                {caseItem.listcaseStatus === 3 && (
                  <>
                    <button
                      className="btn case-assign-btn"
                      onClick={() => handleSelectMedia(caseItem.id)}
                    >
                      Select Media
                    </button>
                    <button
                      className="btn case-assign-btn"
                      onClick={() => handlePreviewWebsite(caseItem.id)}
                    >
                      Preview Website
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignedCases