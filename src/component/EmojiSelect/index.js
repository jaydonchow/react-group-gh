import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.scss";
import EmojiCategory from "./EmojiCategory";
import EmojiGroup from "./EmojiGroup";

// https://emojihub.yurace.pro/api/all
function getEmojiData() {
  function handleData(emojiData) {
    const maps = {};
    const category = [];
    emojiData.forEach((emo) => {
      if (!Object.keys(maps).includes(emo.category)) {
        category.push(emo.category);
        Object.assign(maps, {
          [emo.category]: [],
        });
      }

      const skin = skinTone[emo.htmlCode[1]]; // Dark
      if (emo.htmlCode.length > 1 && skin) {
        // 组合形
        const target = maps[emo.category].find((e) => e.htmlCode[0] === emo.htmlCode[0]);
        // htmlSkin： {Dark: "&#127999;"}
        if (target) {
          if (target.htmlSkin) {
            target.htmlSkin[skin] = emo.htmlCode[1];
          } else {
            target.htmlSkin = {
              [skin]: emo.htmlCode[1]
            };
          }
          //
          if (target.unicodeSkin) {
            target.unicodeSkin[skin] = emo.unicode[1];
          } else {
            target.unicodeSkin = {
              [skin]: emo.unicode[1]
            };
          }
        }
      } else {
        maps[emo.category].push(emo);
      }
    });
    const result = {
      category,
      maps,
    };
    localStorage.setItem("emoji_data", JSON.stringify(result));
    return result;
  }

  return new Promise((resolve, reject) => {
    let emojiData = [];
    const emoji_local_data = localStorage.getItem("emoji_data");
    if (emoji_local_data) {
      emojiData = JSON.parse(emoji_local_data);
      resolve(emojiData);
    } else {
      fetch("https://emojihub.yurace.pro/api/all").then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            // resolve(data);
            resolve(handleData(data));
          });
        } else {
          resolve({
            category: [],
            maps: {},
          });
        }
      });
    }
  });
}

/**
[{
  name: "boy, type-4",
  category: "smileys and people",
  group: "person",
  htmlCode: ["&#128102;", "&#127997;"],
  unicode: ["U+1F466", "U+1F3FD"],
}]

[
  "smileys and people",
  "animals and nature",
  "food and drink",
  "travel and places",
  "activities",
  "objects",
  "symbols",
  "flags"
]
 */

let skinTone = {
  "&#127999;": "Dark",
  "&#127998;": "Medium_Dark:",
  "&#127997;": "Medium",
  "&#127996;": "Medium_Light",
  "&#127995;": "Light",
};

export default (props) => {
  const {
    onSelect,
    categoryNames,
    layout = {
      columns: 5, // 列
      rows: 7,
      gap: 10,
      cellSize: 40,
      direction: "top", // top bottom left right
    },
  } = props;
  const [selected, setSelected] = useState([]);

  const [emojiMaps, setEmojiMaps] = useState({});
  const [category, setCategory] = useState([]);

  const [active, setActive] = useState("");

  const injectStyle = useMemo(() => {
    console.log(layout);
    const { columns, rows, gap, cellSize } = layout;
    return {
      "--cell-size": cellSize + "px",
      "--gap": gap + "px",
      "--width": cellSize * rows + "px",
      "--height": cellSize * columns + "px",
    };
  }, layout);

  async function fetchEmojiData() {
    const result = await getEmojiData();
    setCategory(result.category);
    setActive(result.category[0]);
    setEmojiMaps(result.maps);
  }

  useEffect(() => {
    fetchEmojiData();
  }, []);

  return (
    <div className="emoji_select" style={{ ...injectStyle }}>
      <EmojiCategory
        {...{
          category,
          gap: layout.gap,
        }}
        categoryNames={categoryNames}
        value={active}
        onChange={(value) => {
          setActive(value);
        }}
      ></EmojiCategory>

      <div className="emoji_container">
        <EmojiGroup data={emojiMaps[active] || []} onSelect={onSelect}></EmojiGroup>
      </div>
    </div>
  );
};
