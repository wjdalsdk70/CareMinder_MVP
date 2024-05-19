import React, { useState, useEffect, useRef } from "react";
import {
  BsQuestionCircleFill,
  BsArrowDownRightCircleFill,
  BsSend,
} from "react-icons/bs";
import moment from "moment";
import 'moment/locale/ko';
import { getTablet, postChatMessage, getChatMessages } from "src/lib/api";

import "./Request.css";
moment.locale('ko');
export default function Request({
  request,
  session,
  from_patient,
  handleNotificationCountChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  const [messageText, setMessageText] = useState("");
  const [chat, setChat] = useState([]);

  const [newMessageCount, setNewMessageCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [tabletName, setTabletName] = useState("");

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    fetchChatMessages();
    getTabletName();
  }, [request]);

  useEffect(() => {
    if (!handleNotificationCountChange) return;
    handleNotificationCountChange(newMessageCount);
  }, [newMessageCount]);

  async function fetchChatMessages() {
    if (!request.id) return;
    try {
      const resp = await getChatMessages(session, request.id);
      const chatLength = chat.filter((message) => {
        return message.from_patient === !from_patient;
      }).length;
      if (prevCount !== chatLength && !isOpen) {
        setPrevCount(chatLength);
        setNewMessageCount((newMessageCount) => newMessageCount + 1);
      }

      setChat(resp);
    } catch (error) {
      console.error("Error fetching chat messages");
    }
  }

  async function newMessage() {
    try {
      const resp = await postChatMessage(session, request.id, {
        text: messageText,
        from_patient: from_patient,
      });
      await fetchChatMessages();
      setMessageText("");
    } catch (error) {
      console.error("Error creating chat messages");
    }
  }

  async function getTabletName() {
    try {
      console.log(request);
      const tablet = await getTablet(request.tablet_id)
      console.log(tablet);
      setTabletName(tablet.name);
    } catch (error) {
      console.error("Error creating chat messages");
    }
  }

  const handleClick = () => {
    setNewMessageCount(0);
    setIsOpen(!isOpen);
  };

  const getStateText = (state) => {
    switch (state) {
      case 0:
        return "Waiting";
      case 1:
        return "Processing";
      case 2:
        return "Finished";
      default:
        return "Unknown State Text";
    }
  };

  const getStateTextKko = (state) => {
    switch (state) {
      case 0:
        return "대기 중";
      case 1:
        return "처리 중";
      case 2:
        return "완료";
      default:
        return "Unknown State Text";
    }
  };

  const timeAgo = (timestamp) => {
    return moment(timestamp).fromNow();
    // return moment(timestamp).fromNow();
  };

  return (
    <div
      key={request.id}
      className={`request-item ${getStateText(request.for_type)}`}
    >
      <div
        className={`top-container ${getStateText(request.for_type)}`}
        onClick={handleClick}
      >
        {newMessageCount > 0 && (
          <span className="notification">{newMessageCount}</span>
        )}
        <div className="icon-container">
          {request.is_question ? (
            <BsQuestionCircleFill size={50} className="icon" />
          ) : (
            <BsArrowDownRightCircleFill size={50} className="icon" />
          )}
        </div>
        <div className="content-container">
          <div className="info-container">
            <h2>
              {from_patient
                ? getStateTextKko(request.state)
                : (request?.area?.name ? request.area.name + ' ' + tabletName : "Unknown Area")}
            </h2>
            <p className="time">{timeAgo(request.time)}</p>
          </div>
          <div className="text-container">
            <h2>{request.text}</h2>
          </div>
        </div>
      </div>
      <div
        className={`chat-container ${getStateText(request.state)} ${isOpen ? "open" : "closed"
          }`}
      >
        <div className="chat-container__messages">
          {chat &&
            chat.map((chatMessage) => {
              return (
                <div
                  key={request.id + "-" + chatMessage.id}
                  className={`chat-item patient-${from_patient
                    ? chatMessage.from_patient
                    : !chatMessage.from_patient
                    }`}
                >
                  <p>{chatMessage.text}</p>
                  <p className="chat-time">{timeAgo(chatMessage.time)}</p>
                </div>
              );
            })}
        </div>
        <div className="chat-container__input">
          <input
            type="text"
            placeholder="Type a message..."
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <button onClick={newMessage}>
            <BsSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
