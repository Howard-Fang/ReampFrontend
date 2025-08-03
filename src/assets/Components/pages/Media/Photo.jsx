import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../api/apiClient';
import ".././UploadMedia.css"
import ClipLoader from "react-spinners/ClipLoader";
import { Trash2 } from "lucide-react";

const Photo = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ListingCase, setListingCase] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

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
        fetchPhotos();
    }, [id]);

    const fetchPhotos = async () => {
        try {
            const photoResponse = await apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=photography`);
            setPhotos(photoResponse.data);
        } catch (error) {
            console.error("Failed to fetch photos:", error);
        }
    };

    const handleFileChange = (e) => {
        setErrorMessage("");
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => validTypes.includes(file.type));
        if (validFiles.length !== files.length) {
            setErrorMessage("Only image files (JPG, PNG, WebP) are allowed.");
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
        formData.append('mediaType', 'Photography');
        setUploading(true);
        try {
            await apiClient.post('/MediaAsset/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await fetchPhotos();
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (mediaId) => {
        try {
            await apiClient.delete(`/MediaAsset/media/${mediaId}`);
            fetchPhotos();
        } catch (error) {
            console.error("Delete failed:", error);
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
                    {photos.map((photo) => (
                        <div key={photo.id} className="photo-item">
                            <img
                                src={photo.mediaUrl}
                                alt="Photography"
                                className="photo-img"
                            />
                            <button className="delete-btn" onClick={() => handleDelete(photo.id)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className='file-input'
                    accept="image/jpeg,image/png,image/webp,image/jpg"
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
                    >Upload Photo</button>
                </div>
            </div>
        </div>
    )
}

export default Photo