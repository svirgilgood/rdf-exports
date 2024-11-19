import React, { useState } from "react";
import "./tabs-style.css";

function Tab({ label, onClick, isActive }) {
  return (
    <div className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
      {label}
    </div>
  );
}

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (index) => {
    setActiveTab(index + 1);
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        {children.map((tab, index) => {
          console.log(tab);

          return (
            <Tab
              key={index}
              label={tab.props.label}
              onClick={() => handleTabClick(index)}
              isActive={index === activeTab}
            />
          );
        })}
      </div>
      <div className="tab-content">{children}</div>
    </div>
  );
}

export { Tab, Tabs };
