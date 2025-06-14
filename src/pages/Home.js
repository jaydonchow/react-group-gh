import React, { useEffect, useState } from "react";
import { ErrorBlock, Toast, Popup } from "antd-mobile";
import { SetOutline, AddOutline } from "antd-mobile-icons";

import AddDataForm from "@/component/AddDataForm";
import TimelineContent from "@/component/TimelineContent";
import thImage from "@/assets/th.jpg";
import seaImage from "@/assets/sea.jpg";
import birdImage from "@/assets/bird.jpg";
import lionImage from "@/assets/lion.jpg";
import { addNoteItem, queryByUserId, updateNoteItem, deleteNoteItem, getUserProfile } from "../api/index";
import Header from "@/component/Header";
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
      console.log("fetchData", res);
      res = [
        {
          description: "今天生日，一起吃烤肉!!",
          dateValue: "2025-05-13",
          title: "",
          userId: "1",
          fileList: [
            {
              url: thImage,
            },
            {
              url: seaImage,
            },
            {
              url: birdImage,
            },
          ],
          id: "68280568b9570274df1a7654",
        },
        {
          description: "云南之旅",
          dateValue: "2025-05-01",
          userId: "1",
          fileList: [
            {
              url: seaImage,
            },
            {
              url: lionImage,
            },
          ],
          id: "682b582bd3496c4246834e09",
        },
        {
          description: "开心开心",
          dateValue: "2025-06-12",
          userId: "1",
          fileList: [
            {
              url: birdImage,
            },
          ],
          id: "684a9f51bf6625518c5a4e21",
        },
      ];
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
      <div
        className={`bottom-button ${visible ? "change-to-close-btn" : "change-to-add-btn"}`}
        onClick={() => {
          // query();
          setVisible(!visible);
          setEditData(null);
        }}
      >
        <AddOutline fontSize={36} fontWeight={900} color="#fff" />
      </div>
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
          height: "100vh",
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
