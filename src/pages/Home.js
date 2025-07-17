import React, { useEffect, useState } from "react";

import AddDataForm from "@/component/AddDataForm";
import TimelineContent from "@/component/TimelineContent";
import { addNoteItem, queryNotesByUserId, updateNoteItem, deleteNoteItem, getUserProfile } from "@/api/index";
import Header from "@/component/Header";
import FloatingButton from "@/component/FloatingButton";
import { Popup, Empty, Toast } from "@nutui/nutui-react";
import EmptySvg from '@/assets/empty.svg';
export default () => {
  const [visible, setVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [editData, setEditData] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    queryNotesByUserId().then((res) => {
      if (isFirstLoad === 0) {
        setIsFirstLoad(1);
      }
      setIsFirstLoad(2);
      setDataList(res);
    });
  }

  function handleEdit(eData) {
    setEditData(eData);
    setVisible(true);
  }

  return (
    <div>
      <Header></Header>
      {dataList.length === 0 ? (
        <Empty
          style={{
            marginTop: 120,
          }}
          image={EmptySvg}
          title="找不到数据"
          description="快点记下你的生活痕迹吧！"
        />
      ) : (
        <TimelineContent
          isFirstLoad={isFirstLoad === 1}
          dataList={dataList}
          onDeleteFn={(id) => {
            deleteNoteItem(id).then(() => {
              fetchData();
              Toast.show("删除成功");
            });
          }}
          onEditFn={handleEdit}
        ></TimelineContent>
      )}
      <FloatingButton
        onClick={() => {
          // query();
          setVisible(!visible);
          setEditData(null);
        }}
        style={{
          "--after-bottom": "calc(-80vh + 50px + 20px)",
        }}
      ></FloatingButton>
      <Popup
        closeable
        visible={visible}
        title="标题"
        position="bottom"
        onMaskClick={() => {
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
      >
        <AddDataForm
          inputData={editData}
          onSave={async (formData, type) => {
            setVisible(false);
            console.log(formData);
            if (type === "add") {
              await addNoteItem(formData);
            }
            if (type === "edit") {
              await updateNoteItem(formData);
              setEditData(null);
            }
            fetchData();
          }}
        ></AddDataForm>
      </Popup>
    </div>
  );
};
