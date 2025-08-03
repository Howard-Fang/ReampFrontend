import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/apiClient';
import ".././UploadMedia.css"
import { CheckCircle, Circle } from 'lucide-react';

const PhotoSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ListingCase, setListingCase] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, photoRes, selectedIdsRes] = await Promise.all([
          apiClient.get(`ListingCase/${id}`),
          apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=photography`),
          apiClient.get(`/MediaAsset/selected-ids?listingCaseId=${id}&mediaType=photography`)
        ]);
        setListingCase(listingRes.data);
        setPhotos(photoRes.data);
        setSelectedFiles(selectedIdsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorMessage("Failed to load photo selection data.");
      }
    };

    fetchData();
  }, [id]);

  const togglePhotoSelection = (photoId) => {
    setSelectedFiles((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelect = async () => {
    try {
      await apiClient.post(`/MediaAsset/final-selection`, {
        listingCaseId: parseInt(id),
        mediaType: "photography",
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
        <h2>Photograhpy</h2>
        <p>Property: {ListingCase.street}, {ListingCase.city}, {ListingCase.state}, {ListingCase.postcode} </p>
        <div className='photo-container'>
          {photos.map((photo) => {
            const isSelected = selectedFiles.includes(photo.id);
            return (
              <div key={photo.id} className="photo-item">
                <div className="select-icon" onClick={() => togglePhotoSelection(photo.id)}>
                  {isSelected ? <CheckCircle color="green" /> : <Circle />}
                </div>
                <img src={photo.mediaUrl} alt="Photography" className="photo-img" />
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
          >Select Photo</button>
        </div>
      </div>
    </div>
  )
}

export default PhotoSelection