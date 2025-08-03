import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/apiClient';
import ".././UploadMedia.css"
import ClipLoader from "react-spinners/ClipLoader";
import { Trash2 } from "lucide-react";

const Video = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ListingCase, setListingCase] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
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
    fetchVideos();
  }, [id]);

  const fetchVideos = async () => {
    try {
      const videoResponse = await apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=videography`);
      setVideos(videoResponse.data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
  };

  const handleFileChange = (e) => {
    setErrorMessage("");
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => validTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      setErrorMessage("Only video files (MP4, WebM, Ogg) are allowed.");
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
    formData.append('mediaType', 'videography');
    setUploading(true);
    try {
      await apiClient.post('/MediaAsset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchVideos();
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
      setVideos(prevVideos => prevVideos.filter(video => video.id !== mediaId));
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
        <h2>Videography</h2>
        <p>Property: {ListingCase.street}, {ListingCase.city}, {ListingCase.state}, {ListingCase.postcode} </p>
        <div className='photo-container'>
          {videos.map((video) => (
            <div key={video.id} className="photo-item">
              <video controls width="100%" className="photo-img">
                <source src={video.mediaUrl} type="video/mp4" />
              </video>
              <button className="delete-btn" onClick={() => handleDelete(video.id)}>
                <Trash2 size={18} />
              </button>
              {deletingVideoIds.includes(video.id) && (
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
          accept="video/mp4,video/webm,video/ogg"
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
          >Upload Video</button>
        </div>
      </div>
    </div>
  )
}

export default Video