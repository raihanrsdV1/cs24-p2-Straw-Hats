import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import moment from "moment";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import "../Admin/admin.css";

const STS = () => {
    const {sts_id} = useParams();
    const [sts, setSts] = useState({
        latitude: 20.203,
        longitude: 90.203
    });
    const [managers, setManagers] = useState([]);
    const [availableManagers, setAvailableManagers] = useState([]);
    const [vehicleLogs, setVehicleLogs] = useState([]);

    useEffect(() => {
        const getSts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/sts/${sts_id}`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setSts(parseRes);
            } catch (err) {
                console.error(err.message);
            }
        };

        const getManagers = async () => {
            try {
                const response = await fetch(`http://localhost:8000/sts/assigned/${sts_id}`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setManagers(parseRes);
            } catch (err) {
                console.error(err.message);
            }
        }

        const getAvailableManagers = async () => {
            try {
                const response = await fetch(`http://localhost:8000/sts/available`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setAvailableManagers(parseRes);
                console.log(availableManagers)
            } catch (err) {
                console.error(err.message);
            }
        }

        const getVehicleLogs = async () => {
            try {
                const response = await fetch(`http://localhost:8000/sts/vehicle_logs/${sts_id}`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setVehicleLogs(parseRes);
            } catch (err) {
                console.error(err.message);
            }
        }

        getSts();
        getManagers();
        getAvailableManagers();
        getVehicleLogs();
    }, []);
    const handleAssign = async (user_id) => {
        try{
            const response = await fetch(`http://localhost:8000/sts/assign_manager`, {
                method: "POST",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify({
                    manager_id: user_id,
                    sts_id: sts_id
                })
            });

            const parseRes = await response.json();
            toast.success('Manager has been successfully Assigned to the Landfill');
            setManagers(parseRes);
            setAvailableManagers(availableManagers.filter(user => user.id !== user_id));
        }
        catch (err) {
            console.error(err.message);
        }
    }

    const handleRemove = async (user_id) => {
        try{
            const response = await fetch(`http://localhost:8000/sts/remove_manager`, {
                method: "POST",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify({
                    manager_id: user_id,
                    sts_id: sts_id
                })
            });

            const parseRes = await response.json();
            toast.success('Manager has been successfully Removed from the Landfill');
            setAvailableManagers(parseRes);
            setManagers(managers.filter(user => user.manager_id !== user_id));
        }
        catch (err) {
            console.error(err.message);
        }
    }

    const position = {
        lat: sts.latitude,
        lng: sts.longitude,
        toJSON: function() {
            return { lat: this.lat, lng: this.lng };
        }
    };


    return (
        <Fragment>
            <div className="landfill-main-div">
                <div className="landfill-div-1">
                    <div className="landfill-info">
                        <h1>STS Information</h1>
                        {
                            sts && (

                            
                        <Fragment>
                        <p>
                            <b>Address:</b> {sts.address}
                        </p>
                        <p>
                            <b>Latitude:</b> {sts.latitude} {
                                sts.latitude > 0? 'N' : 'S'
                            }
                        </p>
                        <p>
                            <b>Longitude:</b> {sts.longitude} {
                                sts.longitude > 0? 'E' : 'W'
                            }
                        </p>
                        <p>
                            <b>Capacity:</b> {sts.sts_capacity} tons
                        </p>
                        <p>
                            <b>Ward No:</b> {sts.ward_no}
                        </p>
                        <p>
                            <b>Landfill Address:</b> {sts.landfill_name}
                        </p>
                        <p>
                            <b>Creator Name:</b> {sts.creator_name}
                        </p>
                        </Fragment>
                            )}
                    </div>
                    <APIProvider apiKey='AIzaSyDA-D01obIlMkhnyn4JkMRV1gfVnba_2tg'>
            <div  style={{
                width: '500px',
                height: '370px'
            }}>
                <Map zoom={9} center={position} mapId={'a76d6833c6f687c8'}>
                    <AdvancedMarker position={position}>
                    </AdvancedMarker>

                </Map>
            </div>
        </APIProvider>
                </div>
                <div className="landfill-div-1">
                <div className='landfill-managers'>
                    <h1 >Assigned Managers</h1>
                    <table className='order-table'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact No.</th>
                        <th>Full Name</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {managers && managers.map(user => (
                        <tr key={user.manager_id}>
                            <td style={{
                                backgroundColor: '#8f6ec5',
                            }}><button 
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                    height: '50px',
                                }}
                            >{user.manager_id}</button></td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.contact_no}</td>
                            <td>{user.full_name}</td>
                            <td><button className="btn btn-danger" onClick={() => handleRemove(user.manager_id)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    </div>
                    <div className='landfill-managers'>
                    <h1>Available Managers</h1>
                    <table className='order-table'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact No.</th>
                        <th>Full Name</th>
                        <th>Add</th>
                    </tr>
                </thead>
                <tbody>
                    {availableManagers && availableManagers.map(user => (
                        <tr key={user.id}>
                            <td style={{
                                backgroundColor: '#8f6ec5',
                            }}><button 
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                    height: '50px',
                                }}
                            >{user.id}</button></td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.contact_no}</td>
                            <td>{user.full_name}</td>
                            <td><button className="btn btn-primary" onClick={() => handleAssign(user.id)}>Add</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    </div>
                </div>

                <div className="landfill-div-1">
                    
                <div className='landfill-vehicle-log'>
                    <table className='order-table'>
                <thead>
                    <tr>
                        <th>Registration No</th>
                        <th>Manager Username</th>
                        <th>Arrival Time</th>
                        <th>Departure Time</th>
                        <th>Weight in tons</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {vehicleLogs && vehicleLogs.map(log => (
                        <tr key={log.id}>
                            <td style={{
                                backgroundColor: '#8f6ec5',
                            }}><button 
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                    height: '50px',
                                }}
                            >{log.registration_no}</button></td>
                            <td>{log.username}</td>
                            <td>{moment(log.arrival_time).format('MMMM DD, YYYY hh:mm a')}</td>
                            <td>{moment(log.departure_time).format('MMMM DD, YYYY hh:mm a')}</td>
                            <td>{log.weight_of_waste}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    </div>
                
        </div>
            </div>
        </Fragment>
    )
}

export default STS;