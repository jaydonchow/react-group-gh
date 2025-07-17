import { useState, useRef, useMemo } from "react";
import TagRadio from "./TagListBar/TagRadio";

const { ImagePreview, Popup, Uploader, Dialog, Input, ActionSheet, Switch } = require("@nutui/nutui-react");

function usePreview() {
  const [show, setShow] = useState(false);
  const [images, setImages] = useState(false);
  return {
    container: (
      <ImagePreview
        indicator={false}
        pagination={false}
        autoPlay={false}
        images={images}
        visible={show}
        closeOnContentClick={true}
        onClose={() => setShow(false)}
        style={{ background: "#00000099" }}
      />
    ),
    open: (urls) => {
      if (urls.length > 0) {
        setImages(urls);
        setShow(true);
      }
    },
  };
}

function usePopup(props) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  return {
    popupContainer: (
      <Popup
        visible={show}
        destroyOnClose
        round={false}
        position="bottom"
        onClose={() => {
          setShow(false);
        }}
        style={{
          height: "100%",
        }}
        {...props}
      >
        {ref.current}
      </Popup>
    ),
    popupOpen: (content) => {
      ref.current = content;
      setTimeout(() => {
        setShow(true);
      }, 0);
    },
    popupClose: () => {
      setShow(false);
    },
  };
}

function useUploader(config) {
  const container = (
    <Uploader
      className="use-uploader"
      accept="image/*"
      autoUpload={false}
      maxCount={1}
      deletable={false}
      onChange={(files) => {}}
      {...config}
    ></Uploader>
  );

  const uploaderOpen = () => {
    const target = document.querySelector(".use-uploader .nut-uploader-input"); // WARN TARO
    target.click();
  };

  return {
    uploaderContainer: container,
    uploaderOpen,
  };
}

function useCategoryDialog() {
  const value = useRef({
    tagId: "",
    checked: false,
  });
  const open = (config) => {
    const { className, title, options, onConfirm } = config;
    Dialog.alert({
      className: className || "dialog-func",
      title: title || "",
      content: (
        <div>
          <div>是否保留该标签下的所有项？</div>
          <Switch
            defaultValue={false}
            onChange={(val) => {
              value.current.checked = val;
              const w = document.querySelector(".use-category-dialog-tag-select"); // WARN TARO
              if (val) {
                // show
                w.style.height = "auto";
                value.current.tagId = options[0].value;
              } else {
                w.style.height = "0px";
              }
            }}
          />
          <div className="use-category-dialog-tag-select" style={{ overflow: "hidden", height: 0 }}>
            <div>"该标签下的所有“纪念日”将会被转移至:"</div>
            <TagRadio
              options={options}
              onChange={(val) => {
                value.current.tagId = val;
              }}
              value={options[0].value}
            ></TagRadio>
          </div>
        </div>
      ),
      onConfirm: (e) => {
        onConfirm(value.current);
      },
    });
  };

  return open;
}

function useInputDialog() {
  const value = useRef("");
  const open = (config) => {
    const { className, title, maxLength, placeholder, defaultValue, onConfirm } = config;
    Dialog.alert({
      className: className || "dialog-func",
      title: title || "",
      content: (
        <Input
          variant="filled"
          maxLength={maxLength}
          autoFocus
          plain={false}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={(val) => {
            value.current = val;
          }}
          style={{ border: "3px solid var(--main-color)", borderRadius: '6px' }}
        ></Input>
      ),
      onConfirm: (e) => {
        onConfirm(value.current);
      },
    });
  };

  return open;
}

function useActionSheet(options) {
  const ref = useRef({});
  const [isVisible, setIsVisible] = useState(false);
  const container = (
    <ActionSheet
      visible={isVisible}
      cancelText="取消"
      optionKey={{
        name: "title",
      }}
      options={options}
      onSelect={(option) => {
        const { onSelect } = ref.current;
        setIsVisible(false);
        onSelect(option);
      }}
      onCancel={() => setIsVisible(false)}
    />
  );

  return {
    actionContainer: container,
    actionOpen: (config) => {
      ref.current = config || {};
      setTimeout(() => {
        setIsVisible(true);
      }, 0);
    },
  };
}

export { usePopup, useUploader, useInputDialog, useCategoryDialog, useActionSheet };
