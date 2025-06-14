"use client";
import React, { useEffect, useState } from "react";
import { Tag, Image, Popover, ImageViewer, Skeleton } from "antd-mobile";
import { MoreOutline, EditSFill, DeleteOutline, ClockCircleOutline } from "antd-mobile-icons";

import "./style.css";

function isEmpty(value) {
  if (value === null) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return false;
  }
  return !value;
}

export default (props) => {
  const { dataList, onDeleteFn, onEditFn, isFirstLoad } = props;

  const actions = [
    { key: "edit", icon: <EditSFill />, text: "编辑" },
    {
      key: "delete",
      icon: <DeleteOutline color="red" />,
      text: <span style={{ color: "red" }}> 删除</span>,
    },
  ];

  return (
    <div className="timeline-wrapper">
      {isFirstLoad && (
        <div>
          <Skeleton
            animated
            style={{
              "--height": "200px",
              "--border-radius": "8px",
              marginBottom: 20,
            }}
          />
          <Skeleton
            animated
            style={{
              "--height": "200px",
              "--border-radius": "8px",
              marginBottom: 20,
            }}
          />
          <Skeleton
            animated
            style={{
              "--height": "200px",
              "--border-radius": "8px",
              marginBottom: 20,
            }}
          />
        </div>
      )}

      {(dataList || []).map((v) => {
        return (
          <div className="timeline-item">
            <div className="first-section">
              <Tag
                color="#2db7f5"
                round
                style={{ fontSize: 14 }}
                onClick={() => {
                  // openPopup();
                }}
              >
                <ClockCircleOutline style={{ fontSize: 14 }} />
                &nbsp;&nbsp;
                {v.dateValue}
              </Tag>
              <Popover.Menu
                style={{ "--arrow-size": 0 }}
                actions={actions}
                trigger="click"
                placement="bottom-end"
                onAction={(act) => {
                  console.log(act);
                  if (act.key === "delete") {
                    onDeleteFn(v.id);
                    // console.log(v);
                  }
                  if (act.key === "edit") {
                    onEditFn(v);
                  }
                }}
              >
                <div>
                  <MoreOutline fontSize={18} />
                </div>
              </Popover.Menu>
            </div>
            {/* <div style={{ fontSize: "18", fontWeight: 700 }}>{v.title}</div> */}
            <div>{v.description}</div>
            {!isEmpty(v.fileList) && (
              <div className="image-preview">
                {v.fileList.map((l, index) => {
                  return (
                    <Image
                      key={index}
                      src={l.url}
                      width={64}
                      fit="cover"
                      style={{ borderRadius: 8 }}
                      onClick={() => {
                        const urlList = v.fileList.map((f) => f.url);
                        ImageViewer.Multi.show({
                          images: urlList,
                          defaultIndex: index,
                          classNames: { mask: "image-preview-mask" },
                        });
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <div>没有更多啦~</div>
    </div>
  );
};
