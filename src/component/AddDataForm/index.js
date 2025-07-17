import { useEffect, useState } from "react";
// import dayjs from "dayjs";
import "./style.css";
import { mockUpload } from "@/api";
import { useFormState } from "@/utils/hooks";
import { DatePicker, TextArea, Input, Button, Uploader } from "@nutui/nutui-react";
import { format } from "@/utils";

export default (props) => {
  const { inputData, onSave } = props;

  const [show, setShow] = useState(false);

  const form = useFormState(() => {
    const today = format(new Date());
    return {
      // title: "",
      description: "",
      dateValue: today,
      fileList: [],
    };
  });

  useEffect(() => {
    if (inputData) {
      console.log(inputData);
      form.setValue({ ...inputData });
    }
  }, [inputData]);

  return (
    <div className="modal-inner-content">
      <div className="modal-inner-control">
        <div className="emoji">✍️</div>
        <TextArea
          plain={false}
          placeholder="分享此刻的心情~"
          maxLength={200}
          showCount={true}
          rows={10}
          defaultValue={form.description}
          onChange={(value) => {
            form.setValue({
              description: value,
            });
          }}
          onBlur={() => console.log("blur")}
          onFocus={() => console.log("focus")}
        />
        <div className="emoji">⏱️</div>
        <Input
          value={form.dateValue}
          placeholder="请输入文本"
          type="text"
          readOnly={true}
          onClick={() => {
            setShow(true);
          }}
        />
        <div className="emoji">📷</div>
        <Uploader
          value={form.fileList}
          onChange={(items) => {
            form.setValue({ fileList: items });
          }}
          accept="image/*"
          upload={(file) => mockUpload(file)}
          maxCount={3}
          multiple
        />
      </div>
      <div className="modal-inner-footer">
        <Button
          block
          type="primary"
          shape="round"
          size="large"
          onClick={() => onSave(form.formValue, inputData ? "edit" : "add")}
        >
          保存
        </Button>
      </div>
      <DatePicker
        title="日期选择"
        visible={show}
        defaultValue={new Date(form.dateValue)}
        showChinese
        threeDimensional={true}
        onCancel={() => setShow(false)}
        onConfirm={(options, value) => {
          form.setValue({
            dateValue: value.join("-"),
          });
          setShow(false);
        }}
      />
    </div>
  );
};
