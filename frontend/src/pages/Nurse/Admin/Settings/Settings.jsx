import data from "src/data.json";
import "./Settings.css";
import Switch from "src/components/Switch/Switch";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import {
  getAreas,
  getSettings,
  getTablets,
  updateSettings,
} from "../../../../lib/api";
import React, { useEffect, useState } from "react";
import { useRedirectToLogin } from "../../../../hooks/useSession";
import { Link, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";


export default function Settings({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    hospital_title: "",
    hospital_description: "",
    notification: "",
  });
  const [tablets, setTablets] = useState([]);
  const [area, setArea] = useState([]);
  const [status, setStatus]=useState([])

  const fetchData = async () => {
    try {
      const settingsData = await getSettings(session);
      const tabletsData = await getTablets(session);
      const areaData = await getAreas(session);
      setArea(areaData);
      setSettings({
        hospital_title: settingsData.hospital_title || "",
        hospital_description: settingsData.hospital_description || "",
        notification: settingsData.notification || "",
      });
      setTablets(tabletsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData().then((r) => null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(
        session,
        settings.hospital_title,
        settings.hospital_description,
        settings.notification
      );
      setStatus("success")
    } catch (error) {
      setStatus("failed")
      console.error(error);
    }
  };

  function handleCancel() {
    navigate("/nurse/admin/userlist");
  }

  function handleAddTablet() {
    navigate("/nurse/admin/addTablet");
  }

  function handleAddArea(){
    navigate("/nurse/admin/addArea");
  }

  function statusMessage() {
    let statusMessage;
    switch (status) {
      case "success":
        statusMessage = (
            <div className="success">Edited Hospital Settings</div>
        );
        break;
      case "failed":
        statusMessage = (
            <div className="error"> Failed to edit settings</div>
        );
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  return (
    <div className="settings__home">
      <NurseHeader session={session} />
      <form onSubmit={handleSubmit}>
        <div className="container">
          <div className="column">
            <div className="row">
              <div className="on-off">
                <h2>{data.nurse.settingsTitle}</h2>
                <Switch />
              </div>
            </div>
            <div className="row">
              <div className="row-container column">
                <h2>{data.nurse.editHospital}</h2>
                <div>
                  <label>{data.nurse.settingsHospitalTitle}</label>
                  <textarea
                    placeholder={data.nurse.settingsHospitalTitle}
                    value={settings.hospital_title}
                    onChange={handleChange}
                    name="hospital_title"
                    className="settings__home__textarea"
                  ></textarea>
                </div>

                <div>
                  <label>{data.nurse.settingsHospitalSubtitle}</label>
                  <textarea
                    placeholder={data.nurse.settingsHospitalSubtitle}
                    value={settings.hospital_description}
                    onChange={handleChange}
                    name="hospital_description"
                    className="settings__home__textarea"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="row-containe column">
                <h2>{data.nurse.editNotification}</h2>
                <div>
                  <label>{data.nurse.settingsHospitalTitle}</label>
                  <textarea
                    placeholder={data.nurse.settingsHospitalTitle}
                    className="settings__home__textarea"
                    value={settings.notification}
                    name="notification"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="row">
              <div className="on-off">
                <h2>{data.nurse.settingsNFC}</h2>
                <Switch/>
              </div>
            </div>

            <h2>{data.nurse.editAreaHeader}</h2>
            <div className="tabletslist-add">
              <div className="tabletslist">
                <div className="list-items">
                  <h2 className="item-number">{data.nurse.settingsName}</h2>
                </div>

                <div className="userlist-rows">
                    {area.map((area, index) => {
                      return (
                          <Link
                              to={`/nurse/admin/editArea/${area.id}`}
                              key={index}
                          >
                            <div className="userlist-row">
                              <hr className="userlist-line-top"/>
                              <div className="list-item">
                                <p className="number-value">{area.name}</p>
                              </div>
                              <hr className="userlist-line-bottom"/>
                            </div>
                          </Link>
                      );
                    })}

                </div>
              </div>
              <FaPlusCircle
                  size="2.5rem"
                  id="add-info"
                  onClick={handleAddArea}
              />
            </div>

            <h2>{data.nurse.editTabletHeader}</h2>
            <div className="tabletslist-add">
              <div className="tabletslist">
                <div className="list-items">
                  <h2 className="item-number">{data.nurse.settingsName}</h2>
                  <h2 className="item-name">{data.nurse.settingsArea}</h2>
                </div>

                <div className="userlist-rows">
                  <div>
                    {tablets.map((tablet, index) => {
                      const tabletArea = area.find(
                          (area) => area.id === tablet.area_id
                      );
                      const areaName = tabletArea
                          ? tabletArea.name
                          : "Unknown Area";

                      return (
                          <Link
                              to={`/nurse/admin/editTablet/${tablet.id}`}
                              key={index}
                          >
                            <div className="userlist-row">
                              <hr className="userlist-line-top"/>
                              <div className="list-item">
                                <p className="number-value">{tablet.name}</p>
                                <p className="name-value">{areaName}</p>
                              </div>
                              <hr className="userlist-line-bottom"/>
                            </div>
                          </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <FaPlusCircle
                  size="2.5rem"
                  id="add-info"
                  onClick={handleAddTablet}
              />
            </div>


          </div>
        </div>
        {statusMessage()}
        <div className="buttons">
          <input className="cancel" onClick={handleCancel} value={data.nurse.editButtonsCancel}/>
          <input className="save" type="submit" value={data.nurse.editButtonsSave}/>
        </div>
      </form>
    </div>
  );
}
