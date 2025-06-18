import { useState } from "react";
import "./style.scss";
export default (props) => {
  const { onClick, style } = props;
  const [changeTo, setChangeTo] = useState("add");
  return (
    <div
      className={`bottom-button ${changeTo === "close" ? "change-to-close-btn" : "change-to-add-btn"}`}
      style={style}
      onClick={() => {
        setChangeTo(changeTo === "add" ? "close" : "add");
        onClick(changeTo === "add" ? "close" : "add");
      }}
    >
      <span style={{ fontSize: 40 }}>➕</span>
    </div>
  );
};
