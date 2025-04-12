import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from 'react-router-dom';
import './profile.css';
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";

function ProfileSingle() {
  const {id} = useParams();
  const [name, setName] = useState(null);
  const [code, setCode] = useState(null);

  const [update, setUpdate] = useState(false);
  const links = [
    // { to: '/graphs', name: 'All' }
  ];

  const handleFormSubmit = async (e) => {
      e.preventDefault();
      
  }


  useEffect(() => {
  }, [])

  return (
        <div className="cards">
          <div className="filters">
            <div className="popular">
              <h2>My Profile</h2>
              <a href="#" className="button2">
                User
              </a>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>
            <div className="ct-info">
                
                <h4>Username: {localStorage.getItem("username")}</h4>
                <p>Role: {localStorage.getItem("role")}</p>
                <br></br><br></br>
                <a href="#" className="button2">
                  User Information
                </a>
                <br></br>
                <br></br>
                <p>Full Name: {localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).fullName:''}</p>
                <p>Contact Number: {localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).contact:''}</p>
            </div>
            
            <br></br>
            <br></br>
          </main>
        </div>
  );
}

const Icon = ({ icon }) => (
  <li>
    <a href="#">{icon}</a>
  </li>
);

export default ProfileSingle;