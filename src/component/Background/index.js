import React, { useEffect, useMemo, useState } from "react";

const createSlashedBackground = (
  option = {
    color: "#efefef",
    lineWidth: 0.5,
  }
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  for (let offset = 0; offset < canvas.width; offset += 5) {
    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(canvas.width, canvas.width + offset);
    ctx.strokeStyle = option.color;
    ctx.lineWidth = option.lineWidth;
    ctx.stroke();
  }
  for (let offset = 5; offset < canvas.width; offset += 5) {
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(canvas.width + offset, canvas.width);
    ctx.strokeStyle = option.color;
    ctx.lineWidth = option.lineWidth;
    ctx.stroke();
  }
  const base64 = canvas.toDataURL();

  return base64;
};

const Background = ({ overlayClassName, style, children, lineWidth, onClick, theme }) => {
  const [base64, setBase64] = useState();
  useEffect(() => {
    const source = createSlashedBackground({
      color: theme === "light" ? "#efefef" : "#313131",
      lineWidth,
    });
    setBase64(source);
  }, [theme]);

  return (
    <div
      className={overlayClassName}
      style={{
        backgroundImage: `url(${base64})`,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Background;
