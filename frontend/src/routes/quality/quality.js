import React from "react";
import { Outlet } from 'react-router-dom';
import "../container.css";
import InfoSingle from "../../components/info-box/Info";

function QualityRoute() {
  return (
    <div className="maincontainer">
      <div className="left">
        <Outlet/>
      </div>
      <div className="right">
          <InfoSingle title={"Notice"} messages={[
            "Quality Information."
          ]}/>
      </div>
    </div>
  );
}

export default QualityRoute;