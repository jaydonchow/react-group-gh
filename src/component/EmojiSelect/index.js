import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./style.scss";
import useMouseScroll from "@/component/hooks/useMouseScroll";
// https://emojihub.yurace.pro/api/all

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
const gap = 10;
export default (props) => {
  const { limit = 10, multiple, onSelect } = props;

  const [selected, setSelected] = useState([]);

  const [emojiMaps, setEmojiMaps] = useState({});
  const [category, setCategory] = useState([]);

  const [active, setActive] = useState("");
  const [width, setWidth] = useState(0);

  useMouseScroll({
    selector: ".emoji-category-swiper",
    direction: "all",
  });

  async function fetchEmojiData() {
    let emojiData = [];
    const emoji_local_data = localStorage.getItem("emoji_data");
    if (emoji_local_data) {
      emojiData = JSON.parse(emoji_local_data);
    } else {
      const result = await axios("https://emojihub.yurace.pro/api/all", {
        method: "get",
      });
      emojiData = result.data;
      localStorage.setItem("emoji_data", JSON.stringify(emojiData));
    }
    const maps = {};
    const category = [];
    emojiData.forEach((emo) => {
      if (!Object.keys(maps).includes(emo.category)) {
        category.push(emo.category);
        Object.assign(maps, {
          [emo.category]: [],
        });
      }
      maps[emo.category].push(emo);
    });
    setCategory(category);
    setActive(category[0]);
    setEmojiMaps(maps);
  }

  useEffect(() => {
    fetchEmojiData();
  }, []);

  useEffect(() => {
    let _width = 0;
    const container = document.querySelector(".emoji-category-container");
    [...container.children].forEach((child) => {
      _width += child.clientWidth;
    });
    _width = _width + (gap * container.children.length - 1);
    setWidth(_width);
  }, [category]);

  function handleSelectEmoji(data) {
    const unicode = data.unicode.map((code) => code.replace("U+", "0x"));
    const result = String.fromCodePoint(...unicode);
    console.log(data.unicode, result); // 0x1F435

    if (multiple) {
      const value = [...selected, result].slice(0, limit);
      setSelected(value);
      onSelect(value.join(""));
    } else {
      setSelected(result);
      onSelect(result);
    }
  }

  return (
    <div className="emoji-select">
      <div className="emoji-category-swiper">
        <div className="emoji-category-container" style={{ width, gap }}>
          {category.map((cate) => {
            return (
              <div
                key={cate}
                className={`category-item ${active === cate ? "active" : ""}`}
                onClick={() => {
                  setActive(cate);
                }}
              >
                {cate}
              </div>
            );
          })}
        </div>
      </div>
      <div className="emoji-container">
        {(emojiMaps[active] || []).map((emoji) => {
          return (
            <div
              key={emoji.name}
              className="emoji-item"
              dangerouslySetInnerHTML={{ __html: emoji.htmlCode.join("") }}
              onClick={() => {
                handleSelectEmoji(emoji);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
