import React, { useState } from "react";
import data from "src/data.json";
import "./AddUser.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { BsPersonFillAdd } from "react-icons/bs";
import { postStaff } from "../../../../lib/api";
import { useNavigate } from "react-router-dom";
import { useRedirectToLogin } from "../../../../hooks/useSession";

export default function AddUser({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const nurse = data.nurse;
  const navigate = useNavigate();
  const [status, setStatus] = useState();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    roles: 0,
    type: 0,
    nfc: "NFCTOKEN",
  });

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

  const handleSaveReturn = async (e) => {
    e.preventDefault();
    try {
      await postStaff(
        session,
        formData.username,
        formData.password,
        formData.first_name,
        formData.last_name,
        formData.roles,
        formData.type,
        formData.nfc
      );
      navigate("/nurse/admin/userlist");
    } catch (error) {
      console.error(error);
      setStatus("failed");
    }
  };

  const handleSaveAddAnother = async (e) => {
    e.preventDefault();
    try {
      await postStaff(
        session,
        formData.username,
        formData.password,
        formData.first_name,
        formData.last_name,
        formData.roles,
        formData.type,
        formData.nfc
      );
      setFormData({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        roles: 0,
        type: 0,
        nfc: "NFCTOKEN",
      });
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("failed");
    }
  };

  function statusMessage() {
    let statusMessage;
    switch (status) {
      case "success":
        statusMessage = <div className="success">Added user</div>;
        break;
      case "failed":
        statusMessage = <div className="error">Failed to add user</div>;
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  function handleCancel() {
    navigate("/nurse/admin/userlist");
  }

  return (
    <div className="adduser-container">
      <NurseHeader session={session} />
      <div className="title">
        <BsPersonFillAdd size="3rem" />
        <h1>{nurse.addUserHeader}</h1>
      </div>

      <div id="data_form">
        <form>
          {statusMessage()}
          <div className="input_field">
            <p>
              {nurse.ID}
              <span>{nurse.required}</span>
            </p>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={nurse.ID}
              autoComplete="off"
            ></input>
          </div>
          <div className="input_field">
            <p>
              {nurse.first_name}
              <span>{nurse.required}</span>
            </p>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder={nurse.first_name}
              autoComplete="off"
            ></input>
          </div>
          <div className="input_field">
            <p>
              {nurse.last_name}
              <span>{nurse.required}</span>
            </p>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder={nurse.last_name}
              autoComplete="off"
            ></input>
          </div>
          <div className="input_field">
            <p>
              {nurse.password}
              <span>{nurse.required}</span>
            </p>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={nurse.password}
              autoComplete="off"
            ></input>
          </div>
          <div className="input_field">
            <p>
              {nurse.type}
              <span>{nurse.required}</span>
            </p>
            <select name="type" onChange={handleChangeNum} defaultValue="">
              <option value="" disabled>
                {nurse.userSelectType}
              </option>
              <option value={0}>{nurse.types[0]}</option>

              <option value={1}>{nurse.types[1]}</option>

              <option value={2}>{nurse.types[2]}</option>
            </select>
          </div>
          <div className="input_field">
            <div className="input_field">
              <p>{nurse.nfcData}</p>
              <input
                name="nfcData"
                onChange={handleChange}
                placeholder={nurse.nfcData}
                style={{ width: "35vmin" }}
                disabled={true}
              ></input>
            </div>
            <button className="change_data_button">Change Data</button>
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
