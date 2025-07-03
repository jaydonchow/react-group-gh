import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";

import "./style.scss";
import { getUserProfile, mockUpload, updateUserProfile } from "@/api";
import { useFormState } from "@/utils/hooks";
import { usePopup } from "../openPopup";
import { LeftOutlined, CalendarOutlined } from "@ant-design/icons";
import { Toast, Uploader, Avatar, Popup, Input } from "@nutui/nutui-react";
export default () => {
  const [visible, setVisible] = useState(false);
  const nameRef = useRef();
  const form = useFormState({});
  const open = usePopup();

  useEffect(() => {
    getUserProfile("6829eee2d3496c42467ade3f").then((user) => {
      form.setValue({ ...user });
    });
  }, []);

  // console.log(form.formValue);
  const handleOpenPopup = () => {
    const destroy = open({
      position: "bottom",
      onOverlayClick: () => {
        destroy();
      },
      onClose: () => {
        destroy();
      },
      content: <div>123123</div>,
      bodyStyle: {
        height: "80vh",
      },
    });
  };
  return (
    <div className="personal-wrapper">
      <div
        className={`avatar-setting ${visible ? "header-avatar" : ""}`}
        onClick={() => {
          if (visible === false) {
            setVisible(!visible);
          }
        }}
      >
        <Avatar
          src={form.avatarUrl}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid #fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        ></Avatar>
        <Popup
          visible={visible}
          position="left"
          style={{ width: "100%" }}
          portal={() => document.querySelector(".personal-wrapper")}
        >
          <div className="setting-body">
            <div style={{ padding: 20 }}>
              <a
                onClick={() => {
                  if (visible === true) {
                    setVisible(!visible);
                  }
                }}
              >
                <LeftOutlined size={18} />
                返回
              </a>
            </div>
            <div className="uploader-avatar-component">
              <Uploader
                accept="image/*"
                upload={async (file) => {
                  const result = await mockUpload(file);
                  Toast.show("修改成功");
                  updateUserProfile({
                    id: "6829eee2d3496c42467ade3f",
                    avatarUrl: result.url,
                  }).then(() => {
                    form.setValue({
                      avatarUrl: result.url,
                    });
                  });
                  return result;
                }}
                multiple={false}
                preview={false}
                uploadIcon={<a href="#">更换头像</a>}
              ></Uploader>
            </div>
            <div className="user-info">
              <div className="info-item">
                <span>昵称</span>
                <span
                  onClick={() => {
                    handleOpenPopup();
                  }}
                >
                  {form.name || "昵称"}
                </span>
              </div>
              <div className="info-item">
                <span>账号</span>
                <span>{form.account}</span>
              </div>
            </div>

            <Input
              ref={nameRef}
              enterKeyHint="done"
              variant="borderless"
              value={form.name}
              style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "#424242" }}
              onChange={(value) => {
                form.setValue({
                  name: value,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  e.preventDefault();
                  nameRef.current.blur();
                  updateUserProfile({
                    id: "6829eee2d3496c42467ade3f",
                    name: form.name,
                  });
                }
              }}
            />
          </div>
        </Popup>
      </div>
      {/* <SearchBox
        placeholder={"please enter something"}
        varStyle={{
          "--width": "200px",
          "--height": "32px",
          "--border-width": "2px",
          "--color": "#0078d4",
          "--right": "0px",
        }}
      ></SearchBox> */}
      <CalendarOutlined style={{ fontSize: 20 }} />
    </div>
  );
};
