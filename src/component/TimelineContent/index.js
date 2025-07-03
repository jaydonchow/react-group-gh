"use client";
import React, { useEffect, useState } from "react";
import birdImage from "@/assets/bird.jpg";

import "./style.css";
import { Skeleton, Image, ImagePreview, Tag } from "@nutui/nutui-react";
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import Tooltip from "rc-tooltip";

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

  const [previewList, setPreviewList] = useState([]);

  const actions = [
    {
      key: "edit",
      icon: <EditOutlined />,
      name: "编辑",
    },
    {
      key: "delete",
      icon: <DeleteOutlined style={{ color: "red" }} />,
      name: <span style={{ color: "red" }}> 删除</span>,
    },
  ];

  console.log(dataList);

  return (
    <div className="timeline-wrapper" id="abc">
      {isFirstLoad && (
        <div>
          <Skeleton rows={3} width={"100%"} height={200} style={{ marginBottom: 20 }} />
          <Skeleton rows={3} width={"100%"} height={200} style={{ marginBottom: 20 }} />
          <Skeleton rows={3} width={"100%"} height={200} style={{ marginBottom: 20 }} />
        </div>
      )}
      {(dataList || []).map((v) => {
        return (
          <div className="timeline-item" id={`id-${v.id}`} key={v.id}>
            <div className="first-section">
              <Tag
                background="#2db7f5"
                color="#fff"
                round
                style={{ fontSize: 14 }}
                onClick={() => {
                  // openPopup();
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 14 }} />
                &nbsp;&nbsp;
                {v.dateValue}
              </Tag>
              <ActionMenu
                list={actions}
                targetId={`abc`}
                onSelect={(key) => {
                  const act = key;
                  if (act === "delete") {
                    onDeleteFn(v.id);
                  }
                  if (act === "edit") {
                    onEditFn(v);
                  }
                }}
              >
                <MoreOutlined style={{ fontSize: 18 }} />
              </ActionMenu>
            </div>
            {!isEmpty(v.fileList) && (
              <div className="image-preview">
                {v.fileList.map((l, index) => {
                  return (
                    <Image
                      key={index}
                      src={l.url}
                      width={64}
                      fit="fill"
                      style={{ borderRadius: 8 }}
                      error={<img src={birdImage}></img>}
                      onClick={() => {
                        const urlList = v.fileList.map((f) => ({
                          src: f.url,
                        }));
                        setPreviewList(urlList);
                      }}
                    />
                  );
                })}
              </div>
            )}
            <div>{v.description}</div>
          </div>
        );
      })}
      <div className="no-more">没有更多啦~</div>
      <ImagePreview
        images={previewList}
        visible={previewList.length > 0}
        onClose={() => setPreviewList([])}
        indicator
      />
    </div>
  );
};

function ActionMenu(props) {
  const { children, list, onSelect } = props;
  const [show, setShow] = useState(false);
  return (
    <Tooltip
      visible={show}
      showArrow={false}
      trigger={"click"}
      placement="bottomRight"
      getTooltipContainer={(node) => node}
      zIndex={999}
      styles={{
        root: {
          opacity: 1,
          background: "transparent",
        },
        body: {
          border: "1px solid #f1f4f7",
          borderRadius: "10px",
          padding: "4px",
          width: "80px",
          fontSize: "16px",
        },
      }}
      overlay={
        <div>
          {list.map((item) => {
            return (
              <div
                key={item.key}
                onClick={() => {
                  onSelect(item.key);
                  setShow(false);
                }}
              >
                {item.icon}
                {item.name}
              </div>
            );
          })}
        </div>
      }
    >
      <div
        tabIndex={0}
        onClick={() => {
          setShow(true);
        }}
        onBlur={() => {
          setShow(false);
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
}
