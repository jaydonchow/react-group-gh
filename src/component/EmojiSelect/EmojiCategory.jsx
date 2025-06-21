import React, { useEffect, useState } from "react";
import { useMouseScroll } from "./hooks";

export default function EmojiCategory(props) {
  const { gap, category, value, categoryNames, onChange } = props;

  const [width, setWidth] = useState(0);
  const [slideStyle, setSlideStyle] = useState({});
  const [nameMap, setNameMap] = useState({});
  useMouseScroll({
    selector: `.emoji_category_swiper`,
    direction: "all",
  });

  useEffect(() => {
    console.log("nameMap change");

    let _width = 0;
    const container = document.querySelector(`.emoji_category_container`);
    if (container) {
      [...container.children].forEach((child) => {
        _width += child.clientWidth;
      });
      _width = _width + (gap * container.children.length - 1);
      setWidth(_width);
    }
  }, [nameMap]);

  useEffect(() => {
    console.log("value, nameMap change");

    const nameMaps = category.reduce((pre, cur, index) => {
      return Object.assign(pre, { [cur]: categoryNames[index] || category });
    }, {});
    setNameMap(nameMaps);
  }, [category, categoryNames]);

  useEffect(() => {
    let s = {};
    if (value) {
      const index = category.findIndex((opt) => opt === value);
      const container = document.querySelector(".emoji_category_container");
      if (container) {
        const checkedEle = container.children[index];
        s = {
          width: checkedEle.clientWidth,
          height: checkedEle.clientHeight,
          left: checkedEle.offsetLeft,
        };
      }
    }
    setSlideStyle(s);
  }, [value, nameMap]);

  return (
    <div className="emoji_category_swiper">
      <div className="emoji_category_container" style={{ width, gap: gap }}>
        {category.map((cate) => {
          return (
            <div
              key={cate}
              className={`emoji_category_item ${
                value === cate ? "category_item_active" : ""
              }`}
              onClick={() => {
                console.log(cate);

                // setActive(cate);
                onChange(cate);
              }}
            >
              {nameMap[cate]}
            </div>
          );
        })}
      </div>
      <div className="emoji_sliding_block" style={slideStyle}></div>
    </div>
  );
}
