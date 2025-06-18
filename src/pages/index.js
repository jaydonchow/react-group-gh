import React, { useEffect, useState } from "react";
import { NavBar, TabBar } from "antd-mobile";
import { AppOutline, UnorderedListOutline, CompassOutline } from "antd-mobile-icons";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

import Home from "./Home";
import Todo from "./Todo";
import Decide from "./Decide";
import { Provider } from "@/component/hooks/useContainer";

export default () => {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("/home");
    } else {
      setActiveTab(location.pathname);
    }
  }, []);

  useEffect(() => {
    navigate(activeTab);
  }, [activeTab]);

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
    },
    {
      key: "/decide",
      title: "定啦",
      icon: <CompassOutline />,
    },
  ];

  return (
    <div className="app-wrapper">
      <Provider>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/decide" element={<Decide />} />
        </Routes>
        <TabBar
          className="bottom-tab-bar"
          activeKey={activeTab}
          onChange={(value) => {
            setActiveTab(value);
          }}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </Provider>
    </div>
  );
};
