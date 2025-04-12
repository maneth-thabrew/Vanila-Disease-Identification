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
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function HarvestChartContainer() {
    const [selected, setSelected] = useState(false);
    const [harvest, setHarvest] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [month, setMonth] = useState('01-2024');
    const [records, setRecords] = useState([]);
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [
        {
          label: 'Harvest Data',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
    const options = {
      scales: {
        x: {
          type: 'category', 
          beginAtZero: true,
        },
        y: {
          type: 'linear', 
          beginAtZero: true,
        },
      },
    };
    const links = [
      { to: '/harvest', name: 'Form' },
      { to: '/harvest/chart', name: 'Chart' }
    ];

    const loadData = async () => {
      setSelected(true)
      try {
        await HarvestService.getHarvestsOfUser(localStorage.getItem('username')).then((data) => {
          
          setRecords(data)
        })
        
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    useEffect(() => {
      console.log('xxx')
      loadData();
    }, []);

    useEffect(() => {

      const updateChart = () => {
        console.log(labels)
        setChartData({
          labels: records.map((record) => record.date),
          datasets: [
            {
              label: 'Harvest and Revenue Growth',
              data: records.map((record) => record.harvest),
              backgroundColor: 'rgba(143, 145, 156, 0.6)',
              borderColor: 'rgba(24, 46, 27, 1)', // Custom color
              borderWidth: 2,
            },
          ],
        });
      }

      updateChart()

      
      
    }, [records]);

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
              <h2>Harvest Chart</h2>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>
            <div className="sect-search"></div>
            
            
            {/* HARVEST CHART */}
            <div className="sect-list">
            <Line options={options} data={chartData} />
            </div>
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

export default HarvestChartContainer;