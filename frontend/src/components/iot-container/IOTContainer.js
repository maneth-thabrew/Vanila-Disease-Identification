import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import axios from "axios";
import { vars } from "../../environment/variables";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set, onValue } from 'firebase/database';
import "firebase/database";
import {firebaseConfig} from '../../environment/db'


function IOTContainer() {
  const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [waterSwitch, setWaterSwitch] = useState(false);
    const [npk171717Switch, setNPK171717Switch] = useState(false);
    const [npk202020Switch, setNPK202020Switch] = useState(false);
    const [npk301010Switch, setNPK301010Switch] = useState(false);
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const links = [
      { to: '/iot', name: 'Manual' },
      { to: '/iot/ml', name: 'Guided' }
    ];

    const loadData = async () => {
        await axios.get(`${vars.SERVER_URL}/reports`).then((response) =>{
          setData(response.data)
        })
    }

    const loadFirebaseData = () => {
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        const waterRef = ref(database, "water");
        const fertilizerRef = ref(database, "fertilizer");
        const tempRef = ref(database, "temperature");
        const humpRef = ref(database, "humidity");

        onValue(waterRef, (snapshot) => {
            const waterValue = snapshot.val();
            setWaterSwitch(waterValue === 1);
        });

        onValue(tempRef, (snapshot) => {
            const tempValue = snapshot.val();
            setTemperature(tempValue);
        });

        onValue(humpRef, (snapshot) => {
            const humValue = snapshot.val();
            setHumidity(humValue);
        });

        onValue(fertilizerRef, (snapshot) => {
            const fertilizerValue = snapshot.val();
            setNPK171717Switch(fertilizerValue['NPK 17-17-17'] === 1);
            setNPK202020Switch(fertilizerValue['NPK 20-20-20'] === 1);
            setNPK301010Switch(fertilizerValue['NPK 30-10-10'] === 1);
        });
    };

    const handleIOT = async () => {

      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const waterRef = ref(database, "water"); 
      const fertilizerRef = ref(database, "fertilizer"); 
  
      try {
        await set(waterRef, waterSwitch ? 1 : 0);
        await update(fertilizerRef, {
          'NPK 17-17-17': npk171717Switch ? 1 : 0,
          'NPK 20-20-20': npk202020Switch ? 1 : 0,
          'NPK 30-10-10': npk301010Switch ? 1 : 0,
        });
        Notiflix.Report.success(
          "Success",
          "Firebase Database Updated",
          "Okay",
        );
      } catch (error) {
        console.error("Error updating database:", error);
        Notiflix.Report.failure(
          "Error",
          "Failed to update Firebase Database",
          "Okay",
        );
      }
    };

    useEffect(() => {
        loadData()
        loadFirebaseData();
    }, [])
  return (
        <div className="cards">
          <div className="filters">
            <div className="popular">
              <h2>IOT Control Panel</h2>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>

            <div className="flex-sect">
              <div>
                <div className={!npk171717Switch?"demo":"demo-filled"}>
                </div>
                <br></br>
                <span className="label">NPK 17-17-17</span>
                <br></br>
              </div>
              <div>
                <div className={!npk202020Switch?"demo":"demo-filled"}>
                </div>
                <br></br>
                <span className="label">NPK 20-20-20</span>
                <br></br>
              </div>
              <div>
                <div className={!npk301010Switch?"demo":"demo-filled"}>
                </div>
                <br></br>
                <span className="label">NPK 30-10-10</span>
                <br></br>
              </div>
              <div>
                <div className={!waterSwitch?"demo":"demo-water"}>
                </div>
                <br></br>
                <span className="label">Water</span>
                <br></br>
              </div>
              <div>
                <div className={"digi-screen"}>
                  <div>
                    <span>Temperature</span>
                    <br></br>
                    {temperature&&<h4>{temperature} °C</h4>}
                  </div>
                  <div>
                    <span>Humidity</span>
                    <br></br>
                    {humidity&&<h4>{humidity}</h4>}
                  </div>
                  
                </div>
                <br></br>
                <span className="label">Readings</span>
                <br></br>
              </div>
          </div>

            <div className="control-panel">
              <div className="control-item">
                <label>Water (Main)</label>
                <input
                  type="checkbox"
                  checked={waterSwitch}
                  onChange={() => setWaterSwitch(!waterSwitch)}
                />
              </div>

              <div className="control-item">
                <label>NPK 17-17-17</label>
                <input
                  type="checkbox"
                  checked={npk171717Switch}
                  onChange={() => setNPK171717Switch(!npk171717Switch)}
                />
              </div>

              <div className="control-item">
                <label>NPK 20-20-20</label>
                <input
                  type="checkbox"
                  checked={npk202020Switch}
                  onChange={() => setNPK202020Switch(!npk202020Switch)}
                />
              </div>

              <div className="control-item">
                <label>NPK 30-10-10</label>
                <input
                  type="checkbox"
                  checked={npk301010Switch}
                  onChange={() => setNPK301010Switch(!npk301010Switch)}
                />
              </div>
              
            </div>
            <button id="submitBtn" onClick={handleIOT} className="submit-button danger">Send Signal</button>
            
          </main>
        </div>
  );
}

const Icon = ({ icon }) => (
    <li>
      <a>{icon}</a>
    </li>
);

export default IOTContainer;