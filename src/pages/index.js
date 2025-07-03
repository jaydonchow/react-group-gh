// import React, { useEffect, useState } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import "./style.scss";
// import { Tabbar } from "@nutui/nutui-react";
// import { Store, List, Phone } from "@nutui/icons-react";
// import RouterContainer from "@/RouterContainer";

// export default () => {
//   const [activeTab, setActiveTab] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname === "/") {
//       setActiveTab("/home");
//     } else {
//       setActiveTab(location.pathname);
//     }
//   }, []);

//   useEffect(() => {
//     navigate(activeTab);
//   }, [activeTab]);

//   const tabs = [
//     {
//       key: "/home",
//       title: "日迹",
//       icon: <Store />,
//     },
//     {
//       key: "/todo",
//       title: "可待",
//       icon: <List />,
//     },
//     {
//       key: "/decide",
//       title: "定啦",
//       icon: <Phone />,
//     },
//   ];

//   return (
//     <div className="app-wrapper">
//         <Outlet></Outlet>
//         <Tabbar
//           style={{ width: "calc(100% - 20px)", "--nutui-tabbar-height": "60px" }}
//           className="bottom-tab-bar"
//           activeKey={activeTab}
//           onSwitch={(value) => {
//             const item = tabs[value];
//             setActiveTab(item.key);
//           }}
//         >
//           {tabs.map((item) => (
//             <Tabbar.Item key={item.key} icon={item.icon} title={item.title} />
//           ))}
//         </Tabbar>
//     </div>
//   );
// };
