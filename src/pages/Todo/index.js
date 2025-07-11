import TagListBar from "@/component/TagListBar";
import FloatingButton from "@/component/FloatingButton";
import { useMemo, useRef, useState } from "react";
import { NavBar, Popover, Empty, Dialog, Toast, Swiper } from "@nutui/nutui-react";
import { SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AddItem from "./AddItem";
import { useCategoryStore, useTodoItemStore } from "./utilHooks";
import EmptySvg from "@/assets/empty.svg";
import { useActionSheet, usePopup } from "@/component/taroUtils";
import { deleteTodoItem } from "@/api/todo";
import "./style.scss";

export default () => {
  const [category, refreshCategory] = useCategoryStore();
  const [todoItems, refreshTodoItems] = useTodoItemStore();

  const [activeTagBar, setActiveTagBar] = useState("ALL");
  const [settingShow, setSettingShow] = useState(false);

  const swiperRef = useRef();

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

  const todoSwiperList = useMemo(() => {
    const list = [
      {
        tagId: "ALL",
        list: todoItems,
      },
    ];
    const categoryTag = category.map((cate) => {
      return {
        tagId: cate.id,
        list: [],
      };
    });
    list.push(...categoryTag);
    todoItems.forEach((item) => {
      const l = list.find((i) => i.tagId === item.tagId);
      if (l) {
        l.list.push(item);
      }
    });
    return list;
  }, [todoItems, category]);

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

  console.log('todoSwiperList', todoSwiperList);

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
            location="bottom-end"
            showArrow={false}
            onClose={() => {
              setSettingShow(false);
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
            <SettingOutlined
              style={{ fontSize: 24 }}
              onClick={() => {
                setSettingShow(!settingShow);
              }}
            />
          </Popover>
        }
        left={<span style={{ fontSize: 26, fontWeight: 900 }}>可待之日</span>}
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
          onChange={(value, index) => {
            setActiveTagBar(value);
            swiperRef.current.to(index);
          }}
        ></TagListBar>
      </div>
      <div className="todo-item-scroll-container">
        <Swiper
          autoplay={0}
          loop={false}
          indicator={false}
          ref={swiperRef}
          onChange={(swiperIndex) => {
            setActiveTagBar(todoSwiperList[swiperIndex].tagId);
          }}
          style={{
            overflowX: 'hidden',
            overflowY: 'scroll',
            scrollbarWidth: 'none'
          }}
        >
          {todoSwiperList.map((swiperItem, index) => {
            return (
              <Swiper.Item key={swiperItem.tagId}>
                <div className="todo-item-container">
                  {swiperItem.list.map((item) => {
                    return (
                      <div
                        className={`todo-item ${item.diffDay === 0 ? "todo-item-celebration" : ""}`}
                        key={item.id}
                        onClick={() => handleClickTodoItem(item)}
                      >
                        <div className="icon">{item.icon}</div>
                        <div className="desc">
                          <div>{item.date}</div>
                          <div>{item.desc}</div>
                        </div>
                        {item.diffDay === 0 ? (
                          <div className="today">今天</div>
                        ) : (
                          <div className="upcoming">
                            <div>还有</div>
                            <div className="num">{item.diffDay}</div>
                            <div>天</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {swiperItem.list.length === 0 && <Empty title="空空如也~" imageSize={100} image={EmptySvg} />}
                </div>
              </Swiper.Item>
            );
          })}
        </Swiper>
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
