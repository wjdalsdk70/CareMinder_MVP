import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import PatientFooter from "src/components/PatientFooter/PatientFooter";
import Logo from "src/assets/logo.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import AudioVisualizer from "src/components/AudioVisualizer/AudioVisualizer";
import "./Recording.css";
import { useRedirectToLogin } from "src/hooks/useSession";
import data from "src/data.json";
import useLocalStorage from "src/hooks/useLocalStorage";

export default function Recording({ session }) {
  useRedirectToLogin(session, "/patient/login");
  const patient = data.patient;
  const navigate = useNavigate();
  const { transcript } = useSpeechRecognition("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Speech Recognition is not supported");
    }
  }, []);

  useEffect(() => {
    setIsRecording(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: patient.recordingLang,
    });

    return () => {
      setIsRecording(false);
      SpeechRecognition.stopListening();
    };
  }, []);

  const handleHomeClick = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
  };

  const handleFinishClick = () => {
    SpeechRecognition.stopListening();
    localStorage.setItem("recordingResult", transcript);
    navigate("/patient/recording/result");
    setIsRecording(false);
  };

  return (
    <div className="recording">
      <div className="header">
        <div className="left">
          <img className="patient-img" src={Logo} alt="Patient Logo" />
          <div className="home">
            <a href="/patient/home">
              <FaArrowLeft size={50} color="black" />
            </a>
          </div>
        </div>
      </div>
      <div className="recording__body">
        <div className="visualizer">
          <AudioVisualizer />
        </div>
      </div>
      <h2 className="record-text">{transcript}</h2>
      <div className="record-buttons">
        <Link
          className="record-button"
          to="/patient/home"
          onClick={handleHomeClick}
        >
          {patient.patientRecordingCancelButton}
        </Link>
        <Link
          className="record-button"
          to="/patient/recording/result"
          onClick={handleFinishClick}
        >
          {patient.patientRecordingFinishButton}
        </Link>
      </div>
      <PatientFooter session={session} />
    </div>
  );
}
