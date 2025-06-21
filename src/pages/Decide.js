import EmojiSelect from "@/component/EmojiSelect";
import { useState } from "react";

export default () => {
  const [icon, setIcon] = useState();
  const displayName = ["人物", "动物与自然", "食物", "旅行", "活动", "工具", "标志", "旗帜"];
  return (
    <div>
      做个决定吧！{icon}
      <EmojiSelect
        limit={10}
        value={icon}
        onSelect={(emoji) => {
          setIcon(emoji);
        }}
        categoryNames={displayName}
      ></EmojiSelect>
    </div>
  );
};
