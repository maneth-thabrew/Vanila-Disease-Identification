import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import user from "./user.png";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";

function UsersContainer() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const links = [
      { to: '/users', name: 'All Users' }
    ];

    const loadData = async () => {
        await UsersService.getUsers().then((data) => {
            setData(data);
        });
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
              <h2>All Users</h2>
            </div>
            <FilterGroup links={links} />
          </div>

          <main>
            <div className="sect-search"></div>

            <div className="sect-list">
                
                {data&&data.length>0&&data.map((doc, index) => <div className="item" key={index+1}>
                    <div className="profileImage">
                        <img src={user} alt="" />
                    </div>
                    <p onClick={() => console.log("G")}><span className="spe">{doc.username}</span> </p>
                    <p onClick={() => console.log("G")}> {doc.role}</p>
                    
                    
                    <div>
                        <Icon icon={<AiOutlineDelete onClick={() => deleteUsers(doc.id)} />} />
                    </div>
                    
                </div>)}
                
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

export default UsersContainer;