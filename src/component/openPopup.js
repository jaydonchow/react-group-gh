import { Popup } from "@nutui/nutui-react";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

const PopupContainer = forwardRef((initProps, ref) => {
  const { content, ...props } = initProps;
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      close: () => {
        setVisible(false);
      },
    };
  });

  useEffect(() => {
    console.log("popup init");
    setVisible(true);
  }, []);

  return (
    <Popup visible={visible} {...props} portal={() => document.getElementById("popup-root")}>
      {content}
    </Popup>
  );
});

export function usePopup() {
  const ref = useRef();
  const render = (initProps) => {
    return <PopupContainer ref={ref} {...initProps}></PopupContainer>;
  };

  return (initProps) => {
    const div = document.createElement("div");
    div.setAttribute("id", "popup-root");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(render(initProps));
    return () => {
      ref.current?.close();
      setTimeout(() => {
        ref.current?.close();
        root.unmount();
      }, 1000);
    };
  };
}
