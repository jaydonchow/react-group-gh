import TagListBar from "@/component/TagListBar";
import "./style.scss";
import FloatingButton from "@/component/FloatingButton";
import { useMemo, useState } from "react";
import { NavBar, Popover, Empty, Dialog, Toast } from "@nutui/nutui-react";
import { SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AddItem from "./AddItem";
import { useCategoryStore, useTodoItemStore } from "./utilHooks";
import EmptySvg from "@/assets/empty.svg";
import { useActionSheet, usePopup } from "@/component/taroUtils";
import { deleteTodoItem } from "@/api/todo";

export default () => {
  const [category, refreshCategory] = useCategoryStore();
  const [todoItems, refreshTodoItems] = useTodoItemStore();

  const [activeTagBar, setActiveTagBar] = useState("ALL");
  const [settingShow, setSettingShow] = useState(false);

  const { actionContainer, actionOpen } = useActionSheet([
    {
      title: "修改",
      key: "edit",
    },
    {
      title: "删除",
      key: "delete",
      danger: true,
    },
  ]);

  const filterTodoList = useMemo(() => {
    if (activeTagBar === "ALL") {
      return todoItems;
    } else {
      return todoItems.filter((item) => {
        return item.tagId === activeTagBar;
      });
    }
  }, [activeTagBar, todoItems]);

  const { popupContainer, popupOpen, popupClose } = usePopup({
    style: { height: 675 },
    position: "bottom",
    portal: () => document.body,
  });

  const handleClickTodoItem = (item) => {
    actionOpen({
      onSelect: ({ key }) => {
        if (key === "edit") {
          popupOpen(
            <AddItem
              type={"edit"}
              defaultValue={item}
              onConfirm={() => {
                refreshTodoItems();
                popupClose();
              }}
            ></AddItem>
          );
        }
        if (key === "delete") {
          Dialog.alert({
            content: "确定删除该日子吗？",
            onConfirm() {
              deleteTodoItem(item.id)
                .then((res) => {
                  refreshTodoItems();
                })
                .catch((err) => {
                  Toast.show(err);
                });
            },
          });
        }
      },
    });
  };

  // const { category } = store;
  return (
    <div className="todo-page">
      {popupContainer}
      {actionContainer}
      <NavBar
        right={
          <Popover
            visible={settingShow}
            theme="dark"
            location="bottom-right"
            onClick={() => {
              setSettingShow(!settingShow);
            }}
            style={{
              "--nutui-popover-padding": "12px",
              "--nutui-color-mask": "#424242",
            }}
            list={[
              {
                key: "key1",
                name: (
                  <div style={{ padding: "10px" }}>
                    <Link to="/todo/tag_manager" style={{ color: "#fff" }}>
                      标签管理
                    </Link>
                  </div>
                ),
              },
            ]}
          >
            <SettingOutlined style={{ fontSize: 24 }} />
          </Popover>
        }
        left={<span style={{ fontSize: 20, fontWeight: 700 }}>待办清单</span>}
        back={null}
        className="todo-nav-bar"
        style={{
          height: 80,
        }}
      />
      <div>
        <TagListBar
          list={category}
          active={activeTagBar}
          onChange={(v) => {
            console.log(v);
            setActiveTagBar(v);
          }}
        ></TagListBar>
      </div>
      <div className="todo-item-container">
        {filterTodoList.map((item) => {
          return (
            <div className="todo-item" key={item.id} onClick={() => handleClickTodoItem(item)}>
              <div className="icon">{item.icon}</div>
              <div className="desc">
                <div>{item.desc}</div>
                <div>{item.date}</div>
              </div>
              <div className="upcoming">
                <div>{item.diffDay}</div>
                <div>天后</div>
              </div>
            </div>
          );
        })}
        {filterTodoList.length === 0 && <Empty title="空空如也~" imageSize={100} image={EmptySvg} />}
      </div>
      <FloatingButton
        className="floating-button"
        onClick={() => {
          popupOpen(
            <AddItem
              type={"add"}
              defaultValue={{
                tagId: activeTagBar,
              }}
              onConfirm={() => {
                refreshTodoItems();
                popupClose();
              }}
            ></AddItem>
          );
        }}
      ></FloatingButton>
    </div>
  );
};
