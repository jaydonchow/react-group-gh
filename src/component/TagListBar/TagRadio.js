import { Input, Tag } from "antd";
import { useState } from "react";
import { AddOutline } from "antd-mobile-icons";

export default (props) => {
  const { options, onChange, onAdd, value } = props;
  const [activeKey, setActiveKey] = useState(value ? value : "OTHER");
  const [status, setStatus] = useState("");
  const [newTag, setNewTag] = useState();

  return (
    <div className="tag-radio">
      {options.map((op) => {
        return (
          <div
            key={op.value}
            className={`ln-tag-item ${op.value === activeKey ? "active" : ""}`}
            onClick={() => {
              setActiveKey(op.value);
              onChange(activeKey);
            }}
          >
            {op.label}
          </div>
        );
      })}
      {status === "input" ? (
        <div className={`ln-tag-input`}>
          <Input
            variant="filled"
            maxLength="6"
            autoFocus
            placeholder="起个名字吧!"
            value={newTag}
            onBlur={() => {
              setStatus("");
              onAdd(newTag);
            }}
            onChange={(e) => {
              setNewTag(e.target.value);
            }}
          ></Input>
        </div>
      ) : (
        <div
          className={`ln-tag-item ln-tag-add`}
          onClick={() => {
            setStatus("input");
          }}
        >
          <AddOutline fontSize={20} fontWeight={700} color="#007aff"></AddOutline>
        </div>
      )}
    </div>
  );
};
