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

export { format, calcCountdown };
