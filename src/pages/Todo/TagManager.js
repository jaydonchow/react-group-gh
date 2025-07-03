import {
  addCategoryItem,
  deleteCategoryAndChildren,
  deleteCategoryAndTransferTo,
  updateCategoryItem,
} from "@/api/todo";
import { useActionSheet, useCategoryDialog, useInputDialog } from "@/component/taroUtils";
import { ArrowLeftOutlined, DragOutlined } from "@ant-design/icons";
import { Button, Cell, CellGroup, Dialog, NavBar } from "@nutui/nutui-react";
import { useCategoryStore, useTodoItemStore } from "./utilHooks";
import { useNavigate } from "react-router-dom";

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

  if (category && category.length > 0) {
    return (
      <div>
        {actionContainer}
        <NavBar
          title="标签管理"
          style={{
            height: 80,
            padding: "20px 10px",
            borderBottom: "2px solid #99999966",
          }}
          back={
            <>
              <ArrowLeftOutlined />
              返回
            </>
          }
          onBackClick={(e) => navigate("/todo")}
        />

        <CellGroup divider={false}>
          {category.map((cate, index) => {
            return (
              <div style={{ display: "flex" }}>
                <div style={{ width: "90%" }}>
                  <Cell
                    clickable
                    onClick={() => {
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
                    radius={0}
                    style={{
                      padding: "20px",
                      borderTop: "none",
                      borderBottom: "1px solid #99999966",
                    }}
                    key={cate.value}
                    title={cate.label}
                  ></Cell>
                </div>
                <div
                  style={{
                    width: "10%",
                    textAlign: "center",
                    lineHeight: "60px",
                    background: "#99999922",
                    borderBottom: "1px solid #99999966",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DragOutlined style={{ fontSize: 16 }} />
                </div>
              </div>
            );
          })}
        </CellGroup>

        <Button
          block
          type="primary"
          size="large"
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
      </div>
    );
  }

  return <div></div>;
};
