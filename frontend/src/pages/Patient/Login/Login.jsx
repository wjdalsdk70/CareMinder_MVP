import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "src/assets/logo.svg";

import "./Login.css";
import { getTablet, getTablets, login, logout } from "src/lib/api";
import { jwtDecode } from "jwt-decode";
import { readForm } from "src/core/utils";
import useLocalStorage from "src/hooks/useLocalStorage";
import data from "../../../data.json";

function validate(data) {
  const errors = {};

  // Validate username
  if (!data.username) {
    errors.username = ["Username is required"];
  }

  // Validate password
  if (!data.password) {
    errors.password = ["Password is required"];
  }

  // Validate tablet
  if (!data.tablet) {
    errors.tablet = ["Tablet is required"];
  }

  return errors;
}

export default function Login({ session }) {
  const patient = data.patient;
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const next = searchParams.get("next") || "/patient/agreement";

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState();

  const [tablet, setTablet] = useLocalStorage("tablet", {});
  const [tablets, setTablets] = useState([]);

  async function fetchTablet(id) {
    try {
      const response = await getTablet(id);
      setTablet(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchTablets() {
    try {
      const response = await getTablets();
      setTablets(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTablets();
  }, []);

  useEffect(() => {
    if (!session.accessToken || !session.ready) return;
    try {
      logout(session);
      session.logout();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);
    session.logout();
    const data = readForm(event.target);
    const validationErrors = validate(data);
    fetchTablet(data.tablet);
    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      setStatus("failed");
      return;
    }

    try {
      const resp = await login(data.username, data.password);
      const { user_id } = jwtDecode(resp.access);
      session.login({
        user: { id: user_id },
        accessToken: resp.access,
        refreshToken: resp.refresh,
      });
      setStatus("success");
      fetchTablet(data.tablet);
      navigate(next);
    } catch (error) {
      if (error.status === 429) {
        setStatus("tooManyAttempts");
      } else {
        setStatus("failed");
      }
    }
    setIsLoading(false);
  };

  function statusMessage() {
    let statusMessage;
    switch (status) {
      case "success":
        statusMessage = (
          <div className="success">{patient.patientLoginInStatusSuccess}</div>
        );
        break;
      case "failed":
        statusMessage = (
          <div className="error">{patient.patientLoginInStatusError}</div>
        );
        break;
      case "tooManyAttempts":
        statusMessage = (
          <div className="error">
            {patient.patientLoginInStatusToManyAttempts}
          </div>
        );
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  return (
    <div className="set-up">
      <img className="set-up__logo" src={Logo} alt="" />
      <div className="container">
        <h1>{patient.patientSetUpHeader}</h1>
        <p>{patient.patientSetUpTablet}</p>
        <p>{patient.patientSetUpTabletExplanation}</p>
        <p>{patient.patientSetUpModifyExplanation}</p>
        <form className="set-up__form" onSubmit={handleSubmit}>
          {statusMessage()}
          <fieldset>
            <label htmlFor="username">{patient.patientSetUpUsername}</label>
            <input name="username" type="text" id="username" />
          </fieldset>
          <fieldset>
            <label htmlFor="password">{patient.patientSetUpPassword}</label>
            <input name="password" type="password" id="password" />
          </fieldset>

          <select name="tablet" id="tablet">
            <option value="" disabled selected>
              {patient.patientSetUpSelectTablet}
            </option>
            {tablets.map((tablets) => (
              <option key={tablets.id} value={tablets.id}>
                {tablets.name}
              </option>
            ))}
          </select>

          <input type="submit" value={patient.patientSetUpLogin} />
        </form>
      </div>
    </div>
  );
}
