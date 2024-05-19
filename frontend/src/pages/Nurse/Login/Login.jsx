import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "src/assets/logo.svg";

import "./Login.css";
import { login, logout } from "src/lib/api";
import { jwtDecode } from "jwt-decode";
import { readForm } from "src/core/utils";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { getStaff } from "src/lib/api";

import data from "../../../data.json";
import { useRedirectToHome } from "src/hooks/useSession";

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

  return errors;
}

export default function Login({ session }) {
  const nurse = data.nurse;
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const next = searchParams.get("next") || "/nurse/home";

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState();
  const [errors, setErrors] = useState({});

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
    setStatus("loading");
    setErrors({});
    session.logout();
    const formData = readForm(event.target);
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("failed");
      setIsLoading(false);
      return;
    }

    try {
      const resp = await login(formData.username, formData.password);
      const { user_id } = jwtDecode(resp.access);
      session.login({
        user: { id: user_id },
        accessToken: resp.access,
        refreshToken: resp.refresh,
      });
      setStatus("success");
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
          <div className="success">{nurse.nurseLoginInStatusSuccess}</div>
        );
        break;
      case "failed":
        statusMessage = (
          <div className="error">{nurse.nurseLoginInStatusError}</div>
        );
        break;
      case "tooManyAttempts":
        statusMessage = (
          <div className="error">{nurse.nurseLoginInStatusToManyAttempts}</div>
        );
        break;
      case "loading":
        statusMessage = (
          <div className="loading">{nurse.nurseLoginInStatusLoading}</div>
        );
        break;
      default:
        statusMessage = null;
    }
    return statusMessage;
  }

  return (
    <div className="login">
      <img className="login__logo" src={Logo} alt="" />
      <div className="login__circle" />
      <div className="login__container">
        <div>
          <h1 className="login__title">{nurse.CareMinder}</h1>
          <h2 className="login__subtitle">{nurse.welcomeText}</h2>
          <form className="login__form" onSubmit={handleSubmit}>
            {statusMessage()}
            <fieldset>
              <label htmlFor="username">{nurse.ID}</label>
              <input name="username" type="text" id="username" />
              {errors.username && (
                <p className="error-text">{errors.username[0]}</p>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="password">{nurse.password}</label>
              <input name="password" type="password" id="password" />
              {errors.password && (
                <p className="error-text">{errors.password[0]}</p>
              )}
            </fieldset>

            <input type="submit" value={nurse.nurseLogin} />
          </form>
        </div>
      </div>
    </div>
  );
}
