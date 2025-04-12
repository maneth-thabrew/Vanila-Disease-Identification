import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import user from "./user.png";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import axios from "axios";
import { vars } from "../../environment/variables";
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

function ChartContainer() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Party Votes',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [prediction, setPrediction] = useState([]);

  const options = {
    scales: {
      x: {
        type: 'category', // Use 'category' scale for the x-axis
        beginAtZero: true,
      },
      y: {
        type: 'linear', // Use 'linear' scale for the y-axis
        beginAtZero: true,
      },
    },
  };

  const customColors = {
    'history':'rgba(227, 16, 125, 0.6)',
    'forwards': 'rgba(212, 34, 49, 0.6)'
  };

    const links = [
      { to: '/diseases', name: 'Reported Cases' },
      { to: '/stats/chart', name: 'Cases Chart' },
      { to: '/diseases/upload', name: 'Disease Upload' },
      
    ];

    const [monthlyCounts, setMonthlyCounts] = useState({});

    useEffect(() => {
      const loadData = async () => {
        try {
          const response = await axios.get(`${vars.SERVER_URL}/reports/ofUser/${localStorage.getItem('username')}`);
          const reportsData = response.data;
          const counts = {};
          reportsData.forEach((report) => {
            const date = new Date(report.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            counts[monthYear] = (counts[monthYear] || 0) + 1;
          });

          setMonthlyCounts(counts);
          setData(reportsData);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      loadData();
    }, []); 

    useEffect(() => {

      const updateChart = () => {
        setChartData({
          labels: Object.keys(monthlyCounts),
          datasets: [
            {
              label: 'Number of Cases',
              data: Object.values(monthlyCounts),
              backgroundColor: 'rgba(143, 145, 156, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        
        const lastThreeMonths =  Object.keys(monthlyCounts).slice(-3);
        const averageCount = lastThreeMonths.reduce((sum, month) => sum + monthlyCounts[month], 0) / 3;


        const nextThreeMonths = [
          getNextMonth(lastThreeMonths[2]),
          getNextMonth(getNextMonth(lastThreeMonths[2])),
          getNextMonth(getNextMonth(getNextMonth(lastThreeMonths[2])))
        ];
    
        const predictionData = nextThreeMonths.map((month) => ({
          month,
          count: averageCount 
        }));
    
        setPrediction(predictionData);
        console.log(predictionData)
      }

      updateChart()

      
      
    }, [monthlyCounts]);

    const getNextMonth = (currentMonth) => {
      if (currentMonth) {
        const [year, month] = currentMonth.split('-').map(Number);
        if (month === 12) {
          return `${year + 1}-1`;
        } else {
          return `${year}-${month + 1}`;
        }
      }
      return null; // Return null or handle the case when currentMonth is undefined
    };


  return (
        <div className="cards">
          <div className="filters">
            <div className="popular">
              <h2>Disease Chart</h2>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>
            <div className="sect-search"></div>

            <div className="sect-list">
            <Bar options={options} data={chartData} />
            </div>
            
            <div className="table-container">
              <span className="topic">Next Year Predictions</span>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Approximate Count of cases</th>
                  </tr>
                </thead>
                <tbody>
                  {prediction.length>0&&prediction.map((row) => (
                    <tr key={row.id}>
                      <td>{row.month}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default ChartContainer;