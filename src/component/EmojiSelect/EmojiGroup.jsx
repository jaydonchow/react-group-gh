import { Popover } from "antd";
import React, { useState } from "react";
import { useLongPress } from "./hooks";

export default function EmojiGroup(props) {
  const { data, onSelect } = props;

  return data.map((emoji) => {
    return (
      <EmojiItem key={emoji.name} data={emoji} onSelect={onSelect}></EmojiItem>
    );
  });
}

function EmojiItem(props) {
  const { data, onSelect } = props;
  const [open, setOpen] = useState(false);

  const longPressHandler = useLongPress();

  function handleSelectEmoji(data, skinUnicode = []) {
    const unicode = [...data.unicode, ...skinUnicode].map((code) =>
      code.replace("U+", "0x")
    );
    const result = String.fromCodePoint(...unicode);

    console.log({
      unicode: data.unicode,
      htmlCode: data.htmlCode,
      skinUnicode,
      result,
    }); // 0x1F435

    onSelect(result);
    setOpen(false);
  }

  const Content = (emoji) => {
    // emoji.htmlSkin
    const { htmlCode, htmlSkin, unicodeSkin } = emoji;
    if (htmlSkin) {
      return (
        <div className="emoji_skin_group">
          {Object.keys(htmlSkin).map((key) => {
            const value = htmlSkin[key];
            const skinUnicode = unicodeSkin[key];
            return (
              <div
                key={key}
                className="emoji_item"
                dangerouslySetInnerHTML={{ __html: htmlCode.join("") + value }}
                onClick={() => {
                  handleSelectEmoji(emoji, [skinUnicode]);
                }}
              ></div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <Popover
      open={open}
      arrow={false}
      content={Content(data)}
      mouseEnterDelay={0.5}
      getPopupContainer={(node) => node.parentElement}
    >
      <div
        className={`emoji_item ${open ? "emoji_active" : ""}`}
        dangerouslySetInnerHTML={{ __html: data.htmlCode.join("") }}
        onClick={(e) => {
          e.target.classList.add("emoji_active");
          setTimeout(() => {
            e.target.classList.remove("emoji_active");
          }, 200);
          handleSelectEmoji(data);
        }}
        onTouchStart={(e) => {
          longPressHandler(e, 500, () => {
            if (data.htmlSkin) {
              setOpen(true);
            }
          });
        }}
      ></div>
    </Popover>
  );
}
