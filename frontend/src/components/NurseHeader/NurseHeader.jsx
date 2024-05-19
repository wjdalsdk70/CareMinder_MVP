import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import NurseSidebar from "../NurseSidebar/NurseSidebar";
import Logo from "src/assets/logo.svg";
import { IoIosArrowBack } from "react-icons/io";
import data from "src/data.json";
import "./NurseHeader.css";
import {useNavigate} from "react-router-dom";

export default function NurseHeader({ session }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const showGoBackButton = !location.pathname.includes("/nurse/home/requests");
  const navigate = useNavigate()


  const openSidebar = (event) => {
    event.stopPropagation();
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleGoBack = () => {
    navigate(-1)
  }


  return (
    <>
      <header className="nurse-header">
        <div className="header-nurse-container">
          <img className="header-img" src={Logo} alt="" />
          <FaBars
            className="header-bars"
            onClick={(event) => openSidebar(event)}
          />
          <NurseSidebar
            session={session}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        </div>

        {showGoBackButton && (
          <div className="go_back" onClick={handleGoBack}>
            <IoIosArrowBack size="32" />
            <h2>{data.nurse.nurseHeaderBack}</h2>
          </div>
        )}
      </header>
    </>
  );
}
