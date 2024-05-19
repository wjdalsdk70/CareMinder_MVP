import React, { useEffect, useState } from "react";
import Logo from "src/assets/logo.svg";
import data from "src/data.json";

import "./PatientHeader.css";
import { getRequestsFiltered } from "../../lib/api";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function PatientHeader({ session }) {
  const patient = data.patient;
  const [Requests, setRequests] = useState([]);
  const [tablet, setTablet] = useLocalStorage("tablet", {});

  const [total, setTotal] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getRequestsFiltered(session, {
          tablet: tablet.id,
        });
        setRequests(requestsData);

        // Count the requests for each state
        let waitingCount = 0;
        let progressCount = 0;
        let finishedCount = 0;

        requestsData.forEach((request) => {
          if (request.state === 0) {
            waitingCount++;
          } else if (request.state === 1) {
            progressCount++;
          } else if (request.state === 2) {
            finishedCount++;
          }
        });

        // Update the state variables
        setTotal(requestsData.length);
        setWaiting(waitingCount);
        setProgress(progressCount);
        setFinished(finishedCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="patient-header">
      <div className="left">
        <img className="patient-img" src={Logo} />
        <h2>
          {patient.patientHeader} {total}
        </h2>
      </div>

      <div className="status">
        <h2>
          {patient.patientHeaderWaiting} {waiting}
        </h2>
        <h2>
          {patient.patientHeaderProcess} {progress}
        </h2>
        <h2>
          {patient.patientHeaderDone} {finished}
        </h2>
      </div>
    </header>
  );
}
