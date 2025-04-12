import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"
import "./container.css";
import TopNavigation from "../top-navigation/TopNavigation";
import SignIn from "../../routes/forms/SignIn";
import SignUp from "../../routes/forms/SignUp";
import MainRoute from "../../routes/main/Main";
import EventEmitter from "../../utils/EventEmitter";
import MenuItems from "../item-menu/items";
import ProfileRoute from "../../routes/profile/profile";
import Footer from "../footer/Footer";
import UsersContainer from "../users-container/UsersContainer";
import UsersRoute from "../../routes/users/users";
import DiseaseRoute from "../../routes/diseases/disease";
import DiseasesContainer from "../disease-containers/DiseasesContainer";
import UploadContainer from "../disease-containers/UploadContainer";
import QualityRoute from "../../routes/quality/quality";
import StatsRoute from "../../routes/stats/stats";
import IoTRoute from "../../routes/iot/iot";
import QualityContainer from "../quality-container/qualityContainer";
import IOTContainer from "../iot-container/IOTContainer";
import ChartContainer from "../disease-containers/ChartContainer";
import MarkingContainer from "../iot-container/MarkContainer";
import HarvestContainer from "../harvest-container/HarvestContainer";
import HarvestChartContainer from "../harvest-container/HarvestChartContainer";
import ForgotPassword from "../../routes/forms/ForgotPassword";

function Container() {
  const [username, setUsername ] = useState(localStorage.getItem('username'));
  const [role, setRole ] = useState(localStorage.getItem('role'));
  const [logged, setLogged ] = useState(false);

  const handleSession = () => {
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('role'));
    setLogged(true);
  }

  const handleLogout = () => {
    setUsername(null);
    setRole(null);
    setLogged(false);
    localStorage.clear();
  }

  const loadSession = () => {
    if(localStorage.getItem('username')){
      setLogged(true)
      setUsername(localStorage.getItem('username'));
      setRole(localStorage.getItem('role'));
    } else {
      setLogged(false);
    }
  }

  useEffect(() => {
    loadSession();
    let listner = EventEmitter.addListener('login', handleSession);
    let listner2 = EventEmitter.addListener('logout', handleLogout);

    return () => {
      listner.remove();
      listner2.remove();
    }

  }, [])
  return (
    <div className="container backg">
      {logged&&<TopNavigation />}
      <Routes>
        <Route path="/" element={<Navigate to={logged?'/main':'main/sign-in'} />} />
        <Route path="/main" element={<MainRoute />}>
          <Route path="" element={<MenuItems />} />
          <Route path="landing" element={<MenuItems />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/users" element={<UsersRoute />}>
          <Route path="" element={<UsersContainer />} />
        </Route>
        <Route path="/diseases" element={<DiseaseRoute />}>
          <Route path="" element={<DiseasesContainer />} />
          <Route path="upload" element={<UploadContainer />} />
        </Route>
        <Route path="/quality" element={<QualityRoute />}>
          <Route path="" element={<QualityContainer />} />
          {/* <Route path="upload" element={<UploadContainer />} /> */}
        </Route>
        <Route path="/stats" element={<StatsRoute />}>
          <Route path="" element={<DiseasesContainer />} />
          <Route path="chart" element={<ChartContainer />} />
        </Route>
        <Route path="/harvest" element={<StatsRoute />}>
          <Route path="" element={<HarvestContainer />} />
          <Route path="chart" element={<HarvestChartContainer />} />
        </Route>
        <Route path="/iot" element={<IoTRoute />}>
          <Route path="" element={<IOTContainer />} />
          <Route path="ml" element={<MarkingContainer />} />
        </Route>
        <Route path="/profile" element={<ProfileRoute />}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default Container;