import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import { Camera, Video, LayoutDashboard } from 'lucide-react';
import "./UploadMedia.css"

const SelectMedia = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ListingCase, setListingCase] = useState(null);

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
    }, [id]);

    const handlePhotoSelection = () => {
        navigate(`/home/photoSelection/${id}`)
    }

    const handleVideoSelection = () => {
        navigate(`/home/videoSelection/${id}`)
    }

    const handlePlanSelection = () => {
        navigate(`/home/floorPlanSelection/${id}`)
    }

    const handleDeliver = async () => {
        try {
            const patchListingCaseDto = { listcaseStatus: 3 };
            await apiClient.patch(`ListingCase/listing/${id}/status`, patchListingCaseDto);
            navigate('/home/assignedcases');
        } catch (error) {
            console.error("Failed to update listing case status:", error);
        }
    }

    if (!ListingCase) {
        return <div className="uploadMedia-container">Loading listing...</div>;
    }

    return (
        <div className='uploadMedia-container'>
            <div className='uploadMedia-middle-container'>
                <p>Property: {ListingCase.street}, {ListingCase.city}, {ListingCase.state}, {ListingCase.postcode} </p>
                <div className='upload-container'>
                    <div className='media-container' onClick={handlePhotoSelection}>
                        <Camera />
                        <p>Photography</p>
                    </div>
                    <div className='media-container' onClick={handleVideoSelection}>
                        <Video />
                        <p>Videography</p>
                    </div>
                    <div className='media-container' onClick={handlePlanSelection}>
                        <LayoutDashboard />
                        <p>Floor Plan</p>
                    </div>
                </div>
                <div className='deliver-div'>
                    <button className='deliver-btn' type="button" onClick={() => navigate('/home/assignedcases')}>Cancel</button>
                    <button className='deliver-btn' type="button" onClick={handleDeliver}>Accomplish Media Selection</button>
                </div>

            </div>
        </div>
    )
}

export default SelectMedia