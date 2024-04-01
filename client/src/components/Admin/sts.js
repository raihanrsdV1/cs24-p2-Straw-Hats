import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./admin.css";

import ShowSTSManagerPopUP from "./showSTSManagerPopUp";

const STS = () => {
  const [stss, setStss] = useState([]);
  const [landfills, setLandfills] = useState([]);
  const [inputs, setInputs] = useState({
    latitude: "",
    longitude: "",
    address: "",
    sts_capacity: "",
    ward_no: "",
    landfill_id: 1
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
    const getStss = async () => {
      try {
        const response = await fetch("http://localhost:8000/sts", {
          method: "GET",
          headers: { token: localStorage.token },
        });

        const parseRes = await response.json();
        setStss(parseRes);
      } catch (error) {
        console.error(error.message);
      }
    };

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
    }

    getLandfills();
    getStss();
  }, []);

  const onSubmitForm = async() =>{
    try{
        const body = inputs;
        const response = await fetch(`http://localhost:8000/sts`, {
            method: "POST",
            headers: { token: localStorage.token, "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const parseRes = await response.json();
        setStss(parseRes);
        setInputs({
            latitude: "",
            longitude: "",
            address: "",
            landfill_capacity: "",
            ward_no: "",
            landfill_id: 1
        });
        toast.success("STS Added Successfully");
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
                <h2>Enter An STS</h2>
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
                  name="sts_capacity"
                  placeholder="Capacity of STS in Tons"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.sts_capacity}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="number"
                  name="ward_no"
                  placeholder="Ward No"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.ward_no}
                  onChange={(e) => onChange(e)}
                />
              </div>

            
              <div class="input-group mb-3">
                <select name="landfill_id" value={inputs.landfill_id} onChange={(e) => onChange(e)} className="form-control form-control-lg bg-color fs-6">
                    {landfills && landfills.map(landfill => (
                        <option key={landfill.landfill_id} value={landfill.landfill_id}>{landfill.address}</option>
                    ))}
                </select>
              </div>
              
              

              <div class="input-group mb-3">
                <button
                  class="btn btn-lg btn-primary w-100 h-100 fs-6"
                  onClick={onSubmitForm}
                >
                  Add STS
                </button>
              </div>
            </div>
          </div>

        
        </div>
      
      <table className="order-table">
        <thead>
          <tr>
            <th>STS Id</th>
            <th>Coordinates</th>
            <th>Address</th>
            <th>Capacity</th>
            <th>Ward No.</th>
            <th>Creator</th>
            <th>Manager Detail</th>
          </tr>
        </thead>
        <tbody>
          <div></div>
          {stss &&
            stss.map((sts) => (
              <tr key={sts.sts_id}>
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
                    to={'/sts/' + sts.sts_id}
                  >
                    {sts.sts_id}
                  </Link>
                </td>
                <td>
                  ({sts.latitude}, {sts.longitude})
                </td>

                <td>{sts.address} </td>
                <td>{sts.sts_capacity} ton</td>

                <td>
                  {/* <select value={user.role_id? user.role_id : 0} className='admin-select' onChange={(e)=>handleChange(user.id, e)}>
                                <option value={'0'}>Unassigned</option>
                                {roles && roles.map(role => (
                                    <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                ))}
                            </select> */}
                  {sts.ward_no}
                </td>
                <td>{sts.creator_name}</td>
                <td
                  style={{
                    backgroundColor: "#8f6ec5",
                  }}
                >
                  <button onClick={() => onShowManager(sts.sts_id)}
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
        showManager && <ShowSTSManagerPopUP close={closePopUp} sts={selectedLandfill} />
      }
    </Fragment>
  );
};

export default STS;
