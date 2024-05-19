import React, { useEffect, useState } from "react";
import data from "src/data.json";
import "./EditTablets.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { FaUserEdit } from "react-icons/fa";
import { getAreas, patchTablet, getTablet } from "../../../../lib/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRedirectToLogin } from "../../../../hooks/useSession";

export default function EditTablets({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const nurse = data.nurse;
  const { id } = useParams();
  const navigate = useNavigate();
  const [area, setArea] = useState([]);
  const [status, setStatus] = useState();

  const [formData, setFormData] = useState({
    name: "",
    area_id: "",
  });

  const fetchData = async () => {
    try {
      const areaData = await getAreas(session);
      setArea(areaData);
      const tablet = await getTablet(session, id);
      setFormData({
        name: tablet.name || "",
        area_id: tablet.area_id || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData().then((r) => null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeNum = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }));
  };

  function statusMessage() {
    let statusMessage;
    switch (status) {
      case "success":
        statusMessage = <div className="success">edited area</div>;
        break;
      case "failed":
        statusMessage = <div className="error">Failed to edit Area</div>;
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  const handleCancel = () => {
    navigate("/nurse/admin/settings");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patchTablet(session, id, formData.name, formData.area_id);
      navigate("/nurse/admin/settings");
    } catch (error) {
      setStatus("failed");
      console.error(error);
    }
  };

  return (
    <div className="edituser-container">
      <NurseHeader session={session} />
      <div className="title">
        <FaUserEdit size="3rem" />
        <h1>{nurse.editTabletHeader}</h1>
      </div>
      <div id="data_form">
        <form onSubmit={handleSubmit}>
          {statusMessage()}
          <div className="input_field">
            <p>
              {nurse.addTabletNameOfTablet}
              <span>{nurse.required}</span>
            </p>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name of Tablet"
              autoComplete="off"
            ></input>
          </div>

          <div className="input_field">
            <p>
              {nurse.setArea}
              <span>{nurse.required}</span>
            </p>
            <select
              name="area_id" // Correcting the name attribute
              onChange={handleChangeNum}
              value={formData.area_id}
            >
              {area.map((tablet, index) => {
                return (
                  <option key={index} value={tablet.id}>
                    {tablet.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div id="bottom_buttons">
            <button className="cancel_button" onClick={handleCancel}>
              {nurse.editButtonsCancel}
            </button>
            <button className="save_button" type="submit">
              {nurse.editButtonsSave}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
