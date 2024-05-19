import React, { useEffect, useState } from "react";
import data from "src/data.json";
import "./UserList.css";
import NurseHeader from "src/components/NurseHeader/NurseHeader";
import { FaUserEdit, FaPlusCircle } from "react-icons/fa";
import { getStaffs } from "../../../../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { useRedirectToLogin } from "../../../../hooks/useSession";

export default function UserList({ session }) {
  useRedirectToLogin(session, "/nurse/login");
  const nurse = data.nurse;
  const [staffs, setStaffs] = useState([]);
  const navigate = useNavigate();

  const fetchSettings = async () => {
    try {
      const staffsData = await getStaffs(session);
      setStaffs(staffsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSettings().then((r) => null);
  }, []);

  function handleGoAddPage() {
    navigate("/nurse/admin/adduser");
  }

  return (
    <div className="userlist-container">
      <NurseHeader session={session} />
      <div className="title">
        <FaUserEdit size="3rem" />
        <h1>{nurse.nurseStaffUserListHeader}</h1>
      </div>
      <p style={{ marginTop: "2vmin", marginLeft: "2vmin" }}>
        {nurse.nurseStaffUserListSubtitle}
      </p>
      <div id="userlist-add">
        <div id="userlist">
          <div id="list-items">
            <h2 className="item-number">{nurse.nurseStaffIDHeader}</h2>
            <h2 className="item-name">{nurse.nurseStaffName}</h2>
          </div>

          <div id="userlist-rows">
            <div>
              {staffs.map((user, index) => (
                <Link to={`/nurse/admin/edituser/${user.id}`} key={index}>
                  <div className="userlist-row">
                    <hr className="userlist-line-top" />
                    <div className="list-item">
                      <p className="number-value">{user.id}</p>
                      <p className="name-value">{`${
                        user.first_name || user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.username
                      }`}</p>
                    </div>
                    <hr className="userlist-line-bottom" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <FaPlusCircle size="2.5rem" id="add-info" onClick={handleGoAddPage} />
      </div>
    </div>
  );
}
