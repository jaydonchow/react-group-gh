import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./app.scss";
import { Tabbar } from "@nutui/nutui-react";
import { Store, List, Phone } from "@nutui/icons-react";
import { getUserProfile } from "./api";
import { useContainer } from "./component/hooks/useContainer";
import { useUserDataStore } from "./pages/Todo/utilHooks";
import { generateColorVariants } from "./utils";
// npm i @phosphor-icons/react
export default () => {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, refresh] = useUserDataStore();
  useEffect(() => {
    console.log("location", location);
    if (location.pathname === "/") {
      setActiveTab("/todo");
    } else {
      setActiveTab(location.pathname);
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      navigate(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (userData) {
      const mainColor = userData.systemConfig.mainColor;
      if(mainColor) {
        const obj = generateColorVariants(mainColor);
        const root = document.documentElement;
        Object.keys(obj).forEach((key) => {
          root.style.setProperty(key, obj[key]);
        });
      }
    }
  }, [userData]);

  const tabs = [
    {
      key: "/home",
      title: "日迹",
      icon: <Store />,
    },
    {
      key: "/todo",
      title: "可待",
      icon: <List />,
    },
    {
      key: "/decide",
      title: "定啦",
      icon: <Phone />,
    },
  ];

  return (
    <div>
      <Outlet />
      {/* <Tabbar
        style={{ width: "calc(100% - 40px)", "--nutui-tabbar-height": "60px", margin: "auto 20px" }}
        className="bottom-tab-bar"
        activeKey={activeTab}
        onSwitch={(value) => {
          const item = tabs[value];
          setActiveTab(item.key);
        }}
      >
        {tabs.map((item) => (
          <Tabbar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </Tabbar> */}
    </div>
  );
};
