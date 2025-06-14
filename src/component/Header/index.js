import { useEffect, useRef, useState } from "react";
import { Popup, Avatar, ImageUploader, Toast } from "antd-mobile";
import { LeftOutline, SetOutline, CalendarOutline } from "antd-mobile-icons";

import SearchBox from "../SearchBox";

import "./style.css";
import { getUserProfile, mockUpload, updateUserProfile } from "@/api";
import { Input } from "antd";
import { useFormState } from "@/utils/hooks";
import { usePopup } from "../openPopup";
export default () => {
  const [visible, setVisible] = useState(false);
  const nameRef = useRef();
  const form = useFormState({});
  const open = usePopup();

  const imageUploaderRef = useRef();
  useEffect(() => {
    getUserProfile("6829eee2d3496c42467ade3f").then((user) => {
      form.setValue({ ...user });
    });
  }, []);

  // console.log(form.formValue);
  const handleOpenPopup = () => {
    const destroy = open({
      onMaskClick: () => {
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
          setVisible(true);
        }}
      >
        <Avatar
          src={form.avatarUrl}
          style={{
            "--size": "48px",
            "--border-radius": "50%",
            border: "3px solid #fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        ></Avatar>
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false);
          }}
          onClose={() => {
            setVisible(false);
          }}
          position="left"
          bodyClassName="setting-body"
          getContainer={() => document.querySelector('.personal-wrapper')}
        >
          <div style={{ margin: 20 }}>
            <a onClick={() => setVisible(false)}>
              <LeftOutline fontSize={18} />
              返回
            </a>
          </div>
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <a
              href="#"
              onClick={() => {
                const nativeInput = imageUploaderRef.current?.nativeElement;
                if (nativeInput) {
                  nativeInput.click();
                }
              }}
            >
              更换头像
            </a>
            <ImageUploader
              ref={imageUploaderRef}
              upload={async (file) => {
                const result = await mockUpload(file);
                Toast.show({
                  content: "更新头像...",
                });
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
              style={{ "--cell-size": "100px", display: "none" }}
            />
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
            onChange={(e) => {
              form.setValue({
                name: e.target.value,
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
        </Popup>
      </div>
      <SearchBox
        placeholder={"please enter something"}
        varStyle={{
          "--width": "200px",
          "--height": "32px",
          "--border-width": "2px",
          "--color": "#0078d4",
          "--right": "0px"
        }}
      ></SearchBox>
      <CalendarOutline fontSize={24} />
    </div>
  );
};
