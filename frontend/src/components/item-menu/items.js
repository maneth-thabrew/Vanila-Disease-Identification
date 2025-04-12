import React, { useEffect, useState } from "react";
import "./items.css";
import IconGrid from "./icons";

function MenuItems() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    

    useEffect(() => {

    }, [])
  return (
        <div className="cards">
          <div className="filters">
            <div className="popular">
              <h2>Dashboard</h2>
            </div>
            <div className="filter_buttons">
            </div>
          </div>
          <main>
            <div className="sect-search"></div>
            <IconGrid />
          </main>
        </div>
  );
}

const Icon = ({ icon }) => (
    <li>
      <a href="#">{icon}</a>
    </li>
);

export default MenuItems;