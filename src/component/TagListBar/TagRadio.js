import { useState } from "react";
export default (props) => {
  const { options, onChange, value } = props;
  const [activeKey, setActiveKey] = useState(value ? value : "OTHER");

  return (
    <div className="tag-radio">
      {options.map((op) => {
        return (
          <div
            key={op.value}
            className={`ln-tag-item ${op.value === activeKey ? "active" : ""}`}
            onClick={() => {
              setActiveKey(op.value);
              onChange(op.value);
            }}
          >
            {op.label}
          </div>
        );
      })}
    </div>
  );
};
