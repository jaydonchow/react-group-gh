const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const format = (input) => {
  let obj;
  if (input instanceof Date) {
    obj = {
      year: input.getFullYear(),
      month: input.getMonth() + 1,
      day: input.getDate(),
    };
  } else if (typeof input === "string") {
    const date = new Date(input);
    obj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  } else {
    const date = new Date();
    obj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  const defaultDesc = `${obj.year}-${obj.month}-${obj.day}`;
  return defaultDesc;
};

const calcCountdown = (target) => {
  let today = dayjs().startOf("day"); // 当天0点
  let targetDate = dayjs(target);
  const thisYear = today.year();
  targetDate = targetDate.year(thisYear);
  const isExpired = today.isAfter(targetDate); // 今年是否已过 targetDate
  targetDate = targetDate.year(isExpired ? thisYear + 1 : thisYear);
  const diff = targetDate.diff(today, "day");
  return { diff, isExpired };
};

function generateColorVariants(mainColor) {
  // 辅助函数：十六进制转RGB数组
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // 辅助函数：RGB转十六进制
  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  // 辅助函数：RGB转HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // 灰度
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  // 辅助函数：HSL转RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // 灰度
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // 验证输入格式
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(mainColor)) {
    throw new Error("Invalid HEX color format");
  }

  // 处理简写格式（如#abc -> #aabbcc）
  const fullHex =
    mainColor.length === 4
      ? "#" + mainColor[1] + mainColor[1] + mainColor[2] + mainColor[2] + mainColor[3] + mainColor[3]
      : mainColor;

  // 主色转RGB
  const [r, g, b] = hexToRgb(fullHex);

  // 主色转HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  // 生成停止点1（亮度增加15%）
  const stop1 = hslToRgb(h, s, Math.min(100, l + 15));

  // 生成停止点2（亮度降低15%）
  const stop2 = hslToRgb(h, s, Math.max(0, l - 15));

  // 生成禁用状态（降低饱和度，增加亮度）
  const disabled = hslToRgb(h, Math.max(0, s - 80), Math.min(100, l + 20));

  // 返回CSS变量对象
  return {
    "--main-color": mainColor,
    "--main-stop-1": rgbToHex(...stop1),
    "--main-stop-2": rgbToHex(...stop2),
    "--main-disabled": rgbToHex(...disabled),
  };
}

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

export { generateColorVariants, isEmpty, format, calcCountdown };
