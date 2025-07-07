
import { Cell } from "@nutui/nutui-react";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import './style.scss';
const DragCard = ({ id, value, label, index, moveCard, onItemClick, onDropEnd }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "card",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      const clientOffset = monitor.getClientOffset();
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 只在上半部分或下半部分执行移动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 执行移动
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop(item, monitor) {
      console.log("log dropEnd");
      onDropEnd();
    },
  });
  drop(ref);

  return (
    <div className={`drag-card-wrap ${isDragging ? "dragging" : ""}`} ref={ref} key={id}>
      <div style={{ width: "90%" }}>
        <Cell
          clickable
          onClick={() => {
            onItemClick();
          }}
          radius={0}
          style={{
            padding: "20px",
            borderTop: "none",
            borderBottom: "1px solid #99999966",
          }}
          key={value}
          title={label}
        ></Cell>
      </div>
      <div
        ref={drag}
        className="drag-handle"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className="drag-icon">≡</span>
      </div>
    </div>
  );
};


export default DragCard;