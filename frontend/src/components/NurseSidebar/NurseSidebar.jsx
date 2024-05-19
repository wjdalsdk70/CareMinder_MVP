import React from "react";

import { useState, useEffect, useRef } from "react";
import { FaUserEdit } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { BiSolidUserCircle } from "react-icons/bi";
import { GoSignOut } from "react-icons/go";
import longLogo from "src/assets/longLogo.svg";
import { IoClose } from "react-icons/io5";
import "./NurseSidebar.css";
import { IoIosCheckmarkCircle, IoMdSettings } from "react-icons/io";
import { MdDownloading } from "react-icons/md";
import { getStaff } from "../../lib/api";
import { Link } from "react-router-dom";
import data from "../../data.json";

export default function NurseSidebar({ session, isOpen, onClose }) {
  const sidebarRef = useRef(null);
  const [staff, setStaff] = useState([]);
  const nurse = data.nurse;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleOutsideTouch = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    fetchStaff();

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideTouch);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideTouch);
    };
  }, [isOpen, onClose]);

  async function fetchStaff() {
    if (!session?.user?.id) return;
    try {
      const resp = await getStaff(session, session.user.id);
      setStaff(resp);
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogOut() {
    console.log("logout");
    session.logout();
  }

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <IoClose onClick={onClose} className="sidebar-close">
        Close &times;
      </IoClose>

      <div className="sidebar-links">
        <img className="sidebar-logo" src={longLogo} alt="" />
        <div className="sidebar-link-user">
          <p>
            <BiSolidUserCircle />
            {staff.username}
          </p>
          <div className="sidebar-link-signout" onClick={handleLogOut}>
            <GoSignOut />
          </div>
        </div>

        <Link className="sidebar-link" to="/nurse/home/" href="#">
          <FaHouse color="white" />
          <p>{nurse.nurseSideBarHome}</p>
        </Link>

        <Link className="sidebar-link" to="/nurse/home/completedRequests">
          <IoIosCheckmarkCircle color="white" />
          <p> {nurse.nurseSideBarCompleted}</p>
        </Link>

        {/* <Link className="sidebar-link" to="/nurse/home/completedRequests">
          <MdDownloading color="white" />
          <p>{nurse.nurseSideBarSetProgress}</p>
        </Link> */}
        <Link className="sidebar-link" to="#" onClick={(e) => e.preventDefault()}>
          <MdDownloading color="white" />
          <p>{nurse.nurseSideBarSetProgress}</p>
        </Link>

        <Link className="sidebar-link" to="/nurse/admin/userlist">
          <FaUserEdit color="white" />
          <p>{nurse.nurseSideBarUserInfo}</p>
        </Link>

        <Link className="sidebar-link" to="/nurse/admin/settings">
          <IoMdSettings color="white" />
          <p>{nurse.nurseSideBarSettings}</p>
        </Link>
      </div>
    </div>
  );
}
