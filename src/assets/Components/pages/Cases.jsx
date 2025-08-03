import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { propertyTypeMap, listcaseStatusMap } from "../../Helper/Enum";
import "./Cases.css"
import { useNavigate } from "react-router-dom";

const Cases = ({user}) => {
    const [cases, setCases] = useState([]);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCases = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const getResponse = await apiClient.get("ListingCase/all-listings", {
                        params: {
                            pageNumber: 1,
                            pageSize: 10,
                        }
                    });
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

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        try {
            await apiClient.delete(`ListingCase/${deleteId}`);
            setCases((prev) => prev.filter((item) => item.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete listing:", error);
        }
    }

    const CancelDelete = () => {
        setDeleteId(null);
    }

    const handleEditClick = (id) => {
        navigate(`/home/edit/${id}`)
    };

    const handleAddCase=()=>{
        navigate(`/home/addCase`)
    }

    const handleAssignClick=(id)=> {
        navigate(`/home/assignCase/${id}`)
    }

    const handleUploadMedia=(id)=> {
        navigate(`/home/uploadMedia/${id}`)
    }
    return (
        <div className="cases-table-container">
            <div className="user-profile">
                <h3>Welcome {user.userName}</h3>
                <button className="btn create-btn" onClick={handleAddCase}>Create Case</button>
                {/*<p>Roles: {user.roles.join(', ')}</p>*/}
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
                                    className="btn case-edit-btn"
                                    onClick={() => handleEditClick(caseItem.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn case-delete-btn"
                                    onClick={() => handleDeleteClick(caseItem.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn case-assign-btn"
                                    onClick={() => handleAssignClick(caseItem.id)}
                                >
                                    Assign
                                </button>
                                <button
                                    className="btn case-assign-btn"
                                    onClick={() => handleUploadMedia(caseItem.id)}
                                >
                                    Upload Media
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {deleteId !== null && (
                <div className="confirm-delete-info">
                    <p>Warning: Are you sure you want delete?</p>
                    <button onClick={confirmDelete}>Yes</button>
                    <button onClick={CancelDelete}>No</button>
                </div>
            )}
        </div>
    );
};

export default Cases