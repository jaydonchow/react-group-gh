import { Popup, ImagePreview } from "@nutui/nutui-react";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

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
    setVisible(true);
  }, []);

  return (
    <Popup visible={visible} {...props}>
      {content}
    </Popup>
  );
});

export function usePopup() {
  const ref = useRef();
  const renderContainer = (initProps) => {
    return <PopupContainer ref={ref} {...initProps}></PopupContainer>;
  };

  /**
   * open a popup
   *
   * @param {Object} initProps - The Popup props
   * @return {Function} the function of destroy popup content
   */
  const open = (initProps) => {
    const defaultConfig = {
      onClose: () => {
        ref.current.close();
      },
    };

    initProps.onClose = initProps.onClose || defaultConfig.onClose;

    const div = document.createElement("div");
    div.setAttribute("id", "popup-root");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(renderContainer(initProps));

    return () => {
      ref.current?.close();
      setTimeout(() => {
        ref.current?.close();
        root.unmount();
        div.remove();
      }, 1000);
    };
  };

  return open;
}
