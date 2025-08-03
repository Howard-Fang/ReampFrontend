import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import { BedDouble, Bath, CarIcon, RulerIcon } from 'lucide-react';
import "./Preview.css"

const PreviewWebsite = ({ user }) => {
  const { id } = useParams();
  const [ListingCase, setListingCase] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await apiClient.get(`ListingCase/${id}`);
        setListingCase(response.data)
        const photoResponse = await apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=photography`);
        setPhotos(photoResponse.data.filter(p=>p.isSelect));
        const videoResponse = await apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=videography`);
        setVideos(videoResponse.data.filter(v=>v.isSelect));
        const floorPlanResponse = await apiClient.get(`/MediaAsset/mediatype?listingCaseId=${id}&mediaType=floor-plan`);
        setFloorPlans(floorPlanResponse.data.filter(f=>f.isSelect));
      } catch (error) {
        console.error("Failed to fetch listing or media:", error);
      }
    };
    fetchListing();
  }, [id]);

  console.log({ photos, videos, floorPlans });
  
  if (!ListingCase) {
    return <div className="">Loading page...</div>;
  }

  return (
    <div className='preview-big-container'>
      <div className='property-details'>
        <div className='city-category-container'>
          <div className='city-address'>
            <p>{ListingCase.city}</p>
            <p>{ListingCase.street}</p>
          </div>
          <div className='category-price'>
            {ListingCase.saleCategory === 1 && <p>For Sale</p> ||
              ListingCase.saleCategory === 2 && <p>For Rent</p> ||
              ListingCase.saleCategory === 3 && <p>For Action</p>}
            <p>$ {ListingCase.price}</p>
          </div>
        </div>
        <div className='basic-info'>
          <p><BedDouble /> {ListingCase.bedrooms}</p>
          <p><Bath /> {ListingCase.bathrooms}</p>
          <p><CarIcon /> {ListingCase.garages}</p>
          <p><RulerIcon /> {ListingCase.floorArea}㎡</p>
        </div>
      </div>
      <div className='property-description'>
        <p>{ListingCase.description}</p>
      </div>
      <div className='property-photos'>
        {photos.map((photo) => (
          <div key={photo.id} className="property-photo-item">
            <img
              src={photo.mediaUrl}
              alt="Photography"
              className="property-photo-img"
            />
          </div>
        ))}
      </div>
      <div className='property-videos'>
        {videos.map((video) => (
          <div key={video.id} className="property-video-item">
            <video controls width="100%" className="property-video-img">
              <source src={video.mediaUrl} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
      <div className='property-floorPlans'>
        {floorPlans.map((plan) => (
          <div key={plan.id} className="property-photo-item">
            <img
              src={plan.mediaUrl}
              alt="Photography"
              className="property-photo-img"
            />
          </div>
        ))}
      </div>
      <div className='property-contact-details'>
        <h1>Contact Details</h1>
        <div className='contact-details'>
          <p>{user.userName}</p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default PreviewWebsite