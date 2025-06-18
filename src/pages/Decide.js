import EmojiSelect from "@/component/EmojiSelect";
import { useState } from "react";

export default () => {
  const [icon, setIcon] = useState();
  return (
    <div>
      做个决定吧！{icon}
      <EmojiSelect
        limit={10}
        value={icon}
        onSelect={(emoji) => {
          setIcon(emoji)
        }}
      ></EmojiSelect>
    </div>
  );
};
