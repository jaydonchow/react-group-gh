import { useEffect, useRef } from "react";


const useMouseScroll = ({ selector, direction = "vertical", factor = 1 }) => {
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
};

export default useMouseScroll;
