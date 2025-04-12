import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import user from "./user.png";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import axios from "axios";
import { vars } from "../../environment/variables";

function DiseasesContainer() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [damagedCount, setDamagedCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  const links = [
    { to: '/diseases', name: 'Reported Cases' },
    { to: '/stats/chart', name: 'Cases Chart' },
    { to: '/diseases/upload', name: 'Disease Upload' },
    
  ];

    const loadData = async () => {
        await axios.get(`${vars.SERVER_URL}/reports/ofUser/${localStorage.getItem('username')}`).then((response) =>{
          let damagedCount = 0;
          let otherCount = 0;
          setData(response.data);
          response.data.forEach((report) => {
            const cause = report.cause.toLowerCase(); 
            if (cause === 'damaged') {
              damagedCount++;
            } else if (cause !== 'damaged') {
              otherCount++;
            }
          });
          setDamagedCount(damagedCount);
          setOtherCount(otherCount);
        })
    }

    const deleteUsers = async (id) => {
      await UsersService.deleteUser(id).then(() => {
        Notiflix.Report.success(
            'Success',
            "User Deleted",
            'Okay',
        );
        setData(data.filter(d => d.id !== id));
      })
    }

    useEffect(() => {
        loadData()

    }, [])
  return (
        <div className="cards">
          <div className="filters">
            <div className="popular">
              <h2>Disease Statistics</h2>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>
            <div className="sect-search"></div>

            <div className="sect-list">

                
            </div>
            <div className="flex-sect">
              <div>
                <span className="number">{otherCount}</span>
                <br></br>
                <span className="label">Total Recorded Diseases</span>
                <br></br>
                <small>(Last 30 days)</small>
              </div>
              <div>
                <span className="number">{damagedCount}</span>
                <br></br>
                <span className="label">Total Damaged Cases</span>
                <br></br>
                <small>(Last 30 days)</small>
              </div>
            </div>
            <div className="table-container">
              <span className="topic">All Reported Cases</span>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reported Date</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length>0&&data.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.date}</td>
                      <td>{row.cause}</td>
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

export default DiseasesContainer;