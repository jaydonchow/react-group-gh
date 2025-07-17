import { useEffect, useState } from "react";
import "./style.scss";

const gap = 15;
const padding = 10;

export default (props) => {
  const { list, active = "ALL", onChange } = props;
  // const [activeKey, setActiveKey] = useState(active || "ALL");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = document.querySelector(".tag-list-bar .container");
    const lastChild = container.lastChild;
    const width = lastChild.clientWidth + lastChild.offsetLeft;
    setWidth(width + 10);
  }, [list]);

  // Taro 小程序
  // useReady(() => {
  //   // 初次渲染时，在小程序触发 onReady 后，才能获取小程序的渲染层节点
  //   Taro.createSelectorQuery()
  //     .select('#target')
  //     .boundingClientRect()
  //     .exec(res => console.log(res))
  // })

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