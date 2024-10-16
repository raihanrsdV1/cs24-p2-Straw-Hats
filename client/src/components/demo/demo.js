import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DEMO = () => {
    const [routeInfo, setRouteInfo] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDA-D01obIlMkhnyn4JkMRV1gfVnba_2tg&libraries=places`;
        script.onload = () => {
            axios.get('http://localhost:8000/sts_management/route_optimization')
                .then(response => {
                    setRouteInfo(response.data);
                })
                .catch(error => {
                    console.error('Error fetching route info:', error);
                    toast.error('Error fetching route info');
                });
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (routeInfo) {
            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: routeInfo.stsCoordinates.latitude, lng: routeInfo.stsCoordinates.longitude },
                zoom: 10,
            });

            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer({ map: map });

            const request = {
                origin: { lat: routeInfo.stsCoordinates.latitude, lng: routeInfo.stsCoordinates.longitude },
                destination: { lat: routeInfo.landfillCoordinates.latitude, lng: routeInfo.landfillCoordinates.longitude },
                travelMode: 'DRIVING'
            };

            directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(result);

                    // Display distance and estimated time
                    const distance = result.routes[0].legs[0].distance.text;
                    const duration = result.routes[0].legs[0].duration.text;
                    console.log('Distance:', distance);
                    console.log('Duration:', duration);

                    // Display step-by-step directions
                    const steps = result.routes[0].legs[0].steps;
                    for (let i = 0; i < steps.length; i++) {
                        console.log('Step ' + (i + 1) + ':', steps[i].instructions);
                    }
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            });
        }
    }, [routeInfo]);

    return (
        <div className="route-container">
            <h2>Optimal Route</h2>
            <p>Showing the optimal route from STS to landfill</p>
            <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
    );
};

export default DEMO;
