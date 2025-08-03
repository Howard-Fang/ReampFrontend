import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/apiClient';
import ".././UploadMedia.css"
import { CheckCircle, Circle } from 'lucide-react';

const VideoSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ListingCase, setListingCase] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, videoRes, selectedIdsRes] = await Promise.all([
          apiClient.get(`ListingCase/${id}`),
          apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=videography`),
          apiClient.get(`/MediaAsset/selected-ids?listingCaseId=${id}&mediaType=videography`)
        ]);
        setListingCase(listingRes.data);
        setVideos(videoRes.data);
        setSelectedFiles(selectedIdsRes.data);
      } catch (error) {
        console.error("Failed to fetch video selection data:", error);
        setErrorMessage("Failed to load videos.");
      }
    };

    fetchData();
  }, [id]);

  const toggleSelection = (videoId) => {
    setSelectedFiles((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelect = async () => {
    try {
      await apiClient.post(`/MediaAsset/final-selection`, {
        listingCaseId: parseInt(id),
        mediaType: "videography",
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
        <h2>Videography</h2>
        <p>Property: {ListingCase.street}, {ListingCase.city}, {ListingCase.state}, {ListingCase.postcode} </p>
        <div className='photo-container'>
          {videos.map((video) => {
            const isSelected = selectedFiles.includes(video.id);
            return (
              <div key={video.id} className="photo-item">
                <div className="select-icon" onClick={() => toggleSelection(video.id)}>
                  {isSelected ? <CheckCircle color="green" /> : <Circle />}
                </div>
                <video controls width="100%" className="photo-img">
                  <source src={video.mediaUrl} type="video/mp4" />
                </video>
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
          >Select Video</button>
        </div>
      </div>
    </div>
  )
}

export default VideoSelection