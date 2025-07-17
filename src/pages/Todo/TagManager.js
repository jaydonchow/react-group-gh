import {
  addCategoryItem,
  deleteCategoryAndChildren,
  deleteCategoryAndTransferTo,
  updateCategoryItem,
  updateCategoryItemOrder,
} from "@/api/todo";
import { useActionSheet, useCategoryDialog, useInputDialog } from "@/component/taroUtils";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, CellGroup, NavBar } from "@nutui/nutui-react";
import { useCategoryStore, useTodoItemStore } from "./utilHooks";
import { useNavigate } from "react-router-dom";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import DragCard from "@/component/DragCard";

export default () => {
  const [category, refresh] = useCategoryStore();
  const [todoItems, refreshTodoItems] = useTodoItemStore();
  const navigate = useNavigate();

  const openDialog = useInputDialog();
  const openDeleteCategoryDialog = useCategoryDialog();
  const { actionContainer, actionOpen } = useActionSheet([
    {
      title: "重命名",
      key: "rename",
    },
    {
      title: "删除",
      key: "delete",
      danger: true,
    },
  ]);
  const fetchAddCategoryItem = (label) => {
    addCategoryItem({
      label: label,
      order: 1,
    }).then((res) => {
      refresh();
    });
  };

  const renameCategory = (cate) => {
    openDialog({
      defaultValue: cate.label,
      title: "修改标签",
      maxLength: 10,
      onConfirm: async (label) => {
        console.log(label);
        await updateCategoryItem({
          id: cate.value,
          label,
        });
        refresh();
      },
    });
  };

  const deleteCategory = (cate) => {
    openDeleteCategoryDialog({
      title: "是否删除标签？",
      options: category.filter((v) => v.value !== cate.value),
      onConfirm({ checked, tagId }) {
        if (checked) {
          // transfer todo item
          deleteCategoryAndTransferTo(cate.id, tagId).then(() => {
            refresh();
            refreshTodoItems();
          });
        } else {
          // delete todo item
          deleteCategoryAndChildren(cate.id).then((res) => {
            refresh();
          });
        }
      },
    });
  };

  const moveCard = (dragIndex, hoverIndex) => {
    const draggedCard = category[dragIndex];
    // 创建新数组并移动卡片
    const newCategory = [...category];
    newCategory.splice(dragIndex, 1);
    newCategory.splice(hoverIndex, 0, draggedCard);
    refresh(newCategory);
  };

  const updateCategoryOrder = () => {
    const orderMap = category.reduce((pre, cur, index) => {
      let next = pre;
      const key = pre[cur.id];
      if (!key) {
        next = Object.assign(pre, {
          [cur.id]: index,
        });
      }
      return next;
    }, {});
    updateCategoryItemOrder(orderMap).then((res) => {
      refresh(res);
    });
  };

  if (category && category.length > 0) {
    return (
      <div>
        {actionContainer}
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
                openDialog({
                  title: "新增标签",
                  maxLength: 10,
                  onConfirm: (value) => {
                    fetchAddCategoryItem(value);
                  },
                });
              }}
            >
              新增
            </Button>
          }
        >
          <b>标签管理</b>
        </NavBar>
        <DndProvider backend={TouchBackend}>
          <CellGroup divider={false} style={{ "--nutui-cell-group-wrap-margin": 0 }}>
            {category.map((cate, index) => {
              // return CategoryItemRender(cate, index);
              return (
                <DragCard
                  key={cate.id}
                  id={cate.id}
                  index={index}
                  value={cate.value}
                  label={cate.label}
                  moveCard={moveCard}
                  onItemClick={() => {
                    actionOpen({
                      onSelect({ key }) {
                        if (key === "rename") {
                          renameCategory(cate);
                        }
                        if (key === "delete") {
                          deleteCategory(cate);
                        }
                      },
                    });
                  }}
                  onDropEnd={updateCategoryOrder}
                ></DragCard>
              );
            })}
          </CellGroup>
        </DndProvider>
      </div>
    );
  }

  return <div></div>;
};
