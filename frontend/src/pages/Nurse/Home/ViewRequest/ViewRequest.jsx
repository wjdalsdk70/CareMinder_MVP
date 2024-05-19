import React, { useState, useEffect, useRef } from "react";
import Filter from "src/components/Filter/Filter";
import { BiLoaderCircle } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineDownloading } from "react-icons/md";
import styles from "./ViewRequest.module.css";
import flw from "../Home.module.css";
import Request from "src/components/Request/Request";
import { getAreas, getRequestsFiltered, updateRequest } from "src/lib/api";
import { useRedirectToLogin } from "src/hooks/useSession";
import data from "src/data.json";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { uniqueObjects } from "src/core/utils";

export default function ViewRequest({ session }) {
  useRedirectToLogin(session, "nurse/login");
  const nurse = data.nurse;

  const [selectedOptions, setSelectedOptions] = useState({
    waiting: {
      job: { 0: true, 1: true },
      area: {},
    },
    ongoing: {
      job: { 0: true, 1: true },
      area: {},
    },
  });

  const [waiting, setWaiting] = useState([]);
  const [ongoing, setOngoing] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    job: [
      { value: 0, description: "질문" },
      { value: 1, description: "요청사항" },
    ],
    patient: [],
    area: [],
  });

  const [selItem, setSelItem] = useState({
    i: null,
    s: null,
    item: { isQuestion: false, text: "", date: new Date() },
  });

  const [holding, setHolding] = useState(false);

  const pressTimer = useRef(null);

  async function fetchFilterOptions() {
    try {
      const resp = await getAreas(session);
      const areas = resp.map((area) => ({
        value: area.id,
        description: area.name,
      }));
      setFilterOptions((prev) => {
        return {
          ...prev,
          area: areas,
        };
      });
      setSelectedOptions((prev) => {
        return {
          ...prev,
          waiting: {
            ...prev.waiting,
            area: areas.reduce((acc, area) => {
              return { ...acc, [area.value]: true };
            }, {}),
          },
          ongoing: {
            ...prev.waiting,
            area: areas.reduce((acc, area) => {
              return { ...acc, [area.value]: true };
            }, {}),
          },
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleCheckBoxChange = (event, filterName, section) => {
    const { name, checked } = event.target;
    setSelectedOptions((prevSelectedOptions) => {
      return {
        ...prevSelectedOptions,
        [section]: {
          ...prevSelectedOptions[section],
          [filterName]: {
            ...prevSelectedOptions[section][filterName],
            [name]: checked,
          },
        },
      };
    });
  };

  const handleWaitingCheckBoxChange = (event, filterName) => {
    handleCheckBoxChange(event, filterName, "waiting");
  };

  const handleOngoingCheckBoxChange = (event, filterName) => {
    handleCheckBoxChange(event, filterName, "ongoing");
  };

  const handleMouseDown = (i, s, item) => {
    pressTimer.current = setTimeout(() => {
      setHolding(true);
      setSelItem({ i, s, item });
    }, 500);
  };

  const handleMouseMove = (e) => {
    const item = document.querySelector(`.${styles.follow}`);

    if (item) {
      item.style.setProperty("--x", `${e.clientX}px`);
      item.style.setProperty("--y", `${e.clientY}px`);
    }
  };

  const handleMouseUp = async (e) => {
    clearTimeout(pressTimer.current);
    if (!holding) return false;

    setHolding(false);
    setSelItem({
      i: null,
      s: null,
      item: { isQuestion: false, text: "", date: new Date() },
    });
    const targetElement = e.target.getAttribute("name");

    if (!targetElement) return false;

    if (targetElement === "finishArea") {
      const item = selItem.s === "r" ? ongoing[selItem.i] : waiting[selItem.i];
      await handleStateChangeDelete(item.id);

      let newWaiting = waiting.filter((_, i) => i !== selItem.i);
      let newOngoing = ongoing.filter((_, i) => i !== selItem.i);

      // Sort the arrays before setting them
      newWaiting.sort((a, b) => new Date(b.time) - new Date(a.time));
      newOngoing.sort((a, b) => new Date(b.time) - new Date(a.time));

      selItem.s === "l" ? setWaiting(newWaiting) : setOngoing(newOngoing);
    } else if (targetElement.charAt(0) !== selItem.s) {
      const item = selItem.s === "r" ? ongoing[selItem.i] : waiting[selItem.i];
      if (selItem.s === "l") {
        await handleStateChangeMine(item.id);
        item.state = 1;
        let newWaiting = waiting.filter((_, i) => i !== selItem.i);
        let newOngoing = [...ongoing, item];

        // Sort the arrays before setting them
        newWaiting.sort((a, b) => new Date(b.time) - new Date(a.time));
        newOngoing.sort((a, b) => new Date(b.time) - new Date(a.time));

        setWaiting(newWaiting);
        setOngoing(newOngoing);
      } else {
        await handleStateChangeGlobal(item.id);
        item.state = 0;
        let newOngoing = ongoing.filter((_, i) => i !== selItem.i);
        let newWaiting = [...waiting, item];

        // Sort the arrays before setting them
        newWaiting.sort((a, b) => new Date(b.time) - new Date(a.time));
        newOngoing.sort((a, b) => new Date(b.time) - new Date(a.time));

        setWaiting(newWaiting);
        setOngoing(newOngoing);
      }
    }
  };

  async function handleStateChangeMine(id) {
    try {
      const resp = await updateRequest(session, id, 1, session.user.id);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStateChangeGlobal(id) {
    try {
      const resp = await updateRequest(session, id, 0, null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStateChangeDelete(id) {
    try {
      const resp = await updateRequest(session, id, 2, session.user.id);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchRequests(filters, areas, jobs) {
    let selectedAreas = [];
    let selectedJobs = [];

    for (const [areaKey, areaValue] of Object.entries(areas)) {
      if (areaValue) selectedAreas.push(areaKey);
    }

    for (const [jobKey, jobValue] of Object.entries(jobs)) {
      if (jobValue) selectedJobs.push(jobKey);
    }

    const resp = await getRequestsFiltered(session, {
      ...filters,
      tabletArea: selectedAreas,
      isQuestion: selectedJobs,
    });

    return resp;
  }

  async function fetchWaitingRequests() {
    try {
      const resp = await fetchRequests(
        { staff: null, state: 0 },
        selectedOptions.waiting.area,
        selectedOptions.waiting.job
      );

      setWaiting(resp.sort((a, b) => new Date(b.time) - new Date(a.time)));
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchOngoingRequests() {
    try {
      const resp = await fetchRequests(
        {
          staff: session.user.id,
          state: 1,
        },
        selectedOptions.ongoing.area,
        selectedOptions.ongoing.job
      );

      setOngoing(resp.sort((a, b) => new Date(b.time) - new Date(a.time)));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [holding]);

  useEffect(() => {
    fetchWaitingRequests();
    fetchOngoingRequests();

    const intervalId = setInterval(() => {
      fetchWaitingRequests();
      fetchOngoingRequests();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedOptions]);

  return (
    <>
      <div
        className={`${styles.follow} ${flw.follow} ${
          holding ? "" : styles.hide
        }`}
      >
        <Request
          request={selItem.item}
          session={session}
          from_patient={false}
        />
      </div>
      <div className={styles.wrapper}>
        <div>
          <div className={styles.title}>
            <BiLoaderCircle />
            <h2>{nurse.nurseHomeGlobalRequestsHeader}</h2>
          </div>
          <div className={styles.filter}>
            <Filter
              title={nurse.filterByJob}
              options={filterOptions.job}
              selectedOptions={selectedOptions["waiting"]["job"]}
              handleCheckboxChange={(e) =>
                handleWaitingCheckBoxChange(e, "job")
              }
            />
            <Filter
              title={nurse.filterByArea}
              options={filterOptions.area}
              selectedOptions={selectedOptions["waiting"]["area"]}
              handleCheckboxChange={(e) =>
                handleWaitingCheckBoxChange(e, "area")
              }
            />
          </div>
          {holding ? <div className={styles.area} name="leftArea"></div> : ""}
          <div
            className={styles.waiting}
            style={holding ? { transform: "translateY(-100%)" } : {}}
          >
            {waiting.map((item, i) => (
              <div
                key={i}
                onMouseDown={(e) => handleMouseDown(i, "l", item)}
                className={
                  selItem.i === i && selItem.s === "l" ? styles.hide : ""
                }
              >
                <Request
                  request={item}
                  session={session}
                  from_patient={false}
                />
              </div>
            ))}
          </div>
        </div>
        <span className={styles.line}></span>
        <div className={styles.right}>
          <div className={styles.title}>
            <MdOutlineDownloading />
            <h2>{nurse.nurseHomeMyRequestHeader}</h2>
          </div>
          <div className={styles.filter}>
            <Filter
              title={nurse.filterByJob}
              options={filterOptions.job}
              selectedOptions={selectedOptions["ongoing"]["job"]}
              handleCheckboxChange={(e) =>
                handleOngoingCheckBoxChange(e, "job")
              }
            />
            <Filter
              title={nurse.filterByArea}
              options={filterOptions.area}
              selectedOptions={selectedOptions["ongoing"]["area"]}
              handleCheckboxChange={(e) =>
                handleOngoingCheckBoxChange(e, "area")
              }
            />
          </div>
          {holding ? <div className={styles.area} name="rightArea"></div> : ""}
          <div
            className={styles.ongoing}
            style={holding ? { transform: "translateY(-100%)" } : {}}
          >
            {ongoing.map((item, i) => (
              <div
                key={i}
                onMouseDown={(e) => handleMouseDown(i, "r", item)}
                className={
                  selItem.i === i && selItem.s === "r" ? styles.hide : ""
                }
              >
                <Request
                  request={item}
                  session={session}
                  from_patient={false}
                />
              </div>
            ))}
          </div>
          {holding ? (
            <div className={styles.finishArea} name="rightArea"></div>
          ) : (
            ""
          )}
          <div className={styles.finishArea} name="finishArea"></div>
          <div className={styles.finishButton}>
            <FaCheckCircle size={90} className={styles.finishCheck} />
          </div>
        </div>
      </div>
    </>
  );
}
