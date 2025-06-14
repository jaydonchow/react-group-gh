import React, { useState } from "react";
import { NavBar, TabBar } from "antd-mobile";
import { AppOutline, UnorderedListOutline } from "antd-mobile-icons";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./style.scss";

import Home from "./Home";
import Todo from "./Todo";

export default () => {
  const [activeTab, setActiveTab] = useState("/home");
  const navigate = useNavigate();
  const tabs = [
    {
      key: "/home",
      title: "日迹",
      icon: <AppOutline />,
    },
    {
      key: "/todo",
      title: "可待",
      icon: <UnorderedListOutline />,
    }
  ];

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
      <TabBar
        className="bottom-tab-bar"
        activeKey={activeTab}
        onChange={(value) => {
          setActiveTab(value);
          navigate(value);
        }}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};
