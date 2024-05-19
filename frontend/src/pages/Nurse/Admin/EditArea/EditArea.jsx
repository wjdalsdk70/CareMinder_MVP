import React, { useEffect, useState } from "react";
import data from "src/data.json";
import "./EditArea.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { FaUserEdit } from "react-icons/fa";
import { getArea, patchArea } from "../../../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { useRedirectToLogin } from "../../../../hooks/useSession";

export default function EditArea({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const nurse = data.nurse;
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState();

  const [formData, setFormData] = useState({
    area: "",
  });

  const fetchData = async () => {
    try {
      const area = await getArea(session, id);
      setFormData({
        area: area.name || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData().then((r) => null);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patchArea(session, id, formData.area);
      navigate("/nurse/admin/settings");
    } catch (error) {
      setStatus("failed");
      console.error(error);
    }
  };

  function statusMessage() {
    let statusMessage;
    switch (status) {
      case "success":
        statusMessage = <div className="success">Edit area</div>;
        break;
      case "failed":
        statusMessage = <div className="error">Failed to edit area</div>;
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
    <div className="edituser-container">
      <NurseHeader session={session} />
      <div className="title">
        <FaUserEdit size="3rem" />
        <h1>{nurse.editAreaHeader}</h1>
      </div>
      <div id="data_form">
        <form onSubmit={handleSubmit}>
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
              placeholder={formData.area}
              autoComplete="off"
            ></input>
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
