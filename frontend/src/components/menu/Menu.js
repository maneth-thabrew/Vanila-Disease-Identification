import React, { useEffect, useState } from "react";
import "./menu.css";
import logo from "./logo.png";
import {
  FaRegChartBar,
  FaUser,
  FaDelicious,
  FaSearch,
  FaBug,
  FaAdjust,
  FaSignOutAlt,
  FaUserEdit,
  FaSignInAlt,
  FaChartLine
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { vars } from "../../environment/variables"
import EventEmitter from "../../utils/EventEmitter";

function Menu() {
  const navigate = useNavigate();
  const [username, setUsername ] = useState(localStorage.getItem('username'));
  const [role, setRole ] = useState(localStorage.getItem('role'));
  const [logged, setLogged ] = useState(false);

  const loadSession = () => {
    if(localStorage.getItem('username')){
      setLogged(true)
      setUsername(localStorage.getItem('username'));
      setRole(localStorage.getItem('role'));
    } else {
      setLogged(false);
    }
  }

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
    EventEmitter.emit("logout", {logout: true});
    navigate("/main/sign-in");
  }

  useEffect(() => {
    loadSession();
    let listner = EventEmitter.addListener('login', handleSession);
    // let listner2 = EventEmitter.addListener('logout', handleLogout);

    return () => {
      listner.remove();
      // listner2.remove();
    }}, 
  [])
  useEffect(() => {
    const mainMenuLi = document
      .getElementById("mainMenu")
      .querySelectorAll("li");

    function changeActive() {
      mainMenuLi.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    }

    mainMenuLi.forEach((n) => n.addEventListener("click", changeActive));
  }, []);

  return (
    <menu>
      <img src={logo} alt="" />

      {logged?<ul id="mainMenu">
        <Icon to={'/'} icon={<FaDelicious />} />
        {localStorage.getItem("role")==="Administrator"&&<Icon to={'/users'} icon={<FaUser />} />}
        <Icon2 to={'/quality'} icon={<FaSearch />} />
        <Icon2 to={'/diseases'} icon={<FaBug />} />
        {/* <Icon2 to={'/stats'} icon={<FaRegChartBar />} />
        <Icon2 to={'/harvest'} icon={<FaChartLine />} />
        <Icon2 to={'/iot'} icon={<FaAdjust />} /> */}
        {/* <Icon icon={<FaMandalorian />} /> */}
      </ul>:<ul id="mainMenu">
        <Icon to={'/main/sign-in'} icon={<FaSignInAlt />} />
        <Icon to={'/main/sign-up'} icon={<FaUserEdit />} />
        {/* <Icon icon={<FaMandalorian />} /> */}
      </ul>}

      <ul className="lastMenu">
        {logged&&<li><a onClick={() => handleLogout()}><FaSignOutAlt /></a></li>}
      </ul>
    </menu>
  );
}

const Icon = ({ icon, to }) => (
  <li>
    <Link to={to}>{icon}</Link>
  </li>
);

const Icon2 = ({ icon, to }) => (
  <li>
    <a href={to}>{icon}</a>
  </li>
);

export default Menu;