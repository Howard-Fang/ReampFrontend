import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient';
import "./Edit.css"

const AddCase = ({ user }) => {
    console.log("user:", user)
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [ListingCase, setListingCase] = useState({
        title: '',
        description: "Fabulous House",
        street: '',
        city: '',
        state: '',
        postcode: '',
        longitude: 0,
        latitude: 0,
        price: '',
        bedrooms: 0,
        bathrooms: 0,
        garages: 0,
        floorArea: '',
        createdAt: new Date().toISOString(),
        isDeleted: false,
        propertyType: 1,
        saleCategory: 1,
        listcaseStatus: 1,
        userId: user.id
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        let val = value;
        // Explicit type parsing by field name
        if (["bedrooms", "bathrooms", "garages", "postcode"].includes(name)) {
            val = parseInt(value);
        } else if (["price", "floorArea"].includes(name)) {
            val = parseFloat(value);
        }
        setListingCase((prev) => ({ ...prev, [name]: val }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("");
        try {
            console.log("Submitting ListingCase:", ListingCase);
            await apiClient.post(`ListingCase`, ListingCase)
            navigate('/home/cases')
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Backend returned validation error
                setErrorMessage(error.response.data.message);
            } else {
                // Unexpected error
                console.error("Failed to update listing:", error);
                setErrorMessage("An unexpected error occurred.");
            }
        }
    }

    return (
        <div className='edit-container'>
            <div className='edit-middle-container'>
                <div className='edit-title'>
                    <h2>Property details</h2>
                    <p>Please complete following details.</p>
                    <div className="line"></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='form-div-section'>
                        <label htmlFor="title">Property title</label>
                        <input
                            className='normal-input'
                            type="text"
                            id='title'
                            name='title'
                            value={ListingCase.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="property-type">Property Type</label>
                        {[
                            { label: "House", value: 1 },
                            { label: "Unit", value: 2 },
                            { label: "Townhouse", value: 3 },
                            { label: "Villa", value: 4 },
                            { label: "Others", value: 5 }
                        ].map((type) => (
                            <label key={type.value}>
                                <input
                                    className='radio-input'
                                    type="radio"
                                    name="propertyType"
                                    value={type.value}
                                    checked={ListingCase.propertyType === type.value}
                                    onChange={(e) =>
                                        setListingCase((prev) => ({ ...prev, propertyType: parseInt(e.target.value) }))}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="sale-category">Sale Category</label>
                        {[
                            { label: "Sale", value: 1 },
                            { label: "Rent", value: 2 },
                            { label: "Auction", value: 3 }
                        ].map((cat) => (
                            <label key={cat.value}>
                                <input
                                    className='radio-input'
                                    type="radio"
                                    name="saleCategory"
                                    value={cat.value}
                                    checked={ListingCase.saleCategory === cat.value}
                                    onChange={(e) =>
                                        setListingCase((prev) => ({ ...prev, saleCategory: parseInt(e.target.value) }))}
                                />
                                {cat.label}
                            </label>
                        ))}
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="street">Street</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="street"
                            name="street"
                            value={ListingCase.street}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="city">City</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="city"
                            name="city"
                            value={ListingCase.city}
                            onChange={handleChange}
                        />
                        <label htmlFor="state">State</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="state"
                            name="state"
                            value={ListingCase.state}
                            onChange={handleChange}
                        />
                        <label htmlFor="postcode">Postcode</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="postcode"
                            name="postcode"
                            value={ListingCase.postcode}
                            onChange={handleChange}
                        />
                        <label htmlFor="price">Price ($)</label>
                        <input
                            className='normal-input'
                            type="text"
                            id="price"
                            name="price"
                            value={ListingCase.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-div-section'>
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <input
                            className='normal-input'
                            type="number"
                            id="bedrooms"
                            name="bedrooms"
                            value={ListingCase.bedrooms}
                            onChange={handleChange}
                        />
                        <label htmlFor="bathrooms">Bathrooms</label>
                        <input
                            className='normal-input'
                            type="number"
                            id="bathrooms"
                            name="bathrooms"
                            value={ListingCase.bathrooms}
                            onChange={handleChange}
                        />
                        <label htmlFor="garages">Garages</label>
                        <input
                            className='normal-input'
                            type="number"
                            id="garages"
                            name="garages"
                            value={ListingCase.garages}
                            onChange={handleChange}
                        />
                        <label htmlFor="floorArea">Floor Area (㎡) </label>
                        <input
                            className='normal-input'
                            type="text"
                            id="floorArea"
                            name="floorArea"
                            value={ListingCase.floorArea}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="line edit-line"></div>
                    <div className='btn-div'>
                        <button
                            type="button"
                            className='btn cancel-btn'
                            onClick={() => navigate('/home/cases')}
                        >Cancel</button>
                        <button type="submit" className='btn save-btn'>Save</button>
                    </div>
                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default AddCase