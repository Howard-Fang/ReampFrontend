import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/apiClient';
import ".././UploadMedia.css"
import ClipLoader from "react-spinners/ClipLoader";
import { Trash2 } from "lucide-react";

const FloorPlan = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ListingCase, setListingCase] = useState(null);
  const [floorPlans, setFloorPlans] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingVideoIds, setDeletingVideoIds] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await apiClient.get(`ListingCase/${id}`);
        setListingCase(response.data)
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      }
    };
    fetchListing();
    fetchFloorPlans();
  }, [id]);

  const fetchFloorPlans = async () => {
    try {
      const floorPlanResponse = await apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=floor-plan`);
      setFloorPlans(floorPlanResponse.data);
    } catch (error) {
      console.error("Failed to fetch floor plan:", error);
    }
  };

  const handleFileChange = (e) => {
    setErrorMessage("");
    const validTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml'];
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => validTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      setErrorMessage("Only floor plan files (PDF, PNG, JPG, WEBP, SVG) are allowed.");
    }
    setSelectedFiles(validFiles)
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('listingCaseId', parseInt(id));
    formData.append('userId', user.id);
    formData.append('mediaType', 'floor-plan');
    setUploading(true);
    try {
      await apiClient.post('/MediaAsset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchFloorPlans();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId) => {
    setDeletingVideoIds(prev => [...prev, mediaId]);
    try {
      await apiClient.delete(`/MediaAsset/media/${mediaId}`);
      setFloorPlans(prevPlans => prevPlans.filter(plan => plan.id !== mediaId));
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMessage("Failed to delete video. Please try again.");
    } finally {
      setDeletingVideoIds(prev => prev.filter(id => id !== mediaId));
    }
  };

  if (!ListingCase) {
    return <div className="uploadMedia-container">Loading listing...</div>;
  }

  return (
    <div className='uploadMedia-container'>
      <div className='uploadMedia-middle-container'>
        <h2>Floor Plan</h2>
        <p>Property: {ListingCase.street}, {ListingCase.city}, {ListingCase.state}, {ListingCase.postcode} </p>
        <div className='photo-container'>
          {floorPlans.map((plan) => (
            <div key={plan.id} className="photo-item">
              <img
                src={plan.mediaUrl}
                alt="Photography"
                className="photo-img"
              />
              <button className="delete-btn" onClick={() => handleDelete(plan.id)}>
                <Trash2 size={18} />
              </button>
              {deletingVideoIds.includes(plan.id) && (
                <div className="spinner-overlay">
                  <ClipLoader size={30} color="#fff" />
                </div>
              )}
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className='file-input'
          accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        />
        {errorMessage && <p className='error-message' >{errorMessage}</p>}
        {uploading && <ClipLoader color="#3498db" size={40} />}
        <div className='deliver-div'>
          <button className='deliver-btn' type="button" onClick={() => navigate(`/home/uploadMedia/${id}`)}>Cancel</button>
          <button
            className='deliver-btn'
            type="button"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >Upload Foor Plan</button>
        </div>
      </div>
    </div>
  )
}

export default FloorPlan