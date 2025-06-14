import React, { useEffect, useState } from "react";
import "./style.css";

export default ({ defaultValue, options, onChange, label }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [styles, setStyles] = useState({});

  useEffect(() => {
    let s = {};
    if (selectedValue) {
      const index = options.findIndex((opt) => opt.value === selectedValue);
      const container = document.querySelector(".sliding-tabs");
      if (container) {
        const checkedEle = container.children[index];
        s = {
          width: checkedEle.clientWidth,
          height: checkedEle.clientHeight,
          left: checkedEle.offsetLeft,
        };
      }
    }
    setStyles(s);
  }, [selectedValue]);

  const handleChange = (value) => {
    if (value !== selectedValue) {
      setSelectedValue(value);
      onChange && onChange(value);
    }
  };

  return (
    <div className="sliding-tabs">
      {options.map((option) => (
        <div
          key={option.value}
          className={`tab-option ${selectedValue === option.value ? "checked" : ""}`}
          onClick={() => handleChange(option.value)}
        >
          <div data-value={option.value}>{option.label}</div>
        </div>
      ))}
      <div className="sliding-block" style={styles}></div>
    </div>
  );
};
