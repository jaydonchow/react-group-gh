import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "@/component/hooks/useContainer";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Decide from "./pages/Decide";
import Demo from "./pages/Demo";
import TagManager from "./pages/Todo/TagManager";
import App from "./App";
import "@nutui/nutui-react/dist/style.css";
import Theme from "./pages/Todo/Theme";

const RouterContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="todo" element={<Todo />} />
        <Route path="decide" element={<Decide />} />
        <Route path="todo/tag_manager" element={<TagManager />} />
        <Route path="todo/theme" element={<Theme />} />
      </Route>
      <Route path="demo" element={<Demo />} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider>
      <RouterContainer></RouterContainer>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
