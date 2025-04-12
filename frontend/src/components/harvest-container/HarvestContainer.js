import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import axios from "axios";
import { vars } from "../../environment/variables";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set } from 'firebase/database';
import "firebase/database";
import {firebaseConfig} from '../../environment/db'
import HarvestService from "../../services/Harvest.service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function HarvestContainer() {
  const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [harvest, setHarvest] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [month, setMonth] = useState('01-2024');
    
    const links = [
      { to: '/harvest', name: 'Form' },
      { to: '/harvest/chart', name: 'Chart' }
    ];

    const generateOptions = () => {
      const options = [];
      const startYear = 2023;
      const endYear = 2030; 
      for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
          const monthString = month.toString().padStart(2, '0'); 
          options.push(`${monthString}-${year}`);
        }
      }
      return options;
    };

    

    const addHarvest = async () => {

      let obj = {
        user: localStorage.getItem('username'),
        harvest,
        revenue,
        date: month
      }

      await HarvestService.addHarvest(obj).then(() => {
        Notiflix.Report.success(
          "Success",
          "Record Entered",
          "Okay",
        );
      })

      
    };

  return (
        <div className="cards">
          <div className="filters">
            <div className="popular">
              <h2>Harvest Reporting</h2>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>
            <div className="sect-search"></div>
            <div className="control-panel">
              <div>
                <small>Month</small>
                <select 
                  name="month"
                  placeholder="Select Your District"
                  value={month}
                  onChange={(e)=> setMonth(e.target.value)}
                                    >
                    {generateOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    
                </select>
              </div>
              <div>
                  <small>Harvest (Weight / Kg)</small>
                  <input 
                      name="harvest"
                      type="number" 
                      placeholder="Harvest from Killograms*"
                      value={selected}
                      onChange={(e)=> setHarvest(e.target.value)}
                  />
              </div>
              <div>
                  <small>Revenue (Rs.)</small>
                  <input 
                      name="revenue"
                      type="number" 
                      placeholder="Revenue*"
                      value={selected}
                      onChange={(e)=> setRevenue(e.target.value)}
                  />
              </div>
            </div>
            <button id="submitBtn" onClick={addHarvest} className="submit-button danger">Update</button>
            
            <div>

            </div>
          </main>
        </div>
  );
}

const Icon = ({ icon }) => (
    <li>
      <a>{icon}</a>
    </li>
);

export default HarvestContainer;