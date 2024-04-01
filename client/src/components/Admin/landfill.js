import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./admin.css";

import ShowManagerPopUP from "./showManagerPopUp";

const Landfill = () => {
  const [landfills, setLandfills] = useState([]);
  const [inputs, setInputs] = useState({
    latitude: "",
    longitude: "",
    address: "",
    landfill_capacity: "",
    operation_time: "",
  });
  const [showManager, setShowManager] = useState(false);
  const [selectedLandfill, setSelectedLandfill] = useState(null);

    const closePopUp = () => {
        setShowManager(false);
        setSelectedLandfill(null);
    }

    const onShowManager = (landfill) => {
        setShowManager(true);
        setSelectedLandfill(landfill);
    }

  useEffect(() => {
    const getLandfills = async () => {
      try {
        const response = await fetch("http://localhost:8000/landfill", {
          method: "GET",
          headers: { token: localStorage.token },
        });

        const parseRes = await response.json();
        setLandfills(parseRes);
      } catch (error) {
        console.error(error.message);
      }
    };

    getLandfills();
  }, []);

  const onSubmitForm = async() =>{
    try{
        const body = inputs;
        const response = await fetch(`http://localhost:8000/landfill`, {
            method: "POST",
            headers: { token: localStorage.token, "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const parseRes = await response.json();
        setLandfills(parseRes);
        setInputs({
            latitude: "",
            longitude: "",
            address: "",
            landfill_capacity: "",
            operation_time: "",
        });
        toast.success("Landfill Added Successfully");
    }
    catch (err) {
      console.error(err.message);
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs({
        ...inputs,
        [name]: value
    });
};


  return (
    <Fragment>
     
        <div class="row border m-4 rounded-5 p-3 ml-5 bg-white shadow box-area">
          <div class="col-md-12 right-box">
            <div class="row align-items-center">
              <div class="header-text mb-4">
                <h2>Enter A Landfill</h2>
              </div>

              <div class="input-group mb-3">
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={inputs.latitude}
                onChange={(e) => onChange(e)}
                step="0.0001" // Optional: Adjust step based on precision needed
                min="-90"     // Optional: Set minimum value for latitude (-90 for southern hemisphere)
                max="90"      // Optional: Set maximum value for latitude (90 for northern hemisphere)
                placeholder="Enter latitude"
                className="form-control form-control-lg bg-color fs-6"
            />
            </div>
              <div class="input-group mb-3">
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={inputs.longitude}
                onChange={(e) => onChange(e)}
                step="0.0001" // Optional: Adjust step based on precision needed
                min="-180"     // Optional: Set minimum value for latitude (-90 for southern hemisphere)
                max="180"      // Optional: Set maximum value for latitude (90 for northern hemisphere)
                placeholder="Enter longitude"
                className="form-control form-control-lg bg-color fs-6"
            />
            </div>
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.address}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="number"
                  name="landfill_capacity"
                  placeholder="Capacity of Landfill in Tons"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.landfill_capacity}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="operation_time"
                  placeholder="Operation Time"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.operation_time}
                  onChange={(e) => onChange(e)}
                />
              </div>
              
              

              <div class="input-group mb-3">
                <button
                  class="btn btn-lg btn-primary w-100 h-100 fs-6"
                  onClick={onSubmitForm}
                >
                  Add Landfill
                </button>
              </div>
            </div>
          </div>

        
        </div>
      
      <table className="order-table">
        <thead>
          <tr>
            <th>Landfill Id</th>
            <th>Coordinates</th>
            <th>Address</th>
            <th>Capacity</th>
            <th>Operation Time</th>
            <th>Creator</th>
            <th>Manager Detail</th>
          </tr>
        </thead>
        <tbody>
          <div></div>
          {landfills &&
            landfills.map((landfill) => (
              <tr key={landfill.landfill_id}>
                <td
                  style={{
                    backgroundColor: "#8f6ec5",
                  }}
                >

                  <Link
                    style={{
                      cursor: "pointer",
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      height: "50px",
                    }}
                    to={'/landfill/' + landfill.landfill_id}
                  >
                    {landfill.landfill_id}
                  </Link>
                </td>
                <td>
                  ({landfill.latitude}, {landfill.longitude})
                </td>

                <td>{landfill.address} </td>
                <td>{landfill.landfill_capacity} ton</td>

                <td>
                  {/* <select value={user.role_id? user.role_id : 0} className='admin-select' onChange={(e)=>handleChange(user.id, e)}>
                                <option value={'0'}>Unassigned</option>
                                {roles && roles.map(role => (
                                    <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                ))}
                            </select> */}
                  {landfill.operation_time.hours} hours
                </td>
                <td>{landfill.creator_name}</td>
                <td
                  style={{
                    backgroundColor: "#8f6ec5",
                  }}
                >
                  <button onClick={() => onShowManager(landfill.landfill_id)}
                    style={{
                      cursor: "pointer",
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      height: "50px",
                    }}
                  >
                    Managers
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {
        showManager && <ShowManagerPopUP close={closePopUp} landfill_id={selectedLandfill} />
      }
    </Fragment>
  );
};

export default Landfill;
