import TagListBar from "@/component/TagListBar";
import { NavBar, Popup, Space, Toast } from "antd-mobile";
import { SetOutline, SmileOutline } from "antd-mobile-icons";
import "./style.scss";
import FloatingButton from "@/component/FloatingButton";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popover } from "antd";
import TagRadio from "@/component/TagListBar/TagRadio";
import { addCategoryItem, queryAllCategory } from "@/api/todo";
import { useContainer } from "@/component/hooks/useContainer";
import EmojiSelect from "@/component/EmojiSelect";

function fetchQueryAllCategory(dispatch) {
  queryAllCategory().then((res) => {
    dispatch({
      type: "CATEGORY",
      payload: res.map((r) => {
        return {
          label: r.label,
          value: r.id,
        };
      }),
    });
  });
}

const AddItem = () => {
  const { store, dispatch } = useContainer();

  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState();
  const [includeTag, setIncludeTag] = useState();
  const { category } = store;

  const displayName = ["人物", "动物与自然", "食物", "旅行", "活动", "工具", "标志", "旗帜"];

  const fetchAddCategoryItem = (label) => {
    addCategoryItem({
      label: label,
      order: 1,
    }).then((res) => {
      fetchQueryAllCategory(dispatch);
    });
  };

  const handleAddItem = () => {

  }

  const passed = useMemo(() => {
    return title && includeTag;
  }, [title, includeTag]);

  return (
    <div className="todo-add-item-form">
      <div className="icon">
        <Popover
          open={visible}
          content={
            <div>
              <EmojiSelect
                value={icon}
                onSelect={(value) => {
                  setIcon(value);
                  setVisible(false);
                }}
                categoryNames={displayName}
              ></EmojiSelect>
            </div>
          }
          trigger="click"
          placement="bottom"
          onOpenChange={() => setVisible(true)}
        >
          <span>{icon ? icon : <SmileOutline />}</span>
        </Popover>
      </div>
      <div>
        <div>
          描述<span style={{ color: "red" }}>*</span>
        </div>
        <Input
          size='large'
          placeholder="这是什么日子？"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></Input>
      </div>
      <div className="category-select">
        <div>
          分类<span style={{ color: "red" }}>*</span>
        </div>
        <TagRadio
          options={category}
          onChange={(value) => {
            setIncludeTag(value);
          }}
          value={includeTag}
          onAdd={(label) => {
            fetchAddCategoryItem(label);
          }}
        ></TagRadio>
      </div>
      <Button type="primary" size="large" block disabled={!passed} onClick={handleAddItem}>
        添加
      </Button>
    </div>
  );
};

export default () => {
  const { store, dispatch } = useContainer();
  const { category } = store;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchQueryAllCategory(dispatch);
  }, []);

  const todoList = [
    {
      id: "1",
      icon: "🎂",
      desc: "10的生日",
      date: "1997/08/03",
    },
    {
      id: "2",
      icon: "🎂",
      desc: "10的生日",
      date: "1997/08/03",
    },
  ];

  // const { category } = store;
  return (
    <div>
      <NavBar
        backIcon={false}
        left={<span style={{ fontSize: 30, fontWeight: 700 }}>待办清单</span>}
        right={<SetOutline fontSize={24} />}
        className="todo-nav-bar"
        style={{
          "--height": 60,
        }}
      ></NavBar>
      <div style={{ marginTop: 80 }}>
        <TagListBar list={category}></TagListBar>
      </div>
      <div className="todo-item-container">
        {todoList.map((item) => {
          return (
            <div className="todo-item" key={item.id}>
              <div className="icon">{item.icon}</div>
              <div className="desc">
                <div>{item.desc}</div>
                <div>{item.date}</div>
              </div>
              <div className="upcoming">
                <div>136</div>
                <div>天后</div>
              </div>
            </div>
          );
        })}
      </div>
      <FloatingButton
        onClick={(changeTo) => {
          if (changeTo === "close") {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }}
        style={{
          "--after-bottom": "calc(-50vh + 50px)",
        }}
      ></FloatingButton>
      <Popup visible={visible} bodyStyle={{ height: "50vh" }} closeOnMaskClick={true}>
        <AddItem></AddItem>
      </Popup>
    </div>
  );
};
