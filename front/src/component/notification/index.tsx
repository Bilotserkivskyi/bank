import "./index.css";
import React from "react";
import { formatTimeAgo } from "../Utils";

type NotificationProps = {
  notification: {
    message: string;
    type: string;
    time: string;
  };
};

const NotificationItem: React.FC<NotificationProps> = ({ notification }) => {
  const { message, type, time } = notification;

  const timeAgo: string = formatTimeAgo(time);

  let logo = "";
  if (type === "Announcement") {
    logo = "./svg/bell-icon.svg";
  } else if (type === "Warning") {
    logo = "./svg/alert-orange.svg";
  } else {
    logo = "./svg/user.svg";
  }

  return (
    <div className="notification">
      <div className="notification__info">
        <img className="notification__img" src={logo} alt="Agent logo" />
        <div className="notification__data">
          <div className="notification__name">{message}</div>
          <div className="notification__details">
            <div className="notification__time">{timeAgo}</div>
            <div className="notification__divider">
              <img src="./svg/point.svg" alt="Point" />
            </div>
            <div className="notification__type">{type}</div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default NotificationItem;