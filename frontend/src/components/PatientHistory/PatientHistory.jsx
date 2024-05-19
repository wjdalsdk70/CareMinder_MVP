import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { getRequestsFiltered, getChatMessages } from "../../lib/api";
import "./PatientHistory.css";
import Request from "../Request/Request";
import useLocalStorage from "src/hooks/useLocalStorage";
import data from "../../data.json";

export default function PatientHistory({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tablet, setTablet] = useLocalStorage("tablet", {});
  const patient = data.patient;

  function handleNotificationCountChange(count) {
    if (!isOpen) setNotificationCount((prev) => prev + count);
  }

  useEffect(() => {
    if (isOpen) setNotificationCount(0);
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getRequestsFiltered(session, {
          tablet: tablet.id,
        });
        requestsData.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Sort requests by state (finished last)
        requestsData.sort((a, b) => {
          if (a.state === 2 && b.state !== 2) {
            return 1;
          } else if (a.state !== 2 && b.state === 2) {
            return -1;
          } else {
            return 0;
          }
        });

        setRequests(requestsData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  function handleButtonClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={`patient-history ${isOpen && "active"}`}>
      <div onClick={handleButtonClick} className="patient-history__button">
        <MdKeyboardArrowLeft
          className={`patient-history__button__icon ${isOpen && "active"}`}
          size="8rem"
        />
        {notificationCount > 0 && (
          <span className="patient-history__notification notification">
            {notificationCount}
          </span>
        )}
      </div>
      <div className="patient-history__title">
        <FaBars size="2rem" className="patient-history__title__icon" />
        <h1>{patient.requestDetails}</h1>
      </div>
      <div className="patient-history__requests">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          requests.map((request) => (
            <Request
              key={request.id}
              request={request}
              session={session}
              from_patient={true}
              handleNotificationCountChange={handleNotificationCountChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
