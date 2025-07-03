import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import TagRadio from "@/component/TagListBar/TagRadio";
import { addCategoryItem, addTodoItem, updateTodoItem } from "@/api/todo";
import { useContainer } from "@/component/hooks/useContainer";
import { Button, Input, Popup, DatePickerView } from "@nutui/nutui-react";
import { SmileOutlined } from "@ant-design/icons";
import EmojiPicker from "jc-emoji-picker";

const MyDatePicker = (props) => {
  const { value, onChange } = props;
  const [selectValue, setSelectValue] = useState(() => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return new Date();
    }
    return d;
  });

  return (
    <>
      {/* <div>{format(selectValue)}</div> */}
      <div className="c-date-picker">
        <DatePickerView
          defaultValue={selectValue}
          onChange={(_, values) => {
            const str = values.join("-");
            setSelectValue(new Date(str));
            onChange(str);
          }}
          style={{
            "--nutui-picker-item-height": "26px",
            "--nutui-picker-item-text-font-size": 16,
            fontFamily: "Microsoft YaHei",
          }}
        />
      </div>
    </>
  );
};

function Label({ desc, content, className }) {
  return (
    <div className={className}>
      <div style={{ marginBottom: 10 }}>
        {desc}
        <span style={{ color: "red" }}>*</span>
      </div>
      {content}
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
      id: defaultValue.id
    }).then((res) => {
      console.log(res);
      onConfirm();
    });
  };

  const passed = useMemo(() => {
    return desc && tagId;
  }, [desc, tagId]);

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
