"use client";
import React, { useEffect, useState } from "react";
import { Avatar, ErrorBlock, Toast, Popup } from "antd-mobile";
import { SetOutline, AddOutline } from "antd-mobile-icons";

import AddDataForm from "@/component/AddDataForm";
import TimelineContent from "@/component/TimelineContent";
import SlidingTabs from "@/component/SlidingTabs";

import { addNoteItem, queryByUserId, updateNoteItem, deleteNoteItem, getUserProfile } from "../api/index";
import Header from "@/component/Header";

export default () => {
  const [visible, setVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [editData, setEditData] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    queryByUserId().then((res) => {
      setDataList(res);
    });
  }

  function handleEdit(eData) {
    setEditData(eData);
    setVisible(true);
  }

  return (
    <div className="app-wrapper">
      <Header></Header>
      <SlidingTabs
        defaultValue={"Upcoming"}
        options={[
          {
            value: "Upcoming",
            label: "我们的日常",
            // notification: 2
          },
          {
            value: "Develop",
            label: "Develop",
          },
          {
            value: "Completed",
            label: "Completed",
          },
        ]}
      ></SlidingTabs>
      {dataList.length === 0 && <ErrorBlock status="empty" />}

      <TimelineContent
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
