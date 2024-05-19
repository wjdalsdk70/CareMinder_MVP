import React, { useEffect, useState } from "react";
import data from "src/data.json";
import "./CompletedRequest.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { FaUserEdit } from "react-icons/fa";
import { getRequestsFiltered } from "../../../lib/api";
import { useRedirectToLogin } from "../../../hooks/useSession";

export default function CompletedRequests({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const [request, setRequests] = useState([]);
  const nurse = data.nurse;

  async function fetchRequests() {
    try {
      const getAllRequests = await getRequestsFiltered(session, {
        state: 2,
      });
      const reversedRequests = getAllRequests.reverse();

      setRequests(reversedRequests);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  function formatTime(timeString) {
    const date = new Date(timeString);
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour}:${minute < 10 ? "0" : ""}${minute}`;
  }

  function formatIsQuestion(isQuestion) {
    return isQuestion ? "Question" : "Request";
  }

  return (
    <div className="container">
      <NurseHeader session={session} />
      <div className="title">
        <FaUserEdit size="3rem" />
        <h1>{nurse.CompletedRequests}</h1>
      </div>
      <div className="data-form">
        <form className="table">
          <div className="completedRequestHeader">
            <div className="itemTime">{nurse.completedTime}</div>
            <div className="item">{nurse.completedClassification}</div>
            <div className="itemRequest">{nurse.CompletedRequestDetails}</div>
          </div>

          {request.map((request, index) => {
            return (
              <div key={index} className="row">
                <div className="itemTime">{formatTime(request.time)}</div>
                <div className="item">
                  {formatIsQuestion(request.is_question)}
                </div>
                <div className="itemRequest">{request.text}</div>
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
}
