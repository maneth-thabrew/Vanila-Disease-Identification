import React from "react";
import { Outlet } from 'react-router-dom';
import "../container.css";
import InfoSingle from "../../components/info-box/Info";

function HarvestRoute() {
  return (
    <div className="maincontainer">
      <div className="left">
        <Outlet/>
      </div>
      <div className="right">
          <InfoSingle title={"Notice"} messages={[
            "Harvest Information."
          ]}/>
      </div>
    </div>
  );
}

export default HarvestRoute;