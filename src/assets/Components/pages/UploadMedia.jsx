import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import { Camera, Video, LayoutDashboard } from 'lucide-react';
import "./UploadMedia.css"

const UploadMedia = () => {
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

    const handlePhoto = () => {
        navigate(`/home/photo/${id}`)
    }

    const handleVideo = () => {
        navigate(`/home/video/${id}`)
    }

    const handlePlan = () => {
        navigate(`/home/floorPlan/${id}`)
    }

    const handleDeliver = async () => {
        try {
            const patchListingCaseDto= {listcaseStatus:2};
            await apiClient.patch(`ListingCase/listing/${id}/status`,patchListingCaseDto);
            navigate('/home/cases');
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
                    <div className='media-container' onClick={handlePhoto}>
                        <Camera />
                        <p>Photography</p>
                    </div>
                    <div className='media-container' onClick={handleVideo}>
                        <Video />
                        <p>Videography</p>
                    </div>
                    <div className='media-container' onClick={handlePlan}>
                        <LayoutDashboard />
                        <p>Floor Plan</p>
                    </div>
                </div>
                <div className='deliver-div'>
                    <button className='deliver-btn' type="button" onClick={() => navigate('/home/cases')}>Cancel</button>
                    <button className='deliver-btn' type="button" onClick={handleDeliver}>Deliver to agent</button>
                </div>

            </div>
        </div>
    )
}

export default UploadMedia