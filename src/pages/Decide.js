import { useState } from "react";
import EmojiPicker from "jc-emoji-picker";
export default () => {
  const [icon, setIcon] = useState("A");
  const displayName = ["人物", "动物与自然", "食物", "旅行", "活动", "工具", "标志", "旗帜"];
  return (
    <div>
      <div>点击{icon}</div>
      <EmojiPicker
        onSelect={(emoji) => {
          setIcon(emoji);
        }}
        categoryNames={displayName}
        layout={{ highlight: "#5b5fc766", width: "300px", height: "220px", cellSize: 40 }}
      ></EmojiPicker>
    </div>
  );
};
