import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import user from "./user.png";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import { useDropzone } from "react-dropzone";
import { vars } from '../../environment/variables';
import axios from "axios";


const detailsList = {
  "Bean Rot": [
    { solution: "Inspect soil drainage and improve if necessary." },
    { solution: "Avoid overwatering; let the soil dry between watering." },
  ],
  "Black Crust": [
    { solution: "Inspect for fungal infections and treat accordingly." },
    { solution: "Ensure proper air circulation around the plant." },
  ],
  "Damaged": [
    { solution: "Identify the cause of damage and address it accordingly." },
    { solution: "Prune damaged or affected parts of the plant." },
  ],
  "Fungal Disease": [
    { solution: "Apply appropriate fungicides as per recommended dosage." },
    { solution: "Remove and dispose of affected plant parts." },
  ],
  "Healthy": [
    { solution: "Continue providing optimal care for a healthy plant." },
    { solution: "Monitor regularly for any signs of issues." },
  ],
  "Mosaic Virus": [
    { solution: "Isolate infected plants to prevent the spread of the virus." },
    { solution: "Remove and destroy infected plant material." },
  ],
  "Root Rot": [
    { solution: "Improve soil drainage to prevent waterlogging." },
    { solution: "Adjust watering practices and avoid overwatering." },
  ]
};

function UploadContainer() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState([])
  const [imagePreview, setImagePreview] = useState(null);
  const links = [
    { to: '/diseases', name: 'Reported Cases' },
    { to: '/diseases/upload', name: 'Disease Upload' }
  ];

  const loadData = async () => {
    
  }

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(vars.ML_URL + '/predict', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData.disease);
        setDetails(detailsList[responseData.disease]);
        console.log(details)
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReport = async () => {
    let date = new Date();
    let bindDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  
    let obj = {
      date: bindDate,
      cause: data,
      reportedBy: localStorage.getItem("username")
    }
    await axios.post(`${vars.SERVER_URL}/reports/add`, obj).then((response) => {
      Notiflix.Report.success(
          'Success',
          "New Report was added",
          'Okay',
      );
    })
  }

  

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelected(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        handleFileUpload(file);
        reader.readAsDataURL(file);
      }
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="cards">
      <div className="filters">
        <div className="popular">
          <h2>Disease Inpection</h2>
        </div>
        <FilterGroup links={links} />
      </div>

      <main>
        <div className="sect-search"></div>

        <div className="sect-list">
          <div className="upload-area" {...getRootProps()}>
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            ) : (
              <div className="image-preview">
                <div className="up-msg">
                  <h4>Uplad or Drop Image HERE</h4>
                  <br></br>
                  <AiOutlineFileImage className="icon"/>
                </div>
                
              </div>
            )}
          </div>
          <div className="results-area">
            {data&&<span className="topic">Results</span>}
            {
              data&&<p>MODEL PREDICTION: <b>{data}</b><br></br><br></br>SOLUTIONS:</p>
            }

            {
              details&&details.length>0&&details.map((item, index) => <p>({index+1}) {item.solution}</p>)
            }

            {
              data&&data!=="Healthy"&&<>
              <br></br>
              <button id="submitBtn" onClick={handleReport} className="submit-button danger">Report Issue</button>
              </>
            }
          </div>
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

export default UploadContainer;
