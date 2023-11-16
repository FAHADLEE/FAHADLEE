import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faMapMarkerAlt, faMapSigns } from '@fortawesome/free-solid-svg-icons';
import './Style.css'
const NavigationMap = () => {
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const time = useRef(null);
    const date = useRef(null);
    const type = useRef(null);

    useEffect(() => {
        const myLatLng = { lat: 20.5937, lng: 78.9629 }; // India's location
        const mapOptions = {
            center: myLatLng,
            zoom: 7,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        };

        const map = new window.google.maps.Map(
            document.getElementById('googleMap'),
            mapOptions
        );

        const directionsService = new window.google.maps.DirectionsService();
        const directionsDisplay = new window.google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        const calcRoute = () => {
            const request = {
                origin: inputRef1.current.value,
                destination: inputRef2.current.value,
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.IMPERIAL,
            };

            directionsService.route(request, (result, status) => {
                const output = document.querySelector('#output');
                if (status === window.google.maps.DirectionsStatus.OK) {
                    output.innerHTML =
                        `<div class='alert-info'>From: ${inputRef1.current.value}.<br />
            To: ${inputRef2.current.value}.<br />
            Driving distance <i class='fas fa-road'></i> : ${result.routes[0].legs[0].distance.text}.<br />
            Duration <i class='fas fa-hourglass-start'></i> : ${result.routes[0].legs[0].duration.text}.</div>`;

                    directionsDisplay.setDirections(result);
                } else {
                    directionsDisplay.setDirections({ routes: [] });
                    map.setCenter(myLatLng);

                    output.innerHTML =
                        `<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>`;
                }
            });
        };

        const options = {
            types: ['(cities)'],
        };

        // Initialize Autocomplete for inputRef1
        const autocomplete1 = new window.google.maps.places.Autocomplete(
            inputRef1.current,
            options
        );

        // Initialize Autocomplete for inputRef2
        const autocomplete2 = new window.google.maps.places.Autocomplete(
            inputRef2.current,
            options
        );

        const calcRouteButton = document.getElementById('calcRouteButton');
        calcRouteButton.addEventListener('click', calcRoute);

        // Cleanup function to remove event listener when the component unmounts
        return () => {
            calcRouteButton.removeEventListener('click', calcRoute);
        };
    }, []);

    return (
        <div>
            <div style={{ padding: '20px' }}>
                <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
                    <div className='input-field'>
                        <label htmlFor="from">
                            <FontAwesomeIcon icon={faDotCircle} /> Start
                        </label>
                        <input type="text" id="from" ref={inputRef1} placeholder="Origin" style={{ marginBottom: '10px' }} />
                        <label htmlFor="from">
                            <FontAwesomeIcon icon={faDotCircle} /> Time
                        </label>
                        <input type="time" id="time" ref={time} placeholder="Time" style={{ marginBottom: '10px' }} />
                        <label htmlFor="from">
                            <FontAwesomeIcon icon={faDotCircle} /> Date
                        </label>
                        <input type="date" id="date" ref={date} placeholder="Date" style={{ marginBottom: '10px' }} />
                        <label>
                            Type:
                            <select
                                ref={type}
                                placeholder="type" style={{ marginBottom: '10px' }}
                            >
                                <option value="start">Start</option>
                                <option value="end">End</option>
                                <option value="waypoint">Waypoint</option>
                            </select>
                        </label>
                    </div>
                    <div className='input-field'>
                        <label htmlFor="to">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> End
                        </label>
                        <input type="text" id="to" ref={inputRef2} placeholder="Destination" style={{ marginBottom: '10px' }} />
                        <label htmlFor="from">
                            <FontAwesomeIcon icon={faDotCircle} /> Time
                        </label>
                        <input type="time" id="time" ref={time} placeholder="Time" style={{ marginBottom: '10px' }} />
                        <label htmlFor="from">
                            <FontAwesomeIcon icon={faDotCircle} /> Date
                        </label>
                        <input type="date" id="date" ref={date} placeholder="Date" style={{ marginBottom: '10px' }} />
                        <label>
                            Type:
                            <select
                                ref={type}
                                placeholder="type" style={{ marginBottom: '10px' }}
                            >
                                <option value="start">Start</option>
                                <option value="end">End</option>
                                <option value="waypoint">Waypoint</option>
                            </select>
                        </label>
                    </div>
                </form>
                <button id="calcRouteButton" style={{ padding: '10px', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faMapSigns} /> Route
                </button>
            </div>

            <div id="googleMap" style={{ height: '300px', width: '100%', marginBottom: '20px' }}></div>
            <div id="output"></div>
        </div>
    );
};

export default NavigationMap;
