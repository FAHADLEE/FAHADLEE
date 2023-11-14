import React, { useState, useEffect } from 'react';
import './NavigationMap.css';
import axios from 'axios';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import CustomsPopup from './CustomsPopup';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const MapContainer = ({ location, onLoad, onUnmount, onMapClick, clickedLocation, directions, savedDetails, onMarkerClick }) => {
    const mapStyles = {
        height: '90vh',
        width: '100%',
    };
    const [map, setMap] = useState(null);

    const handleLoad = (map) => {
        onLoad(map);
        setMap(map);
    };
    return (
        <GoogleMap
            mapContainerStyle={mapStyles}
            center={location}
            zoom={15}
            onLoad={handleLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
        >
            {/* Main marker for the current location */}
            <Marker position={location} />

            {/* Marker for the clicked location */}
            {clickedLocation && (
                <Marker
                    position={clickedLocation}
                    icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                />
            )}
            {/* Popup for saved details */}
            {savedDetails && savedDetails.length > 0 && savedDetails.map((detail, index) => (
                <div key={index}>
                    <Marker
                        position={detail.location}
                        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                        onClick={() => onMarkerClick(index)} // Pass the index to identify which marker was clicked
                    />
                    {index === onMarkerClick && (
                        <div className='details-popup'>
                            <input type="date" value={detail.day} />
                            <input type="time" value={detail.daytime} />
                            <input type="text" value={detail.Type} />
                        </div>
                    )}
                </div>
            ))}

            {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, preserveViewport: true }} />}
        </GoogleMap>
    );
};


const NavigationMap = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState({ lat: 13.0827, lng: 80.2707 });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [popupVisible, setPopupVisible] = useState(false);
    const [clickedLocation, setClickedLocation] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [formData, setFormData] = useState({
        daytime: '',
        Type: 'start', // Default to 'start'
        day: '',
    });
    const [directions, setDirections] = useState(null);
    const [savedDetails, setSavedDetails] = useState([]);
    const [map, setMap] = useState(null);

    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

    const handleMarkerClick = (index) => {
        // Handle click on the marker to display details
        console.log('Marker clicked. Details:', savedDetails[index]);
        // Set the selected marker index to show details popup
        setSelectedMarkerIndex(index);
        setPopupVisible(true);
    };

    useEffect(() => {
        // Load saved details from local storage
        const savedDetails = JSON.parse(localStorage.getItem('savedDetails')) || [];
        setSavedDetails(savedDetails);
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${searchTerm}&key=AIzaSyAKgTjrRsR4GqXNKOp8RNc3WfMaAv8hVSU`
                );
                const { lat, lng } = response.data.results[0].geometry.location;
                setLocation({ lat, lng });
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        if (searchTerm) {
            fetchData();
        }

        // Update the current date every minute
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        // Set default values for modal form
        setFormData({
            daytime: '',
            Type: 'start', // Default to 'start'
            day: '',
        });

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [searchTerm]);

    const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newDetails = {
            day: formData.day,
            daytime: formData.daytime,
            Type: formData.Type,
            location: clickedLocation,
        };

        const updatedDetails = [...savedDetails, newDetails];
        localStorage.setItem('savedDetails', JSON.stringify(updatedDetails));

        if (startLocation && endLocation) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: startLocation,
                    destination: endLocation,
                    travelMode: 'DRIVING',
                },
                (result, status) => {
                    if (status === 'OK') {
                        setDirections(result);

                        // Fit the map bounds to the route
                        const bounds = new window.google.maps.LatLngBounds();
                        result.routes[0].legs.forEach((leg) => {
                            leg.steps.forEach((step) => {
                                step.path.forEach((point) => {
                                    bounds.extend(point);
                                });
                            });
                        });

                        // Use the 'map' instance obtained from the state
                        map.fitBounds(bounds);
                    } else {
                        console.error(`Directions request failed due to ${status}`);
                    }
                }
            );
        }

        // Close the popup
        handlePopupClose();
    };
    const handleMapClick = async (e) => {
        try {
            const clickedLocation = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            setClickedLocation(clickedLocation);
            if (formData.Type === 'start') {
                setStartLocation(clickedLocation);
            } else if (formData.Type === 'end') {
                setEndLocation(clickedLocation);
            }

            const results = await geocodeByAddress(`${clickedLocation.lat},${clickedLocation.lng}`);
            const address = results[0].formatted_address;

            // Update the search term with the clicked location's address
            setSearchTerm(address);
            setPopupVisible(true);
        } catch (error) {
            console.error('Error handling map click:', error);
        }
    };

    const handlePopupClose = () => {
        // Close the popup and reset the form data
        setPopupVisible(false);
        setClickedLocation(null);
        setFormData({
            daytime: '',
            Type: 'start', // Default to 'start'
            day: '',
        });
    };

    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //     // Add your logic to handle the form submission (e.g., send data to the server)
    //     console.log('Form data:', formData);
    //     // Close the popup
    //     handlePopupClose();
    // };




    const onChange = (field, value) => {
        // Update the corresponding form data field
        setFormData({ ...formData, [field]: value });
    };

    const handleSelect = async (address) => {
        try {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            setLocation(latLng);
            setSearchTerm(address);
        } catch (error) {
            console.error('Error selecting address:', error);
        }
    };

    return (
        <>
            <div>
                <PlacesAutocomplete
                    className="search-bar-container"
                    value={searchTerm}
                    onChange={(newValue) => setSearchTerm(newValue)}
                    onSelect={handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="search-input-field">
                            <input
                                {...getInputProps({
                                    placeholder: 'Enter location',
                                })}
                            />
                            <div>
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion) => (
                                    <div {...getSuggestionItemProps(suggestion)}>{suggestion.description}</div>
                                ))}
                            </div>
                            <p>Current Date: {formattedDate}</p>
                        </div>
                    )}
                </PlacesAutocomplete>

                <MapContainer
                    location={location}
                    onLoad={(map) => {
                        console.log('Map loaded:', map);
                    }}
                    onUnmount={(map) => {
                        console.log('Map unmounted:', map);
                    }}
                    onMapClick={handleMapClick}
                    clickedLocation={clickedLocation}
                    directions={directions}
                    savedDetails={savedDetails}
                    onMarkerClick={handleMarkerClick}
                />
            </div>
            <div>
                {popupVisible && (
                    <CustomsPopup
                        formData={formData}
                        onClose={() => {
                            // Reset selected marker index and close the popup
                            setSelectedMarkerIndex(null);
                            handlePopupClose();
                        }}
                        onSubmit={handleFormSubmit}
                        onChange={onChange}
                        selectedDetail={selectedMarkerIndex !== null ? savedDetails[selectedMarkerIndex] : null}
                    />

                )}
            </div>
        </>
    );
};

export default NavigationMap;

