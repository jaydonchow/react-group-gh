import React, { useEffect, useState } from "react";
import { ErrorBlock, Toast, Popup } from "antd-mobile";
import { SetOutline, AddOutline } from "antd-mobile-icons";

import AddDataForm from "@/component/AddDataForm";
import TimelineContent from "@/component/TimelineContent";
import { addNoteItem, queryByUserId, updateNoteItem, deleteNoteItem, getUserProfile } from "../api/index";
import Header from "@/component/Header";
import FloatingButton from "@/component/FloatingButton";
export default () => {
  const [visible, setVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [editData, setEditData] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    queryByUserId().then((res) => {
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
        <ErrorBlock status="empty" style={{ marginTop: 40 }} />
      ) : (
        <TimelineContent
          isFirstLoad={isFirstLoad === 1}
          dataList={dataList}
          onDeleteFn={(id) => {
            deleteNoteItem(id).then(() => {
              fetchData();
              Toast.show({
                content: "删除成功",
              });
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
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
        position="bottom"
        bodyStyle={{
          height: "80vh",
          background: "#f0f0f0",
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
