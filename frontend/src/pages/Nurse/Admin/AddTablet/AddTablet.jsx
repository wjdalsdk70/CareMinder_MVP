import React, { useEffect, useState } from "react";
import data from "src/data.json";
import "./AddTablet.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { FaUserEdit } from "react-icons/fa";
import { getAreas, postArea, postTablet } from "../../../../lib/api";
import { useNavigate } from "react-router-dom";
import { useRedirectToLogin } from "../../../../hooks/useSession";

export default function EditTablets({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const nurse = data.nurse;
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

  const handleCancel = () => {
    navigate("/nurse/admin/settings");
  };

  const handleSaveReturn = async (e) => {
    e.preventDefault();
    try {
      await postTablet(session, formData.name, formData.area_id);
      navigate("/nurse/admin/settings");
    } catch (error) {
      setStatus("failed");
      console.error(error);
    }
  };

  const handleSaveAddAnother = async (e) => {
    e.preventDefault();
    try {
      await postTablet(session, formData.name, formData.area_id);
      setFormData({
        name: "",
        area_id: "",
      });
      setStatus("success");
    } catch (error) {
      setStatus("failed");
      console.error(error);
    }
  };

  function statusMessage() {
    let statusMessage;
    switch (status) {
      case "success":
        statusMessage = <div className="success">Added tablet</div>;
        break;
      case "failed":
        statusMessage = <div className="error">Failed to add tablet</div>;
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  return (
    <div className="edituser-container">
      <NurseHeader session={session} />
      <div className="title">
        <FaUserEdit size="3rem" />
        <h1>{nurse.addTabletHeader}</h1>
      </div>
      <div id="data_form">
        <form>
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
              {nurse.addTabletArea}
              <span>{nurse.required}</span>
            </p>
            <select
              name="area_id"
              onChange={handleChangeNum}
              value={formData.area_id}
              defaultValue={"select an Area"}
            >
              <option value="" disabled>
                {nurse.setArea}
              </option>
              {area.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div id="bottom_buttons">
            <button className="cancel_button" onClick={handleCancel}>
              {nurse.editButtonsCancel}
            </button>
            <button className="save_button" onClick={handleSaveAddAnother}>
              {nurse.editButtonsSaveAndAddAnother}
            </button>
            <button className="save_button" onClick={handleSaveReturn}>
              {nurse.editButtonsSaveAndReturn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
