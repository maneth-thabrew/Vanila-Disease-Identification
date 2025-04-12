import React from "react";
import { Outlet } from 'react-router-dom';
import "../container.css";
import InfoSingle from "../../components/info-box/Info";
import ProfileSingle from "../../components/profile-single/ProfileSingle";

function ProfileRoute() {
  return (
    <div className="maincontainer">
      <div className="left">
        <ProfileSingle />
      </div>
      <div className="right">
        <InfoSingle title={"Notice"} messages={[
          "Select any of option which are available for you.", 
          ]}/>
      </div>
    </div>
  );
}

export default ProfileRoute;