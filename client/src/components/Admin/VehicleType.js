

import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./admin.css";


const VehicleType = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [inputs, setInputs] = useState({
        type: "",
        capacity: "",
        loaded_cost: "",
        unloaded_cost: "",
    });



    useEffect(() => {
        const getVehicleTypes = async () => {
            try {
                const response = await fetch("http://localhost:8000/vehicleType", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });

                const parseRes = await response.json();
                setVehicleTypes(parseRes);
            } catch (error) {
                console.error(error.message);
            }
        };

        getVehicleTypes();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const onSubmitForm = async () => {
        try {
            const body = inputs;
            const response = await fetch(`http://localhost:8000/vehicleType`, {
                method: "POST",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const parseRes = await response.json();
            setVehicleTypes(parseRes);
            toast.success("Vehicle Type Added Successfully");
        } catch (error) {
            console.error(error.message);
        }
    }
    return(
        <Fragment>
     
        <div class="row border m-4 rounded-5 p-3 ml-5 bg-white shadow box-area">
          <div class="col-md-12 right-box">
            <div class="row align-items-center">
              <div class="header-text mb-4">
                <h2>Enter A Vehicle Type</h2>
              </div>

        
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="type"
                  placeholder="Type"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.type}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="number"
                  name="vehicle_capacity"
                  placeholder="Capacity of Vehicle in Tons"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.vehicle_capacity}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="loaded_cost"
                  placeholder="Per KM Loaded Cost in BDT"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.loaded_cost}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="unloaded_cost"
                  placeholder="Per KM Unloaded Cost in BDT"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.unloaded_cost}
                  onChange={(e) => onChange(e)}
                />
              </div>
              
              

              <div class="input-group mb-3">
                <button
                  class="btn btn-lg btn-primary w-100 h-100 fs-6"
                  onClick={onSubmitForm}
                >
                  Add Vehicle Type
                </button>
              </div>
            </div>
          </div>

        
        </div>
      
      <table className="order-table">
        <thead>
          <tr>
            <th>Type Id</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Loaded Cost</th>
            <th>Unloaded Cost</th>
            <th>Edit</th>
            <th>Delete</th>
            
            
          </tr>
        </thead>
        <tbody>
          <div></div>
          {vehicleTypes &&
            vehicleTypes.map((vehicleType) => (
              <tr key={vehicleType.id}>
                <td
                  style={{
                    backgroundColor: "#8f6ec5",
                  }}
                >

                  <button
                    style={{
                      cursor: "pointer",
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      height: "50px",
                    }}
                    
                  >
                    {vehicleType.id}
                  </button>
                </td>
                <td>
                  {vehicleType.type}
                </td>

                <td>{vehicleType.vehicle_capacity} ton </td>
                <td>{vehicleType.loaded_cost} BDT / KM</td>

                
                <td>{vehicleType.unloaded_cost} BDT / KM</td>
                <td><button className="btn btn-primary">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
            ))}
        </tbody>
      </table>
      
    </Fragment>
    )
}

export default VehicleType;