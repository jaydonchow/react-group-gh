import "./style.scss";
import { useMemo, useState } from "react";
import TagRadio from "@/component/TagListBar/TagRadio";
import { addTodoItem, updateTodoItem } from "@/api/todo";
import { useContainer } from "@/component/hooks/useContainer";
import { Button, Input, Popup, DatePicker } from "@nutui/nutui-react";
import { SmileOutlined } from "@ant-design/icons";
import EmojiPicker from "jc-emoji-picker";

const MyDatePicker = (props) => {
  const { value, onChange } = props;
  const [visible, setVisible] = useState(true);

  const defaultValue = useMemo(() => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return new Date();
    }
    return d;
  }, [value]);

  const beforeYears = new Date("1970-01-01");
  const afterYears = new Date("2050-12-31");

  return (
    <>
      <div className="c-date-picker">
        <DatePicker
          visible={visible}
          onClose={() => setVisible(false)}
          startDate={beforeYears}
          endDate={afterYears}
          defaultValue={defaultValue}
          onChange={(values) => {
            const dateArr = values.map(v => v.value);
            const str = dateArr.join("-");
            onChange(str);
          }}
          pickerProps={{
            popupProps: {
              overlay: false,
              className: "c-date-picker-popup",
              round: false,
            },
          }}
        />
      </div>
    </>
  );
};

function Label({ desc, content, className }) {
  return (
    <div className={`item-label ${className}`}>
      <div style={{ marginBottom: 10 }}>
        {desc}
        <span style={{ color: "red" }}>*</span>
      </div>
      <div>{content}</div>
    </div>
  );
}

const AddItem = ({ onConfirm, type, defaultValue = {} }) => {
  const { store, dispatch } = useContainer();

  const [visible, setVisible] = useState(false);

  const [desc, setDesc] = useState(defaultValue.desc);
  const [icon, setIcon] = useState(defaultValue.icon);
  const [date, setDate] = useState(defaultValue.date);
  const [tagId, setTagId] = useState(defaultValue.tagId);
  const { category } = store;

  const handleAddItem = () => {
    addTodoItem({
      userId: "1",
      icon,
      desc,
      date,
      tagId,
    }).then((res) => {
      console.log(res);
      onConfirm();
    });
  };

  const handleEditItem = () => {
    updateTodoItem({
      userId: "1",
      icon,
      desc,
      date,
      tagId,
      id: defaultValue.id,
    }).then((res) => {
      console.log(res);
      onConfirm();
    });
  };

  const passed = useMemo(() => {
    return desc && tagId && date && icon;
  }, [desc, tagId, date, icon]);

  return (
    <div className="todo-add-item-form">
      <div className="icon" id="emoji-selector">
        <span
          onClick={() => {
            setVisible(true);
          }}
        >
          {icon ? icon : <SmileOutlined />}
        </span>
        <Popup
          visible={visible}
          position="center"
          round={true}
          style={{ padding: "10px", width: "90%" }}
          onClose={() => {
            setVisible(false);
          }}
        >
          <EmojiPicker
            value={icon}
            onSelect={(value) => {
              setIcon(value);
              setVisible(false);
            }}
            layout={{
              width: "100%",
              cellSize: 45,
            }}
            categoryNames={["人物", "动物与自然", "食物", "旅行", "活动", "工具", "标志", "旗帜"]}
          ></EmojiPicker>
        </Popup>
      </div>
      <Label
        desc="描述"
        content={
          <Input
            // placeholder="这是什么日子？"
            defaultValue={desc}
            onChange={(value) => {
              setDesc(value);
            }}
            style={{ background: "#f9f9f9" }}
          ></Input>
        }
      ></Label>
      <Label
        desc="选择时间"
        content={<MyDatePicker value={date} onChange={(val) => setDate(val)}></MyDatePicker>}
      ></Label>

      <Label
        desc="分类"
        content={
          <TagRadio
            className="category-select"
            options={category}
            onChange={(value) => {
              setTagId(value);
            }}
            value={tagId}
          ></TagRadio>
        }
      ></Label>

      <Button
        type="primary"
        size="large"
        block
        disabled={!passed}
        onClick={() => {
          if (type === "add") {
            handleAddItem();
          }
          if (type === "edit") {
            handleEditItem();
          }
        }}
      >
        确定
      </Button>
    </div>
  );
};

export default AddItem;

export { MyDatePicker, Label };
