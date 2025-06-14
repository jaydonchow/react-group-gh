import React, { useState, useEffect, useRef } from "react";
import "./Modal.css";

const Modal = ({ children, isOpen: propsIsOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(propsIsOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  // 处理props变化
  useEffect(() => {
    if (propsIsOpen !== isOpen) {
      if (propsIsOpen) {
        // 打开模态框
        setIsOpen(true);
        setIsAnimating(true);
      } else {
        // 关闭模态框
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
        }, 300); // 与CSS动画时间保持一致

        return () => clearTimeout(timer);
      }
    }
  }, [propsIsOpen]);

  // 点击遮罩层关闭
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current && onClose) {
      onClose();
    }
  };

  // 阻止事件冒泡
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // 按ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`modal-backdrop ${isAnimating ? (propsIsOpen ? "opening" : "closing") : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`modal-content ${isAnimating ? (propsIsOpen ? "opening" : "closing") : ""}`}
        onClick={handleContentClick}
      >
        {children}
        {onClose && (
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
