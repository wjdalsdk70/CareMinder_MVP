import React, { useState } from "react";
import data from "src/data.json";
import "./AddArea.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { BsPersonFillAdd } from "react-icons/bs";
import { postArea } from "../../../../lib/api";
import { useNavigate } from "react-router-dom";
import { useRedirectToLogin } from "../../../../hooks/useSession";

export default function AddArea({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const nurse = data.nurse;
  const navigate = useNavigate();
  const [status, setStatus] = useState();

  const [formData, setFormData] = useState({
    area: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveReturn = async (e) => {
    e.preventDefault();
    try {
      await postArea(session, formData.area);
      navigate("/nurse/admin/settings");
    } catch (error) {
      setStatus("failed");
      console.error(error);
    }
  };

  const handleSaveAddAnother = async (e) => {
    e.preventDefault();
    try {
      await postArea(session, formData.area);
      setFormData({
        area: "",
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
        statusMessage = <div className="success">Added area</div>;
        break;
      case "failed":
        statusMessage = <div className="error">Failed to create area</div>;
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  function handleCancel() {
    navigate("/nurse/admin/settings");
  }

  return (
    <div className="adduser-container">
      <NurseHeader session={session} />
      <div className="title">
        <BsPersonFillAdd size="3rem" />
        <h1>{nurse.areaHeader}</h1>
      </div>

      <div id="data_form">
        <form>
          {statusMessage()}
          <div className="input_field">
            <p>
              {nurse.areaName}
              <span>{nurse.required}</span>
            </p>
            <input
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder={nurse.areaName}
              autoComplete="off"
            ></input>
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
