import { PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import "./style.scss";
export default (props) => {
  const { onClick, style = {} } = props;
  return (
    <div
      style={style}
      className="floating-button"
      onClick={() => {
        onClick();
      }}
    >
      <PlusOutlined></PlusOutlined>
    </div>
  );
};
