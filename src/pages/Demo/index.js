// src/hooks/useDialog.js
import { useState, useCallback } from "react";
import ReactDOM from "react-dom/client";

// 全局 dialog 容器
let dialogContainer = null;
if (typeof document !== "undefined") {
  dialogContainer = document.createElement("div");
  dialogContainer.id = "dialog-root";
  document.body.appendChild(dialogContainer);
}
const root = ReactDOM.createRoot(dialogContainer);

function useDialog() {
  const [content, setContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((content) => {
    setContent(content);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // setTimeout(() => setContent(null), 300);
  }, []);

  // 渲染 Dialog 到 body
  console.log(123);

  if (typeof document !== "undefined" && dialogContainer) {
    root.render(isOpen ? <div>{content}</div> : null);
  }

  return { open, close, isOpen };
}

export default () => {
  const { open, close } = useDialog({
    defaultConfig: "...",
  });

  const [value, setValue] = useState("123");

  return (
    <div
      onClick={() => {
        open(
          <div>
            open dialog
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            ></input>
            <div
              onClick={() => {
                close();
              }}
            >
              x
            </div>
          </div>
        );
      }}
    >
      123
    </div>
  );
};
