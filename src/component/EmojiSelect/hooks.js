import React, { useEffect, useRef, useState } from "react";

function useMouseScroll({ selector, direction = "vertical", factor = 1 }) {
  const stateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    const element = typeof selector === "string" ? document.querySelector(selector) : selector.current || selector;

    if (!element) return;

    const handleMouseDown = (e) => {
      stateRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop,
      };
      element.style.cursor = "grabbing";
      element.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
      if (!stateRef.current.isDragging) return;

      const { startX, startY, scrollLeft, scrollTop } = stateRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (direction !== "vertical") element.scrollLeft = scrollLeft - dx;
      if (direction !== "horizontal") element.scrollTop = scrollTop - dy;
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
      element.style.cursor = "grab";
      element.style.userSelect = "";
    };

    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selector, direction]);
}

/**
 * 长按事件 Hook（短按触发 click，长按阻止默认行为）
 * @returns {function} fn(event, delay, callback) - 用于绑定到 onTouchStart
 */
function useLongPress() {
  let timer = null;
  let isLongPress = false;

  const startLongPress = (event, delay, callback) => {
    isLongPress = false; // 重置状态

    // 启动长按检测
    timer = setTimeout(() => {
      isLongPress = true;
      event.preventDefault(); // 阻止默认行为（如滚动、高亮）
      callback(event);
    }, delay);

    // 添加取消逻辑
    const touchTarget = event.currentTarget || event.target;
    const cancelLongPress = (e) => {
      clearTimeout(timer);
      // 如果是短按（未达到长按时间），允许默认 click 行为
      if (!isLongPress) return;
      // 如果是长按，阻止 touchmove/touchend 的默认行为
      e.preventDefault();
    };

    touchTarget.addEventListener("touchmove", cancelLongPress, { once: true, passive: false });
    touchTarget.addEventListener("touchend", cancelLongPress, { once: true, passive: false });
  };

  return startLongPress;
}

export {
  useMouseScroll,
  useLongPress
}