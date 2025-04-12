import React from "react";
import { Outlet } from 'react-router-dom';
import "../container.css";
import InfoSingle from "../../components/info-box/Info";

function UsersRoute() {
  return (
    <div className="maincontainer">
      <div className="left">
        <Outlet/>
      </div>
      <div className="right">
          <InfoSingle title={"Notice"} messages={[
            "Manage User Information."
          ]}/>
      </div>
    </div>
  );
}

export default UsersRoute;