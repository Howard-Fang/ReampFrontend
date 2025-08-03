import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/apiClient';
import ".././UploadMedia.css"
import { CheckCircle, Circle } from 'lucide-react';

const FloorPlanSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ListingCase, setListingCase] = useState(null);
  const [floorPlans, setFloorPlans] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, floorPlanRes, selectedIdsRes] = await Promise.all([
          apiClient.get(`ListingCase/${id}`),
          apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=floor-plan`),
          apiClient.get(`/MediaAsset/selected-ids?listingCaseId=${id}&mediaType=floor-plan`)
        ]);
        setListingCase(listingRes.data);
        setFloorPlans(floorPlanRes.data);
        setSelectedFiles(selectedIdsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorMessage("Failed to load floor plan selection data.");
      }
    };

    fetchData();
  }, [id]);

  const toggleSelection = (floorPlanId) => {
    setSelectedFiles((prev) =>
      prev.includes(floorPlanId)
        ? prev.filter((id) => id !== floorPlanId)
        : [...prev, floorPlanId]
    );
  };

  const handleSelect = async () => {
    try {
      await apiClient.post(`/MediaAsset/final-selection`, {
        listingCaseId: parseInt(id),
        mediaType: "floor-plan",
        selectedMediaIds: selectedFiles,
      });
      navigate(`/home/selectMedia/${id}`)
    } catch (error) {
      console.error("Select failed:", error);
      setErrorMessage("Failed to update selections.");
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
          {floorPlans.map((plan) => {
            const isSelected = selectedFiles.includes(plan.id);
            return (
              <div key={plan.id} className="photo-item">
                <div className="select-icon" onClick={() => toggleSelection(plan.id)}>
                  {isSelected ? <CheckCircle color="green" /> : <Circle />}
                </div>
                <img src={plan.mediaUrl} alt="Floor Plan" className="photo-img" />
              </div>
            );
          })}
        </div>
        {errorMessage && <p className='error-message' >{errorMessage}</p>}
        <div className='deliver-div'>
          <button className='deliver-btn' type="button" onClick={() => navigate(`/home/selectMedia/${id}`)}>Cancel</button>
          <button
            className='deliver-btn'
            type="button"
            onClick={handleSelect}
            disabled={selectedFiles.length === 0}
          >Select Floor Plan</button>
        </div>
      </div>
    </div>
  )
}

export default FloorPlanSelection