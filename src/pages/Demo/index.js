import { useRef, useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
// import { HTML5Backend } from 'react-dnd-html5-backend'
// import "./style.scss";

// 卡片数据
const initialCards = [
  { id: 1, title: "学习 React", description: "掌握 React 核心概念和 hooks 使用" },
  { id: 2, title: "了解 React DnD", description: "学习使用 react-dnd 实现拖拽功能" },
  { id: 3, title: "创建拖拽组件", description: "实现可拖拽的卡片组件" },
  { id: 4, title: "实现放置区域", description: "创建可以接收拖拽元素的区域" },
  { id: 5, title: "添加动画效果", description: "为拖拽过程添加平滑的动画" },
  { id: 6, title: "优化用户体验", description: "添加视觉反馈和提示信息" },
];

// 拖拽类型常量
const ItemTypes = {
  CARD: "card",
};

// 可拖拽卡片组件
const Card = ({ id, title, description, index, moveCard }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemTypes.CARD,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
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
      console.log(clientOffset);

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
  });
  drop(ref);

  return (
    <div className={`card-wrap ${isDragging ? "dragging" : ""}`} ref={ref}>
      <div ref={dragPreview} className={`card`}>
        <div className="number">{id}</div>
        <div className="content">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
        <div ref={drag} className="drag-icon">
          ≡
        </div>
      </div>
    </div>
  );
};

// 卡片列表组件
const CardList = () => {
  const [cards, setCards] = useState(initialCards);

  const moveCard = (dragIndex, hoverIndex) => {
    const draggedCard = cards[dragIndex];

    // 创建新数组并移动卡片
    const newCards = [...cards];
    newCards.splice(dragIndex, 1);
    newCards.splice(hoverIndex, 0, draggedCard);

    setCards(newCards);
  };

  return (
    <div className="card-list">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          id={card.id}
          index={index}
          title={card.title}
          description={card.description}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};

// 主应用组件
const App = () => {
  return (
    <div className="container">
      <DndProvider backend={TouchBackend} options={{
        delay: 500,
        // enableMouseEvents: true
      }}>
        <CardList />
      </DndProvider>
    </div>
  );
};

export default App;
