import { ArrowLeftOutlined, CheckCircleFilled } from "@ant-design/icons";
import { Button, NavBar, Toast } from "@nutui/nutui-react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useEffect, useState } from "react";
import { updateUserProfile } from "@/api";
import { useUserDataStore } from "../utilHooks";

export default () => {
  const navigate = useNavigate();
  const [userData, refresh] = useUserDataStore();
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (userData) {
      setSelected(userData.systemConfig.mainColor);
    }
  }, [userData]);

  const mainColorList = [
    {
      name: "贵族紫",
      value: "#7700ff",
    },
    {
      name: "翡翠绿",
      value: "#2ecc71",
    },
    {
      name: "活力橙",
      value: "#ff9434",
    },
    {
      name: "晴空蓝",
      value: "#19b5fe",
    },
    {
      name: "深海蓝",
      value: "#00007a",
    },
    {
      name: "玫粉红",
      value: "#ff77c1",
    },
  ];
  return (
    <div>
      <NavBar
        style={{
          height: 80,
          padding: "20px 10px",
          borderBottom: "2px solid #99999966",
          marginBottom: 0,
          background: "#fff",
        }}
        back={
          <>
            <ArrowLeftOutlined />
            返回
          </>
        }
        onBackClick={(e) => navigate("/todo")}
        right={
          <Button
            // type="primary"
            // size="large"
            fill="outline"
            style={{
              color: "var(--main-color)",
              borderColor: "var(--main-color)",
            }}
            onClick={() => {
              updateUserProfile({
                id: userData.id,
                systemConfig: {
                  mainColor: selected,
                },
              }).then(() => {
                Toast.show('设置成功！')
                refresh();
              });
            }}
          >
            保存
          </Button>
        }
      >
        <b>主题配置</b>
      </NavBar>
      <div className="theme-container">
        {mainColorList.map((value, index) => {
          return (
            <div className="theme-card" key={index} onClick={() => setSelected(value.value)}>
              <div className="bg" style={{ background: value.value }}>
                {selected === value.value && (
                  <CheckCircleFilled style={{ color: "#fff", fontSize: 40 }}></CheckCircleFilled>
                )}
              </div>
              <div className="title">{value.name}</div>
            </div>
          );
        })}
      </div>
      {/* <Button
        onClick={() => {
          const obj = generateColorVariants();
        }}
      >
        自定义
      </Button> */}
    </div>
  );
};
