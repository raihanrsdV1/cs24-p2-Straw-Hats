import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { toast } from 'react-toastify'; // Import toast for showing error messages

const DEMO = () => {
    const [routeInfo, setRouteInfo] = useState(null); // State to store route information

    useEffect(() => {
        // Load the Google Maps JavaScript API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDA-D01obIlMkhnyn4JkMRV1gfVnba_2tg&libraries=places`;
        script.onload = async () => {
            const response = await fetch("http://localhost:8000/sts_management/route_optimization", {
                method: "GET",
                headers: { token: localStorage.token },
            });
            console.log(response.data);
            setRouteInfo(response.data);
        };
        document.head.appendChild(script);

        return () => {
            // Cleanup function to remove the script element
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (routeInfo) {
            // Initialize Google Maps
            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: routeInfo.stsCoordinates.latitude, lng: routeInfo.stsCoordinates.longitude },
                zoom: 10,
            });

            // Create a DirectionsService object to use the route between STS and landfill
            const directionsService = new window.google.maps.DirectionsService();

            // Create a DirectionsRenderer object to display the route on the map
            const directionsRenderer = new window.google.maps.DirectionsRenderer({ map: map });

            // Define the request for the route
            const request = {
                origin: { lat: routeInfo.stsCoordinates.latitude, lng: routeInfo.stsCoordinates.longitude },
                destination: { lat: routeInfo.landfillCoordinates.latitude, lng: routeInfo.landfillCoordinates.longitude },
                travelMode: 'DRIVING' // You can change this based on your requirement (e.g., 'DRIVING', 'WALKING', 'BICYCLING')
            };

            // Use the DirectionsService to calculate the route
            directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    // Display the route on the map
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            });
        }
    }, [routeInfo]);

    return (
        <div className="route-container">
            <h2>Optimal Route</h2>
            <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
    );
};

export default DEMO;