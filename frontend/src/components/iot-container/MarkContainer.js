import React, { useState, useEffect } from "react";
import "./container.css";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import axios from "axios";
import { vars } from "../../environment/variables";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set, onValue } from 'firebase/database';
import "firebase/database";
import { firebaseConfig } from '../../environment/db';

function MarkingContainer() {
  const [data, setData] = useState([]);
  const [diseaseSwitch, setDiseaseSwitch] = useState(false);
  const [damageSwitch, setDamageSwitch] = useState(false);
  const [summerSwitch, setSummerSwitch] = useState(false);
  const [seedsSwitch, setSeedsSwitch] = useState(false);
  const [output, setOutput] = useState([0,0,0,0]);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  const links = [
    { to: '/iot', name: 'Manual' },
    { to: '/iot/ml', name: 'Guided' }
  ];

  const loadData = async () => {
    await axios.get(`${vars.SERVER_URL}/reports`).then((response) => {
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
      

      onValue(tempRef, (snapshot) => {
          const tempValue = snapshot.val();
          setTemperature(tempValue);
      });

      onValue(humpRef, (snapshot) => {
          const humValue = snapshot.val();
          setHumidity(humValue);
      });
  };

  const handleMarking = async () => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const waterRef = ref(database, "water"); 
    const fertilizerRef = ref(database, "fertilizer"); 

    try {
        // const formData = new FormData();
        // formData.append('file', file);
        const response = await fetch(vars.ML_URL + '/predict-iot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'diseased': diseaseSwitch,
                'damaged': damageSwitch,
                'summer': summerSwitch,
                'seeds': seedsSwitch,
              }),
        });
      
        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData)
            const outputSignal = responseData.prediction;
            setOutput(outputSignal);

            // Firebae Update
            await set(waterRef, outputSignal[3]);
            await update(fertilizerRef, {
            'NPK 17-17-17': outputSignal[0],
            'NPK 20-20-20': outputSignal[1],
            'NPK 30-10-10': outputSignal[2],
            });

            Notiflix.Report.success(
            "Success",
            "Firebase Database Updated",
            "Okay",
            );
        } else {
            // Handle error response
            const errorData = await response.json();
            console.error(errorData);
        }

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
    loadData();
    loadFirebaseData();
  }, []);

  return (
    <div className="cards">
      <div className="filters">
        <div className="popular">
          <h2>Marking Section</h2>
        </div>
        <FilterGroup links={links} />
      </div>

      <main>
        <div className="flex-sect">
              <div>
                <div className={output[0]===0?"demo":"demo-filled"}>
                </div>
                <br></br>
                <span className="label">NPK 17-17-17</span>
                <br></br>
              </div>
              <div>
                <div className={output[1]===0?"demo":"demo-filled"}>
                </div>
                <br></br>
                <span className="label">NPK 20-20-20</span>
                <br></br>
              </div>
              <div>
                <div className={output[2]===0?"demo":"demo-filled"}>
                </div>
                <br></br>
                <span className="label">NPK 30-10-10</span>
                <br></br>
              </div>
              <div>
                <div className={output[3]===0?"demo":"demo-water"}>
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
            <label>Disease</label>
            <input
              type="checkbox"
              checked={diseaseSwitch}
              onChange={() => setDiseaseSwitch(!diseaseSwitch)}
            />
          </div>

          <div className="control-item">
            <label>Damage</label>
            <input
              type="checkbox"
              checked={damageSwitch}
              onChange={() => setDamageSwitch(!damageSwitch)}
            />
          </div>

          <div className="control-item">
            <label>Summer</label>
            <input
              type="checkbox"
              checked={summerSwitch}
              onChange={() => setSummerSwitch(!summerSwitch)}
            />
          </div>

          <div className="control-item">
            <label>Seeds</label>
            <input
              type="checkbox"
              checked={seedsSwitch}
              onChange={() => setSeedsSwitch(!seedsSwitch)}
            />
          </div>
        </div>
        <button id="submitBtn" onClick={handleMarking} className="submit-button danger">Send Signal</button>
      </main>
    </div>
  );
}

export default MarkingContainer;
