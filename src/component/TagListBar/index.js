import { useEffect, useState } from "react";
import "./style.scss";

const gap = 15;
const padding = 10;

export default (props) => {
  const { list, active = "ALL", onChange } = props;
  // const [activeKey, setActiveKey] = useState(active || "ALL");
  const [width, setWidth] = useState(0);

  // useEffect(() => {
  //   setActiveKey(active);
  // }, [active]);

  useEffect(() => {
    let _width = 0;
    const container = document.querySelector(".tag-list-bar .container");
    [...container.children].forEach((child) => {
      _width += child.clientWidth;
    });
    _width = _width + (gap * container.children.length - 1) + padding * 2;
    setWidth(_width);
  }, [list]);

  const allList = [
    {
      label: "全部",
      value: "ALL",
    },
    ...list,
  ];
  return (
    <div className="tag-list-bar">
      <div
        className="container"
        style={{
          gap: gap,
          padding: padding,
          width: width,
        }}
      >
        {allList.map((item, index) => {
          return (
            <div
              key={item.value}
              className={`ln-tag-item ${item.value === active ? "active" : ""}`}
              onClick={() => {
                // setActiveKey(item.value);
                console.log(item.value);
                
                onChange(item.value, index);
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};