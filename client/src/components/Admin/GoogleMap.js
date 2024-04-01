import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

import "./admin.css"

const GoogleMap = () => {
    const position = {
        lat : 23.6850,
        lng:  90.3563
    }
    return (
        <APIProvider apiKey='AIzaSyDA-D01obIlMkhnyn4JkMRV1gfVnba_2tg'>
            <div style={{
                height: '100vh',
            }}>
                <Map zoom={9} center={position} mapId={'a76d6833c6f687c8'}>
                    <AdvancedMarker position={position}>
                    </AdvancedMarker>

                </Map>
            </div>
        </APIProvider>
    )
}

export default GoogleMap;