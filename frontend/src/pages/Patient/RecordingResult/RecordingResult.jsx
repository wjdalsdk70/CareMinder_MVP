import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import { useLocation } from "react-router-dom";
import PatientFooter from "src/components/PatientFooter/PatientFooter";
import Logo from "src/assets/logo.svg";
import "./RecordingResult.css";
import { getTablet, postRequest } from "src/lib/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import { useRedirectToLogin } from "src/hooks/useSession";
import data from "src/data.json";
import { ai } from "../../../lib/api";

export default function RecordingResult({ session }) {
  useRedirectToLogin(session, "/patient/login");
  const navigate = useNavigate();
  const patient = data.patient;
  const transcript = localStorage.getItem("recordingResult");
  const isQuestion = localStorage.getItem("isQuestion");
  const [tablet, setTablet] = useLocalStorage("tablet", {});
  const [text, setText] = useState(transcript);

  const handleRecordAgainClick = () => {
    handlePostRequest().then((r) => navigate("/patient/recording"));
  };

  const handleCancelClick = () => {
    navigate("/patient/home");
  };

  const handleFinishClick = async() => {
    await handlePostRequest().then((r) => navigate("/patient/result"));
  };

  async function handlePostRequest() {
    try {
      const aiResult = await ai(text);
      console.log(aiResult);
      console.log(aiResult[0].label); 
      
      if (isQuestion === "true") {
        await postRequest(session, text, true, 0, tablet.id, aiResult[0].label);
      } else {
        await postRequest(session, text, false, 0, tablet.id, aiResult[0].label);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="RecordingResult">
      <div className="header">
        <div className="left">
          <img className="patient-img" src={Logo} />
          <div className="home">
            <Link to="/patient/home">
              <FaArrowLeft size={50} color="black" />
            </Link>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="textRecording">
          <div className="check">
            <FaRegCheckCircle size={50} color="green" />
            <h1>{patient.patientFinishedRecordingHeader}</h1>
          </div>

          <h2>
            {patient.patientFinishedRecordingRecordAgainBeforeRedRecordAgain}{" "}
            <span className="again">
              {patient.patientFinishedRecordingRecordAgainRedRecordAgainButton}
            </span>{" "}
            {patient.patientFinishedRecordingRecordAgainAfterRedRecordAgain}
          </h2>

          <div className="textArea">
            <div className="textArea-text">
              <GiClick size={50} />
              <h2>{patient.patientFinishedRecordingClickToEditText}</h2>
            </div>
            <div className="textArea-container">
              <textarea
                defaultValue={transcript}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="buttons">
            <button className="record-button" onClick={handleCancelClick}>
              {patient.patientFinishedRecordingCancelButton}
            </button>
            <button
              className="record-button"
              color="var(--request)"
              onClick={handleRecordAgainClick}
            >
              {patient.patientFinishedRecordingRecordAgainButton}
            </button>
            <button className="record-button" onClick={handleFinishClick}>
              {patient.patientFinishedRecordingFinishButton}
            </button>
          </div>
        </div>
      </div>
      <PatientFooter session={session} />
    </div>
  );
}
