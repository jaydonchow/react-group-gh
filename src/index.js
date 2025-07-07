import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@nutui/nutui-react/dist/style.css";
import { Provider } from "@/component/hooks/useContainer";
import RouterContainer from "./RouterContainer";

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