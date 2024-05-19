import React, { useEffect, useState } from "react";
import "./Home.css";
import data from "src/data.json";
import PatientHeader from "src/components/PatientHeader/PatientHeader";
import PatientFooter from "src/components/PatientFooter/PatientFooter";

import { BsQuestionCircleFill } from "react-icons/bs";
import { TbMicrophone } from "react-icons/tb";
import PatientHistory from "src/components/PatientHistory/PatientHistory";

import { useNavigate } from "react-router-dom";
import { getSettings } from "../../../lib/api";
import { useRedirectToLogin } from "src/hooks/useSession";

export default function Home({ session }) {
  useRedirectToLogin(session, "/patient/login");
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const navigateToContactsFromQuestion = () => {
    navigate("/patient/recording");
    localStorage.setItem("isQuestion", "true");
  };

  const navigateToContactsFromRequest = () => {
    navigate("/patient/recording");
    localStorage.setItem("isQuestion", "false");
  };

  const patient = data.patient;

  const fetchSettings = async () => {
    if (!session.user) return;
    try {
      const settingsData = await getSettings(session);
      setSettings(settingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [session]);

  return (
    <div className="patient__home">
      <PatientHeader session={session}/>
      <main>
        <div className="patient__home container">
          <div className="menu">
            <h1>{settings.hospital_title}</h1>
            <h2>{settings.hospital_description} </h2>
          </div>

          <div className="rq-container">
            <div className="question-container">
              <h1 className="title">{patient.questionTitle}</h1>
              <button onClick={navigateToContactsFromQuestion}>
                <BsQuestionCircleFill size={260} className="icon" />
                <h1>{patient.questionSubtitle}</h1>
                <h3>{patient.confirmation}</h3>
              </button>
            </div>

            <div className="separator"></div>

            <div className="request-container">
              <h1 className="title">{patient.requestTitle}</h1>
              <button onClick={navigateToContactsFromRequest}>
                <TbMicrophone size={260} className="icon" />
                <h1>{patient.requestSubtitle}</h1>
                <h3>{patient.confirmation}</h3>
              </button>
            </div>
          </div>
        </div>
      </main>
      <PatientHistory session={session}/>
      <PatientFooter session={session}/>
    </div>
  );
}
