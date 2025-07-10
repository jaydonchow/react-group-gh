import { SettingOutlined } from "@ant-design/icons";
import { Popover } from "@nutui/nutui-react";
import { useEffect, useState } from "react";
import { Label, MyDatePicker } from "./Todo/AddItem";
export default () => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("2017-01-01");

  useEffect(() => {
    console.log(show);
  }, [show]);

  return (
    <div>
      <div style={{ float: "right" }}>
        <Popover
          visible={show}
          theme="dark"
          location="bottom-right"
          onClose={() => {
            console.log("close");
            setShow(false);
          }}
          style={{
            "--nutui-popover-padding": "12px",
            "--nutui-color-mask": "#424242",
          }}
          list={[
            {
              key: "key1",
              name: <div style={{ padding: "10px" }}>标签管理</div>,
            },
          ]}
        >
          <SettingOutlined
            style={{ fontSize: 24 }}
            onClick={() => {
              setShow(!show);
            }}
          />
        </Popover>
      </div>
      <div>
        <div>{date}</div>
        <Label
          desc="选择时间"
          content={<MyDatePicker value={date} onChange={(val) => setDate(val)}></MyDatePicker>}
        ></Label>
      </div>
    </div>
  );
};
